import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isLoginPage = req.nextUrl.pathname.startsWith('/login')

    // Если пользователь авторизован и пытается зайти на страницу входа
    if (isLoginPage && isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Проверка блокировки пользователя
    if (isAuth && token.blocked) {
      return NextResponse.redirect(new URL('/login?error=blocked', req.url))
    }

    // Проверка активности пользователя
    if (isAuth && !token.active) {
      return NextResponse.redirect(new URL('/login?error=inactive', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Разрешить доступ к странице входа всем
        if (req.nextUrl.pathname.startsWith('/login')) {
          return true
        }

        // Для всех остальных страниц требуется авторизация
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Защита всех маршрутов кроме публичных
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
}

