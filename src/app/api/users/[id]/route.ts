import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { hasPermission } from '@/lib/permissions'
import { UserRole } from '@/types'

// GET /api/users/[id] - Получить информацию о пользователе
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const userRole = session.user.role as UserRole
    if (!hasPermission(userRole, 'users:view')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        telegram: true,
        avatar: true,
        active: true,
        blocked: true,
        blockedReason: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении пользователя' },
      { status: 500 }
    )
  }
}

// PATCH /api/users/[id] - Обновить пользователя
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    const userRole = session.user.role as UserRole
    const isOwnProfile = session.user.id === params.id

    // Пользователь может редактировать свой профиль или иметь права на редактирование
    if (!isOwnProfile && !hasPermission(userRole, 'users:edit')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, role, phone, telegram, active } = body

    // Проверка существования пользователя
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Если обновляется email, проверить на уникальность
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email уже используется' },
          { status: 400 }
        )
      }
    }

    // Подготовка данных для обновления
    const updateData: any = {}
    
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (phone !== undefined) updateData.phone = phone
    if (telegram !== undefined) updateData.telegram = telegram

    // Только администратор может менять роль и статус активности
    if (hasPermission(userRole, 'users:edit')) {
      if (role !== undefined) updateData.role = role
      if (active !== undefined) updateData.active = active
    }

    // Если обновляется пароль, хешируем его
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Обновление пользователя
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        telegram: true,
        avatar: true,
        active: true,
        blocked: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении пользователя' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Удалить пользователя
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
    if (!hasPermission(userRole, 'users:delete')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    // Нельзя удалить самого себя
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: 'Нельзя удалить свою учетную запись' },
        { status: 400 }
      )
    }

    // Удаление пользователя
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении пользователя' },
      { status: 500 }
    )
  }
}

