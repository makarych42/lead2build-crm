import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Получаем общую статистику
    const totalLeads = await prisma.lead.count()
    const activeLeads = await prisma.lead.count({
      where: {
        status: {
          in: ['NEW', 'IN_PROGRESS', 'VOTING']
        }
      }
    })
    const completedLeads = await prisma.lead.count({
      where: { status: 'COMPLETED' }
    })
    const rejectedLeads = await prisma.lead.count({
      where: { status: 'REJECTED' }
    })

    // Получаем количество ожидающих обследования
    const pendingInspections = await prisma.inspection.count({
      where: {
        status: {
          in: ['PENDING', 'ASSIGNED']
        }
      }
    })

    // Вычисляем средний срок (в днях) для завершенных проектов
    const completedLeadsWithDates = await prisma.lead.findMany({
      where: { status: 'COMPLETED' },
      select: {
        createdAt: true,
        updatedAt: true
      }
    })

    let avgDuration = 0
    if (completedLeadsWithDates.length > 0) {
      const totalDays = completedLeadsWithDates.reduce((sum: number, lead: any) => {
        const diffTime = Math.abs(lead.updatedAt.getTime() - lead.createdAt.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return sum + diffDays
      }, 0)
      avgDuration = Math.round(totalDays / completedLeadsWithDates.length)
    }

    // Вычисляем процент успешности (завершенные к общему числу не отклоненных)
    const nonRejectedLeads = totalLeads - rejectedLeads
    const successRate = nonRejectedLeads > 0 
      ? Math.round((completedLeads / nonRejectedLeads) * 100) 
      : 0

    // Получаем последние события
    const recentActivity = await prisma.stageHistory.findMany({
      take: 10,
      orderBy: { timestamp: 'desc' },
      include: {
        lead: {
          select: {
            address: true
          }
        }
      }
    })

    // Статистика по этапам
    const stageStats = await prisma.lead.groupBy({
      by: ['currentStage'],
      _count: {
        currentStage: true
      }
    })

    // Статистика по источникам
    const sourceStats = await prisma.lead.groupBy({
      by: ['source'],
      _count: {
        source: true
      }
    })

    return NextResponse.json({
      stats: {
        totalLeads,
        activeLeads,
        completedLeads,
        rejectedLeads,
        avgDuration,
        successRate,
        pendingInspections
      },
      recentActivity: recentActivity.map((activity: any) => ({
        id: activity.id,
        type: getActivityType(activity.stage, activity.status),
        message: generateActivityMessage(activity.stage, activity.status, activity.lead.address),
        timestamp: activity.timestamp
      })),
      stageStats,
      sourceStats
    })
  } catch (error) {
    console.error('Ошибка при получении статистики:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

function getActivityType(stage: string, status: string): string {
  if (stage === 'INITIAL_CONSULTATION' && status === 'NEW') {
    return 'NEW_LEAD'
  }
  if (stage === 'INSPECTION' && status === 'COMPLETED') {
    return 'INSPECTION_COMPLETED'
  }
  if (stage === 'VOTING_PROCESS' && status === 'COMPLETED') {
    return 'VOTING_SUCCESS'
  }
  if (stage === 'TKO_SUBMISSION') {
    return 'DOCUMENTS_READY'
  }
  return 'STAGE_UPDATE'
}

function generateActivityMessage(stage: string, status: string, address: string): string {
  switch (stage) {
    case 'INITIAL_CONSULTATION':
      return `Новый лид: ${address}`
    case 'DOCUMENT_PREPARATION':
      return `Подготовка документов: ${address}`
    case 'INSPECTION':
      return status === 'COMPLETED' 
        ? `Обследование завершено: ${address}`
        : `Назначено обследование: ${address}`
    case 'VOTING_PROCESS':
      return status === 'COMPLETED'
        ? `Голосование успешно: ${address}`
        : `Начато голосование: ${address}`
    case 'TKO_SUBMISSION':
      return `Документы готовы к передаче в ТКО: ${address}`
    case 'CONSTRUCTION_READY':
      return `Готов к строительству: ${address}`
    default:
      return `Обновление этапа: ${address}`
  }
}