import { Skeleton } from '../LoadingStates'

/**
 * Скелетон для таблицы голосований
 */
export function VotingTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 border-b px-6 py-4">
        <div className="grid grid-cols-7 gap-4">
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} />
          <Skeleton height={16} />
        </div>
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b px-6 py-4">
          <div className="grid grid-cols-7 gap-4 items-center">
            <Skeleton height={16} width="90%" />
            <Skeleton height={16} width="80%" />
            <Skeleton height={16} width="70%" />
            <Skeleton height={16} width="60%" />
            <div>
              <Skeleton height={20} width={60} className="rounded-full" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton width={32} height={32} className="rounded" />
              <Skeleton width={32} height={32} className="rounded" />
            </div>
            <Skeleton width={24} height={24} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Скелетон для статистики голосований
 */
export function VotingStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <Skeleton width={16} height={16} />
            <Skeleton width={40} height={40} className="rounded-full" />
          </div>
          <Skeleton height={32} width="60%" className="mb-1" />
          <Skeleton height={16} width="80%" />
        </div>
      ))}
    </div>
  )
}

/**
 * Скелетон для подтаблицы квартир
 */
export function ApartmentTableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="bg-gray-50 p-4">
      <div className="bg-white rounded border">
        {/* Header */}
        <div className="grid grid-cols-8 gap-2 px-4 py-2 bg-gray-100 border-b text-xs">
          <Skeleton height={12} />
          <Skeleton height={12} />
          <Skeleton height={12} />
          <Skeleton height={12} />
          <Skeleton height={12} />
          <Skeleton height={12} />
          <Skeleton height={12} />
          <Skeleton height={12} />
        </div>

        {/* Rows */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-8 gap-2 px-4 py-3 border-b">
            <Skeleton height={14} width="80%" />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="70%" />
            <Skeleton height={14} width="85%" />
            <Skeleton height={14} width="75%" />
            <Skeleton height={14} width="90%" />
            <Skeleton height={20} width={80} className="rounded-full" />
            <Skeleton width={24} height={24} />
          </div>
        ))}
      </div>
    </div>
  )
}

