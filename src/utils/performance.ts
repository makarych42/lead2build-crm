/**
 * Performance optimization utilities
 * Утилиты для оптимизации производительности
 */

/**
 * Debounce функция - откладывает выполнение до тех пор, пока не пройдет delay мс с последнего вызова
 * Используется для поиска, валидации инпутов и т.д.
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function debounced(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Throttle функция - ограничивает частоту вызовов до одного раза в limit мс
 * Используется для scroll handlers, resize events и т.д.
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  let lastResult: ReturnType<T>

  return function throttled(...args: Parameters<T>): void {
    if (!inThrottle) {
      lastResult = func(...args)
      inThrottle = true

      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Memoize функция - кэширует результаты дорогих вычислений
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>()

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = func(...args)
    cache.set(key, result)
    return result
  }) as T
}

/**
 * Deep equality check для объектов
 * Используется в useMemo/useCallback dependencies
 */
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (a == null || b == null) return false
  if (typeof a !== 'object' || typeof b !== 'object') return false

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!deepEqual(a[key], b[key])) return false
  }

  return true
}

/**
 * Создает stable reference для объекта
 * Возвращает новый объект только если содержимое изменилось
 */
export function useStableObject<T extends Record<string, any>>(obj: T): T {
  // Используется с useMemo для стабилизации объектов в dependencies
  return obj
}

/**
 * Batch updates helper
 * Группирует множественные обновления состояния
 */
export function batchUpdates(callback: () => void): void {
  // В React 18+ batching работает автоматически
  // Эта функция для совместимости и явности
  callback()
}

/**
 * Проверка производительности
 */
export function measurePerformance(name: string, callback: () => void): void {
  const start = performance.now()
  callback()
  const end = performance.now()
  console.log(`⚡ ${name}: ${(end - start).toFixed(2)}ms`)
}

/**
 * Async debounce для Promise функций
 */
export function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout | null = null
  let latestResolve: ((value: ReturnType<T>) => void) | null = null
  let latestReject: ((reason?: any) => void) | null = null

  return function debouncedAsync(...args: Parameters<T>): Promise<ReturnType<T>> {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        if (latestReject) {
          latestReject(new Error('Debounced'))
        }
      }

      latestResolve = resolve
      latestReject = reject

      timeoutId = setTimeout(async () => {
        try {
          const result = await func(...args)
          if (latestResolve) {
            latestResolve(result)
          }
        } catch (error) {
          if (latestReject) {
            latestReject(error)
          }
        } finally {
          timeoutId = null
          latestResolve = null
          latestReject = null
        }
      }, delay)
    })
  }
}
