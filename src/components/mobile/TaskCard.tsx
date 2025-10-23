import { Task } from '@/types'
import { Calendar, AlertCircle, Clock, MapPin } from 'lucide-react'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const priorityColors: Record<string, string> = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-blue-100 text-blue-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  }

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-gray-100 text-gray-800',
    OVERDUE: 'bg-red-100 text-red-800',
  }

  const isOverdue =
    task.status !== 'COMPLETED' &&
    new Date(task.dueDate) < new Date()

  const daysUntilDue = Math.ceil(
    (new Date(task.dueDate).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  )

  return (
    <div
      className={`bg-white rounded-xl p-4 shadow-md border ${
        isOverdue ? 'border-red-300' : 'border-gray-100'
      } active:shadow-lg transition-shadow`}
    >
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex-1 pr-2">
          {task.title}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
            priorityColors[task.priority]
          }`}
        >
          {task.priority === 'LOW'
            ? 'Низкий'
            : task.priority === 'MEDIUM'
            ? 'Средний'
            : task.priority === 'HIGH'
            ? 'Высокий'
            : 'Срочно'}
        </span>
      </div>

      {/* Описание */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Адрес из контекста */}
      {task.context?.address && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          <span>{task.context.address}</span>
        </div>
      )}

      {/* Дата и статус */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center text-sm text-gray-600">
          {isOverdue ? (
            <>
              <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
              <span className="text-red-600 font-medium">Просрочено</span>
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
              <span>
                {daysUntilDue === 0
                  ? 'Сегодня'
                  : daysUntilDue === 1
                  ? 'Завтра'
                  : `${daysUntilDue} дн.`}
              </span>
            </>
          )}
        </div>
        
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[task.status]
          }`}
        >
          {task.status === 'PENDING'
            ? 'Ожидает'
            : task.status === 'IN_PROGRESS'
            ? 'В работе'
            : task.status === 'COMPLETED'
            ? 'Завершено'
            : task.status === 'CANCELLED'
            ? 'Отменено'
            : 'Просрочено'}
        </span>
      </div>
    </div>
  )
}

