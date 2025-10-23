'use client'

import { useEffect } from 'react'

export default function PWAInstaller() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ SW registered:', registration.scope)
            
            // Проверка обновлений каждые 60 секунд
            setInterval(() => {
              registration.update()
            }, 60000)
            
            // Обработка обновлений
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // Новая версия доступна
                    console.log('🔄 New version available')
                    // Можно показать уведомление пользователю
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.error('❌ SW registration failed:', error)
          })
      })
    }
  }, [])

  return null // Этот компонент не рендерит ничего
}

