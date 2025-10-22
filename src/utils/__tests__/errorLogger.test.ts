import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  logError,
  getErrorLogs,
  clearErrorLogs,
  getErrorStats,
  exportErrorLogs,
  type ErrorLog
} from '../errorLogger'

describe('Error Logger', () => {
  beforeEach(() => {
    // Очищаем localStorage перед каждым тестом
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    clearErrorLogs()
  })

  describe('logError', () => {
    it('should log error to localStorage', () => {
      const error = new Error('Test error')
      logError(error, 'high', { test: true })

      const logs = getErrorLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0].message).toBe('Test error')
      expect(logs[0].severity).toBe('high')
      expect(logs[0].context).toEqual({ test: true })
    })

    it('should generate unique IDs', () => {
      const error1 = new Error('Error 1')
      const error2 = new Error('Error 2')

      logError(error1, 'low')
      logError(error2, 'low')

      const logs = getErrorLogs()
      expect(logs[0].id).not.toBe(logs[1].id)
    })

    it('should include timestamp', () => {
      const error = new Error('Test error')
      const beforeLog = new Date().toISOString()
      
      logError(error, 'medium')
      
      const logs = getErrorLogs()
      const afterLog = new Date().toISOString()

      expect(logs[0].timestamp).toBeDefined()
      expect(logs[0].timestamp >= beforeLog).toBe(true)
      expect(logs[0].timestamp <= afterLog).toBe(true)
    })

    it('should include stack trace', () => {
      const error = new Error('Test error')
      logError(error, 'high')

      const logs = getErrorLogs()
      expect(logs[0].stack).toBeDefined()
      expect(logs[0].stack).toContain('Error: Test error')
    })

    it('should limit number of errors to 50', () => {
      // Логируем 60 ошибок
      for (let i = 0; i < 60; i++) {
        logError(new Error(`Error ${i}`), 'low')
      }

      const logs = getErrorLogs()
      expect(logs.length).toBeLessThanOrEqual(50)
    })

    it('should keep newest errors when limit reached', () => {
      for (let i = 0; i < 60; i++) {
        logError(new Error(`Error ${i}`), 'low')
      }

      const logs = getErrorLogs()
      // Последняя ошибка должна быть в логах
      expect(logs[0].message).toBe('Error 59')
    })
  })

  describe('getErrorLogs', () => {
    it('should return empty array when no errors', () => {
      expect(getErrorLogs()).toEqual([])
    })

    it('should return all logged errors', () => {
      logError(new Error('Error 1'), 'low')
      logError(new Error('Error 2'), 'medium')
      logError(new Error('Error 3'), 'high')

      const logs = getErrorLogs()
      expect(logs).toHaveLength(3)
    })

    it('should migrate old logs without severity', () => {
      // Симулируем старый формат логов
      const oldLog = {
        id: 'old-1',
        message: 'Old error',
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('app_errors', JSON.stringify([oldLog]))

      const logs = getErrorLogs()
      expect(logs[0].severity).toBe('high') // По умолчанию
    })
  })

  describe('clearErrorLogs', () => {
    it('should remove all errors from localStorage', () => {
      logError(new Error('Test 1'), 'low')
      logError(new Error('Test 2'), 'medium')

      expect(getErrorLogs()).toHaveLength(2)

      clearErrorLogs()

      expect(getErrorLogs()).toEqual([])
    })
  })

  describe('getErrorStats', () => {
    beforeEach(() => {
      // Создаем тестовые данные
      logError(new Error('Critical error'), 'critical')
      logError(new Error('High error 1'), 'high')
      logError(new Error('High error 2'), 'high')
      logError(new Error('Medium error'), 'medium')
      logError(new Error('Low error'), 'low')
      logError(new Error('High error 1'), 'high') // Дубликат по message
    })

    it('should return total count', () => {
      const stats = getErrorStats()
      expect(stats.total).toBe(6)
    })

    it('should count by severity', () => {
      const stats = getErrorStats()
      expect(stats.bySeverity.critical).toBe(1)
      expect(stats.bySeverity.high).toBe(3)
      expect(stats.bySeverity.medium).toBe(1)
      expect(stats.bySeverity.low).toBe(1)
    })

    it('should count errors in last 24h', () => {
      const stats = getErrorStats()
      expect(stats.last24h).toBe(6) // Все недавние
    })

    it('should group by message', () => {
      const stats = getErrorStats()
      expect(stats.byMessage['High error 1']).toBe(2) // Дубликат
      expect(stats.byMessage['Critical error']).toBe(1)
    })

    it('should handle old logs without severity', () => {
      const oldLog = {
        id: 'old-1',
        message: 'Old error',
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('app_errors', JSON.stringify([oldLog]))

      const stats = getErrorStats()
      expect(stats.bySeverity.high).toBeGreaterThan(0) // Старые логи как 'high'
    })
  })

  describe('exportErrorLogs', () => {
    it('should export logs as JSON string', () => {
      logError(new Error('Test error'), 'high', { test: true })

      const exported = exportErrorLogs()
      const parsed = JSON.parse(exported)

      expect(Array.isArray(parsed)).toBe(true)
      expect(parsed).toHaveLength(1)
      expect(parsed[0].message).toBe('Test error')
    })

    it('should export with proper formatting', () => {
      logError(new Error('Test'), 'low')

      const exported = exportErrorLogs()
      // Должен быть с форматированием (pretty-print)
      expect(exported).toContain('\n')
      expect(exported).toContain('  ')
    })

    it('should export empty array when no logs', () => {
      const exported = exportErrorLogs()
      expect(exported).toBe('[]')
    })
  })

  describe('Error context', () => {
    it('should store custom context', () => {
      logError(new Error('Test'), 'high', {
        userId: 'user-123',
        operation: 'createLead',
        data: { test: true }
      })

      const logs = getErrorLogs()
      expect(logs[0].context).toEqual({
        userId: 'user-123',
        operation: 'createLead',
        data: { test: true }
      })
    })

    it('should include type in context', () => {
      logError(new Error('React error'), 'critical', {
        type: 'React Error Boundary',
        componentStack: 'Component stack trace'
      })

      const logs = getErrorLogs()
      expect(logs[0].context?.type).toBe('React Error Boundary')
      expect(logs[0].context?.componentStack).toBeDefined()
    })
  })

  describe('Browser-specific fields', () => {
    it('should include userAgent', () => {
      logError(new Error('Test'), 'low')

      const logs = getErrorLogs()
      expect(logs[0].userAgent).toBeDefined()
      expect(typeof logs[0].userAgent).toBe('string')
    })

    it('should include URL', () => {
      logError(new Error('Test'), 'medium')

      const logs = getErrorLogs()
      expect(logs[0].url).toBeDefined()
      expect(typeof logs[0].url).toBe('string')
    })
  })
})

