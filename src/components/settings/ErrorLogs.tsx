'use client'

import React, { useState, useEffect } from 'react'
import { 
  AlertTriangle, 
  Download, 
  Trash2, 
  AlertCircle, 
  Info, 
  AlertOctagon,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { 
  getErrorLogs, 
  clearErrorLogs, 
  exportErrorLogs, 
  getErrorStats,
  ErrorLog 
} from '@/utils/errorLogger'
import { useNotification } from '@/components/NotificationService'

export default function ErrorLogs() {
  const [errors, setErrors] = useState<ErrorLog[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<ErrorLog['severity'] | 'all'>('all')
  const { success, warning } = useNotification()

  const loadErrors = () => {
    setErrors(getErrorLogs())
  }

  useEffect(() => {
    loadErrors()
  }, [])

  const handleClear = () => {
    if (confirm('Вы уверены, что хотите удалить все логи ошибок?')) {
      clearErrorLogs()
      loadErrors()
      success('Логи ошибок очищены')
    }
  }

  const handleExport = () => {
    const data = exportErrorLogs()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `error-logs-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
    success('Логи экспортированы')
  }

  const stats = getErrorStats()

  const filteredErrors = filter === 'all' 
    ? errors 
    : errors.filter(e => (e.severity || 'high') === filter) // Старые логи без severity считаем как 'high'

  const getSeverityIcon = (severity?: ErrorLog['severity']) => {
    switch (severity) {
      case 'critical': return <AlertOctagon className="h-5 w-5 text-red-600" />
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'medium': return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case 'low': return <Info className="h-5 w-5 text-blue-600" />
      default: return <AlertTriangle className="h-5 w-5 text-orange-600" /> // По умолчанию high
    }
  }

  const getSeverityBadgeClass = (severity?: ErrorLog['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-orange-100 text-orange-800' // По умолчанию high
    }
  }

  const getSeverityLabel = (severity?: ErrorLog['severity']): string => {
    return severity ? severity.toUpperCase() : 'HIGH'
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и действия */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Логи ошибок</h2>
          <p className="text-sm text-gray-600 mt-1">
            Автоматически сохраненные ошибки приложения
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            disabled={errors.length === 0}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4 mr-2" />
            Экспортировать
          </button>
          <button
            onClick={handleClear}
            disabled={errors.length === 0}
            className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Очистить все
          </button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Всего</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-4">
          <div className="text-sm text-red-600 mb-1">Критические</div>
          <div className="text-2xl font-bold text-red-900">{stats.bySeverity.critical}</div>
        </div>
        <div className="bg-white rounded-lg border border-orange-200 p-4">
          <div className="text-sm text-orange-600 mb-1">Высокие</div>
          <div className="text-2xl font-bold text-orange-900">{stats.bySeverity.high}</div>
        </div>
        <div className="bg-white rounded-lg border border-yellow-200 p-4">
          <div className="text-sm text-yellow-600 mb-1">Средние</div>
          <div className="text-2xl font-bold text-yellow-900">{stats.bySeverity.medium}</div>
        </div>
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <div className="text-sm text-blue-600 mb-1">За 24 часа</div>
          <div className="text-2xl font-bold text-blue-900">{stats.last24h}</div>
        </div>
      </div>

      {/* Фильтр */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700">Фильтр:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
        >
          <option value="all">Все ({errors.length})</option>
          <option value="critical">Критические ({stats.bySeverity.critical})</option>
          <option value="high">Высокие ({stats.bySeverity.high})</option>
          <option value="medium">Средние ({stats.bySeverity.medium})</option>
          <option value="low">Низкие ({stats.bySeverity.low})</option>
        </select>
      </div>

      {/* Список ошибок */}
      {filteredErrors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {errors.length === 0 ? 'Нет логов ошибок' : 'Нет ошибок по выбранному фильтру'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredErrors.map((error) => (
            <div
              key={error.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Заголовок ошибки */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === error.id ? null : error.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getSeverityIcon(error.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getSeverityBadgeClass(error.severity)}`}>
                          {getSeverityLabel(error.severity)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(error.timestamp).toLocaleString('ru-RU')}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 break-words">
                        {error.message}
                      </p>
                      {error.context?.type && (
                        <p className="text-xs text-gray-500 mt-1">
                          Тип: {error.context.type}
                        </p>
                      )}
                    </div>
                  </div>
                  {expandedId === error.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                  )}
                </div>
              </div>

              {/* Детали ошибки */}
              {expandedId === error.id && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  {error.stack && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Stack Trace:</h4>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {error.componentStack && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Component Stack:</h4>
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                        {error.componentStack}
                      </pre>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {error.url && (
                      <div>
                        <span className="font-medium text-gray-700">URL:</span>
                        <div className="text-gray-600 break-all">{error.url}</div>
                      </div>
                    )}
                    {error.userAgent && (
                      <div>
                        <span className="font-medium text-gray-700">User Agent:</span>
                        <div className="text-gray-600 break-all">{error.userAgent}</div>
                      </div>
                    )}
                    {error.context && Object.keys(error.context).length > 0 && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Context:</span>
                        <pre className="bg-white border border-gray-200 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(error.context, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

