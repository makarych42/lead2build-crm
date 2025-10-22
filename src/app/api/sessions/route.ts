import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/permissions'
import { UserRole } from '@/types'

// GET /api/sessions - Получить список активных сессий
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const userRole = session.user.role as UserRole
    
    // Проверка прав: либо администратор, либо запрос своих сессий
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (userId && userId !== session.user.id) {
      if (!hasPermission(userRole, 'sessions:view')) {
        return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
      }
    }

    const where = userId ? { userId } : {}
    
    const sessions = await prisma.session.findMany({
      where: {
        ...where,
        expires: {
          gt: new Date(), // Только активные сессии
        },
      },
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
        expires: 'desc',
      },
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении сессий' },
      { status: 500 }
    )
  }
}

// DELETE /api/sessions - Удалить сессию (выйти с устройства)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const body = await request.json()
    const { sessionId, userId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'ID сессии обязателен' },
        { status: 400 }
      )
    }

    // Проверка прав: либо администратор, либо удаление своей сессии
    const userRole = session.user.role as UserRole
    const targetSession = await prisma.session.findUnique({
      where: { id: sessionId },
    })

    if (!targetSession) {
      return NextResponse.json(
        { error: 'Сессия не найдена' },
        { status: 404 }
      )
    }

    if (
      targetSession.userId !== session.user.id &&
      !hasPermission(userRole, 'sessions:manage')
    ) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    await prisma.session.delete({
      where: { id: sessionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении сессии' },
      { status: 500 }
    )
  }
}

