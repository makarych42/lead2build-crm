import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { hasPermission } from '@/lib/permissions'
import { UserRole } from '@/types'

// GET /api/users - Получить список всех пользователей
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    // Проверка прав доступа
    const userRole = session.user.role as UserRole
    if (!hasPermission(userRole, 'users:view')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const users = await prisma.user.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Ошибка при получении пользователей' },
      { status: 500 }
    )
  }
}

// POST /api/users - Создать нового пользователя
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
    }

    // Проверка прав доступа
    const userRole = session.user.role as UserRole
    if (!hasPermission(userRole, 'users:create')) {
      return NextResponse.json({ error: 'Доступ запрещен' }, { status: 403 })
    }

    const body = await request.json()
    const { name, email, password, role, phone, telegram } = body

    // Валидация
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Имя, email, пароль и роль обязательны' },
        { status: 400 }
      )
    }

    // Проверка на существование email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10)

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        phone,
        telegram,
      },
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
      },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании пользователя' },
      { status: 500 }
    )
  }
}

