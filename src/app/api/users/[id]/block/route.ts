import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasPermission } from '@/lib/permissions'
import { UserRole } from '@/types'

// POST /api/users/[id]/block - Заблокировать пользователя
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const userRole = session.user.role as UserRole
    if (!hasPermission(userRole, 'users:block')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    // Нельзя заблокировать самого себя
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: 'Нельзя заблокировать свою учетную запись' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { reason } = body

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        blocked: true,
        blockedReason: reason || 'Заблокирован администратором',
      },
      select: {
        id: true,
        name: true,
        email: true,
        blocked: true,
        blockedReason: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error blocking user:', error)
    return NextResponse.json(
      { error: 'Ошибка при блокировке пользователя' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id]/block - Разблокировать пользователя
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const userRole = session.user.role as UserRole
    if (!hasPermission(userRole, 'users:block')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        blocked: false,
        blockedReason: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        blocked: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error unblocking user:', error)
    return NextResponse.json(
      { error: 'Ошибка при разблокировке пользователя' },
      { status: 500 }
    )
  }
}

