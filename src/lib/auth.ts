import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './db'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      active: boolean
      blocked: boolean
    }
  }

  interface User {
    id: string
    email: string
    name: string
    role: string
    active: boolean
    blocked: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: string
    active: boolean
    blocked: boolean
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email и пароль обязательны')
        }

        // Находим пользователя
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          // Логируем неудачную попытку входа
          await prisma.loginHistory.create({
            data: {
              userId: 'unknown',
              success: false,
              reason: 'Пользователь не найден',
            },
          }).catch(() => {
            // Если userId unknown не прошел валидацию, игнорируем
          })
          throw new Error('Неверный email или пароль')
        }

        // Проверяем, заблокирован ли пользователь
        if (user.blocked) {
          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              success: false,
              reason: user.blockedReason || 'Пользователь заблокирован',
            },
          })
          throw new Error(
            user.blockedReason || 'Ваша учетная запись заблокирована'
          )
        }

        // Проверяем, активен ли пользователь
        if (!user.active) {
          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              success: false,
              reason: 'Учетная запись не активна',
            },
          })
          throw new Error('Ваша учетная запись не активна')
        }

        // Проверяем пароль
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          await prisma.loginHistory.create({
            data: {
              userId: user.id,
              success: false,
              reason: 'Неверный пароль',
            },
          })
          throw new Error('Неверный email или пароль')
        }

        // Обновляем время последнего входа
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })

        // Логируем успешный вход
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            success: true,
          },
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          active: user.active,
          blocked: user.blocked,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.active = user.active
        token.blocked = user.blocked
      }
      
      // Проверяем актуальность данных пользователя при каждом запросе
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { active: true, blocked: true, role: true },
        })
        
        if (dbUser) {
          token.active = dbUser.active
          token.blocked = dbUser.blocked
          token.role = dbUser.role
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.active = token.active as boolean
        session.user.blocked = token.blocked as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

