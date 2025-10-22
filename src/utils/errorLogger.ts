/**
 * Система логирования и обработки ошибок
 * Централизованное управление ошибками приложения
 */

export interface ErrorLog {
  id: string
  message: string
  stack?: string
  componentStack?: string
  timestamp: string
  userAgent?: string
  url?: string
  userId?: string
  severity?: 'low' | 'medium' | 'high' | 'critical' // Опционально для обратной совместимости
  context?: Record<string, any>
}

const MAX_ERRORS = 50 // Максимальное количество ошибок в localStorage
const STORAGE_KEY = 'app_errors'

/**
 * Логирует ошибку в localStorage
 */
export function logError(
  error: Error,
  severity: ErrorLog['severity'] = 'high',
  context?: Record<string, any>
): void {
  try {
    const errorLog: ErrorLog = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      severity,
      context
    }

    const errors = getErrorLogs()
    errors.unshift(errorLog) // Добавляем в начало (новые сверху)

    // Ограничиваем количество
    if (errors.length > MAX_ERRORS) {
      errors.splice(MAX_ERRORS)
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(errors))
    }

    // В продакшене здесь можно отправить на сервер
    if (severity === 'critical' || severity === 'high') {
      console.error('🚨 Error logged:', errorLog)
      // sendToMonitoringService(errorLog)
    }
  } catch (e) {
    console.error('Failed to log error:', e)
  }
}

/**
 * Получает все логи ошибок
 */
export function getErrorLogs(): ErrorLog[] {
  try {
    if (typeof window === 'undefined') return []
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const logs: ErrorLog[] = JSON.parse(stored)
    
    // Мигрируем старые логи без severity
    const migrated = logs.map(log => {
      if (!log.severity) {
        return { ...log, severity: 'high' as const }
      }
      return log
    })
    
    // Сохраняем обратно если были изменения
    if (migrated.some((log, i) => log.severity !== logs[i].severity)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    }
    
    return migrated
  } catch (e) {
    console.error('Failed to read error logs:', e)
    return []
  }
}

/**
 * Очищает логи ошибок
 */
export function clearErrorLogs(): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch (e) {
    console.error('Failed to clear error logs:', e)
  }
}

/**
 * Получает статистику ошибок
 */
export function getErrorStats(): {
  total: number
  bySeverity: Record<Exclude<ErrorLog['severity'], undefined>, number>
  last24h: number
  byMessage: Record<string, number>
} {
  const errors = getErrorLogs()
  const now = new Date()
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  return {
    total: errors.length,
    bySeverity: {
      low: errors.filter(e => e.severity === 'low').length,
      medium: errors.filter(e => e.severity === 'medium').length,
      high: errors.filter(e => e.severity === 'high' || !e.severity).length, // Старые логи считаем как 'high'
      critical: errors.filter(e => e.severity === 'critical').length
    },
    last24h: errors.filter(e => new Date(e.timestamp) > dayAgo).length,
    byMessage: errors.reduce((acc, err) => {
      acc[err.message] = (acc[err.message] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}

/**
 * Экспортирует логи ошибок в JSON
 */
export function exportErrorLogs(): string {
  const errors = getErrorLogs()
  return JSON.stringify(errors, null, 2)
}

/**
 * Wrapper для async функций с автоматическим логированием ошибок
 */
export function withErrorLogging<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      if (error instanceof Error) {
        logError(error, 'high', { ...context, args })
      }
      throw error
    }
  }) as T
}

/**
 * Global error handler для необработанных ошибок
 */
export function setupGlobalErrorHandlers(): void {
  if (typeof window === 'undefined') return

  // Обработка необработанных промисов
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason))
    
    logError(error, 'high', {
      type: 'unhandledRejection',
      promise: event.promise
    })
  })

  // Обработка глобальных JS ошибок
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error || event.message)
    
    const error = event.error instanceof Error
      ? event.error
      : new Error(event.message)
    
    logError(error, 'high', {
      type: 'globalError',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    })
  })
}

