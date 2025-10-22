// Типы для модуля голосований
// Используем типы из общего файла и добавляем специфичные

import { Lead, Apartment, Voting } from '@/types'

export type { Lead, Apartment, Voting }

// Дополнительные типы специфичные для VotingManager
export interface VotingFormData {
  votingForm: 'MEETING' | 'ABSENTEE' | 'MIXED'
  votingStartDate: string
  votingEndDate: string
  requiredVotes: number
}

export interface EditingCell {
  votingId: string
  field: string
}

export interface EditingApartmentCell {
  apartmentId: string
  field: string
}

export interface EditingApartment {
  votingId: string
  apartment: Apartment | null
}

export interface VotingStats {
  total: number
  preparation: number
  active: number
  completed: number
  failed: number
  successRate: number
  averageProgress: number
}

export interface ApartmentFormData extends Apartment {
  // Все поля уже в Apartment
}

