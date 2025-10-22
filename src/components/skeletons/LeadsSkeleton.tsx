import { Skeleton } from '../LoadingStates'

/**
 * Скелетон для сетки лидов
 */
export function LeadsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <Skeleton height={24} width="80%" className="mb-2" />
              <Skeleton height={16} width="60%" />
            </div>
            <Skeleton width={80} height={24} className="rounded-full" />
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Skeleton width={16} height={16} />
              <Skeleton height={16} className="flex-1" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton width={16} height={16} />
              <Skeleton height={16} className="flex-1" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton width={16} height={16} />
              <Skeleton height={16} width="70%" />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <Skeleton width={60} height={20} />
              <Skeleton width={100} height={32} className="rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Скелетон для списка лидов
 */
export function LeadsListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <Skeleton width={40} height={40} className="rounded" />
              <div className="flex-1">
                <Skeleton height={18} width="40%" className="mb-2" />
                <Skeleton height={14} width="30%" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Skeleton width={100} height={24} className="rounded-full" />
              <Skeleton width={80} height={32} className="rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

