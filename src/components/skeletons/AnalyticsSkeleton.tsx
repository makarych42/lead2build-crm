import { Skeleton } from '../LoadingStates'

/**
 * Скелетон для метрических карточек
 */
export function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton width={120} height={16} />
        <Skeleton width={40} height={40} className="rounded-full" />
      </div>
      <Skeleton height={36} width="60%" className="mb-2" />
      <Skeleton height={16} width="80%" className="mb-4" />
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <Skeleton width={60} height={12} />
          <Skeleton width={40} height={12} />
        </div>
        <Skeleton height={8} width="100%" className="rounded-full" />
      </div>
    </div>
  )
}

/**
 * Скелетон для сетки метрик
 */
export function MetricsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Скелетон для графика/диаграммы
 */
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton height={24} width="30%" />
        <Skeleton width={120} height={32} className="rounded" />
      </div>
      <Skeleton height={height} width="100%" className="rounded" />
    </div>
  )
}

/**
 * Скелетон для таблицы аналитики
 */
export function AnalyticsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} height={16} />
          ))}
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b">
          <div className="grid grid-cols-5 gap-4">
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="70%" />
            <Skeleton height={16} width="80%" />
            <Skeleton height={16} width="60%" />
            <div className="flex items-center space-x-2">
              <Skeleton width={24} height={24} className="rounded-full" />
              <Skeleton height={16} width={40} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Скелетон для панели фильтров
 */
export function FilterPanelSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <Skeleton width={120} height={38} className="rounded" />
        <Skeleton width={160} height={38} className="rounded" />
        <Skeleton width={140} height={38} className="rounded" />
        <Skeleton width={100} height={38} className="rounded" />
      </div>
    </div>
  )
}

