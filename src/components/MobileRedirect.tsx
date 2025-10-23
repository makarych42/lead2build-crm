'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { isMobileDevice } from '@/lib/pwa-utils'

export default function MobileRedirect() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Проверяем только на клиенте
    if (typeof window === 'undefined') return

    // Если уже на мобильной версии, ничего не делаем
    if (pathname?.startsWith('/mobile')) return

    // Если это мобильное устройство и не на мобильной версии
    if (isMobileDevice()) {
      // Спрашиваем пользователя (можно убрать для автоматического редиректа)
      const shouldRedirect = localStorage.getItem('preferMobileVersion')
      
      if (shouldRedirect === 'yes') {
        router.push('/mobile')
        return
      }
      
      if (shouldRedirect === 'no') {
        return
      }

      // Первый визит - показываем уведомление
      const userChoice = confirm(
        'Обнаружено мобильное устройство. Перейти на мобильную версию?'
      )
      
      if (userChoice) {
        localStorage.setItem('preferMobileVersion', 'yes')
        router.push('/mobile')
      } else {
        localStorage.setItem('preferMobileVersion', 'no')
      }
    }
  }, [pathname, router])

  return null
}

