import { Skeleton } from '../LoadingStates'

/**
 * Скелетон для карточек задач
 */
export function TaskCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton height={20} width="80%" className="mb-2" />
          <Skeleton height={14} width="40%" />
        </div>
        <Skeleton width={60} height={20} className="rounded-full" />
      </div>

      {/* Body */}
      <Skeleton height={16} width="100%" className="mb-2" />
      <Skeleton height={16} width="90%" className="mb-3" />

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center space-x-2">
          <Skeleton width={24} height={24} className="rounded-full" />
          <Skeleton height={14} width={80} />
        </div>
        <Skeleton width={80} height={24} className="rounded-full" />
      </div>
    </div>
  )
}

/**
 * Скелетон для списка задач
 */
export function TasksListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <TaskCardSkeleton key={i} />
      ))}
    </div>
  )
}

/**
 * Скелетон для статистики задач
 */
export function TaskStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Skeleton height={14} width="50%" className="mb-2" />
              <Skeleton height={28} width="40%" />
            </div>
            <Skeleton width={40} height={40} className="rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Скелетон для группированных задач (Kanban)
 */
export function TasksKanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, colIndex) => (
        <div key={colIndex} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <Skeleton height={20} width={100} />
            <Skeleton width={32} height={32} className="rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, cardIndex) => (
              <TaskCardSkeleton key={cardIndex} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

