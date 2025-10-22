'use client'

import { useEffect } from 'react'
import { setupGlobalErrorHandlers } from '@/utils/errorLogger'

/**
 * Компонент для инициализации глобальных обработчиков ошибок
 * Должен быть встроен в корневой layout
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    // Инициализируем глобальные обработчики ошибок
    setupGlobalErrorHandlers()
    
    console.log('✅ Global error handlers initialized')
  }, [])

  return null // Компонент не рендерит UI
}

