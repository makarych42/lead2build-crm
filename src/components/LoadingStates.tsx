// ============= КОМПОНЕНТЫ ЗАГРУЗКИ =============

/**
 * Скелетон для загрузки
 */
export function Skeleton({ className = '', width, height }: {
  className?: string
  width?: string | number
  height?: string | number
}) {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  }

  return (
    <div
      className={`bg-gray-200 rounded animate-pulse-slow ${className}`}
      style={style}
    />
  )
}

/**
 * Скелетон для карточки
 */
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4 mb-4">
        <Skeleton width={48} height={48} className="rounded-full" />
        <div className="flex-1">
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>
      <Skeleton height={16} className="mb-2" />
      <Skeleton height={16} width="80%" />
    </div>
  )
}

/**
 * Скелетон для таблицы
 */
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number, columns?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} height={20} className="flex-1" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="p-4 border-b">
          <div className="flex space-x-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton key={colIndex} height={16} className="flex-1" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Скелетон для списка
 */
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center space-x-3">
            <Skeleton width={40} height={40} className="rounded" />
            <div className="flex-1">
              <Skeleton height={18} width="70%" className="mb-2" />
              <Skeleton height={14} width="50%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Спиннер загрузки
 */
export function Spinner({ size = 'md', className = '' }: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg
        className="animate-spin text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}

/**
 * Полноэкранный индикатор загрузки
 */
export function FullPageLoader({ message = 'Загрузка...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

/**
 * Индикатор загрузки кнопки
 */
export function ButtonLoader() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  )
}

/**
 * Компонент пустого состояния
 */
export function EmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      {icon && <div className="flex justify-center mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

/**
 * Прогресс-бар
 */
export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  color = 'blue'
}: {
  progress: number
  label?: string
  showPercentage?: boolean
  color?: 'blue' | 'green' | 'red' | 'yellow'
}) {
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  }

  const percentage = Math.min(100, Math.max(0, progress))

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && <span className="text-sm font-medium text-gray-700">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

/**
 * Индикатор количества с Badge
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md'
}: {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
}) {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-blue-100 text-blue-800'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

/**
 * Tooltip (всплывающая подсказка)
 */
export function Tooltip({
  children,
  content,
  position = 'top'
}: {
  children: React.ReactNode
  content: string
  position?: 'top' | 'bottom' | 'left' | 'right'
}) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute ${positions[position]} invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-50`}
      >
        {content}
      </div>
    </div>
  )
}

import * as React from 'react'

