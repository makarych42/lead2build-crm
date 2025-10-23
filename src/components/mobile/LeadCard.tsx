import { Lead } from '@/types'
import { MapPin, Calendar, TrendingUp } from 'lucide-react'

interface LeadCardProps {
  lead: Lead
}

export default function LeadCard({ lead }: LeadCardProps) {
  const statusColors: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    VOTING: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  const statusLabels: Record<string, string> = {
    NEW: 'Новый',
    IN_PROGRESS: 'В работе',
    VOTING: 'Голосование',
    COMPLETED: 'Завершен',
    REJECTED: 'Отклонен',
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100 active:shadow-lg transition-shadow">
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{lead.address}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{lead.city}</span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusColors[lead.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {statusLabels[lead.status] || lead.status}
        </span>
      </div>

      {/* Детали */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <TrendingUp className="h-4 w-4 mr-2 text-gray-400" />
          <span className="font-medium">Этап:</span>
          <span className="ml-2">{getStageLabel(lead.currentStage)}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
          <span className="font-medium">Создан:</span>
          <span className="ml-2">
            {new Date(lead.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>

      {/* Контакт */}
      <div className="border-t border-gray-100 pt-3">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Контакт:</span> {lead.contactPerson}
        </p>
        <p className="text-sm text-gray-500 mt-1">{lead.contactPhone}</p>
      </div>
    </div>
  )
}

function getStageLabel(stage: string): string {
  const stageLabels: Record<string, string> = {
    INITIAL_CONSULTATION: 'Консультация',
    DOCUMENT_PREPARATION: 'Подготовка документов',
    INSPECTION: 'Обследование',
    VOTING_ORGANIZATION: 'Организация голосования',
    VOTING_PROCESS: 'Процесс голосования',
    CONDITION_VERIFICATION: 'Проверка условий',
    CONSTRUCTION_READY: 'Готово к строительству',
  }
  
  return stageLabels[stage] || stage
}

