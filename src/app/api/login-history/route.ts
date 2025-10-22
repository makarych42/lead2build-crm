import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/permissions'
import { UserRole } from '@/types'

// GET /api/login-history - Получить историю входов
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const userRole = session.user.role as UserRole
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')

    // Проверка прав: либо администратор, либо запрос своей истории
    if (userId && userId !== session.user.id) {
      if (!hasPermission(userRole, 'history:view')) {
        return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
      }
    }

    const where = userId ? { userId } : {}

    const history = await prisma.loginHistory.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    })

    // Статистика
    const stats = await prisma.loginHistory.groupBy({
      by: ['success'],
      where,
      _count: {
        id: true,
      },
    })

    const successCount =
      stats.find((s) => s.success)?._count.id || 0
    const failedCount =
      stats.find((s) => !s.success)?._count.id || 0

    return NextResponse.json({
      history,
      stats: {
        total: successCount + failedCount,
        successful: successCount,
        failed: failedCount,
      },
    })
  } catch (error) {
    console.error('Error fetching login history:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении истории входов' },
      { status: 500 }
    )
  }
}

