// Утилиты для модуля голосований

import { Apartment, Voting } from './types'

/**
 * Рассчитывает прогресс голосования на основе площади квартир
 */
export function calculateVotingProgress(apartments: Apartment[]): {
  currentVotes: number
  requiredVotes: number
  votesPercent: number
} {
  if (!apartments || apartments.length === 0) {
    return {
      currentVotes: 0,
      requiredVotes: 0,
      votesPercent: 0
    }
  }

  const totalArea = apartments.reduce((sum, apt) => sum + apt.area, 0)
  const votedArea = apartments
    .filter(apt => apt.voteStatus === 'FOR')
    .reduce((sum, apt) => sum + apt.area, 0)

  const votesPercent = totalArea > 0 ? (votedArea / totalArea) * 100 : 0

  return {
    currentVotes: votedArea,
    requiredVotes: totalArea,
    votesPercent: Math.round(votesPercent * 10) / 10
  }
}

/**
 * Получить цвет для статуса голосования
 */
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    PREPARATION: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-emerald-100 text-emerald-800',
    FAILED: 'bg-red-100 text-red-800'
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Получить текст статуса на русском
 */
export function getStatusText(status: string): string {
  const statusTexts: Record<string, string> = {
    PREPARATION: 'Подготовка',
    ACTIVE: 'Активно',
    COMPLETED: 'Завершено',
    FAILED: 'Неуспешно'
  }
  return statusTexts[status] || status
}

/**
 * Получить цвет для статуса голоса квартиры
 */
export function getVoteStatusColor(status: string): string {
  const voteStatusColors: Record<string, string> = {
    FOR: 'bg-green-100 text-green-800',
    AGAINST: 'bg-red-100 text-red-800',
    ABSTAINED: 'bg-yellow-100 text-yellow-800',
    NOT_VOTED: 'bg-gray-100 text-gray-800',
    NO_CONTACT: 'bg-orange-100 text-orange-800'
  }
  return voteStatusColors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Получить текст статуса голоса на русском
 */
export function getVoteStatusText(status: string): string {
  const voteStatusTexts: Record<string, string> = {
    FOR: 'За',
    AGAINST: 'Против',
    ABSTAINED: 'Воздержался',
    NOT_VOTED: 'Не голосовал',
    NO_CONTACT: 'Не дозвон'
  }
  return voteStatusTexts[status] || status
}

/**
 * Форматировать дату для отображения
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return '—'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  } catch {
    return dateString
  }
}

/**
 * Форматировать дату для input type="date"
 */
export function formatDateForInput(dateString?: string): string {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    return date.toISOString().split('T')[0]
  } catch {
    return ''
  }
}

/**
 * Валидация данных голосования
 */
export function validateVotingData(data: Partial<Voting>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (data.votingStartDate && data.votingEndDate) {
    const start = new Date(data.votingStartDate)
    const end = new Date(data.votingEndDate)
    
    if (start >= end) {
      errors.push('Дата окончания должна быть позже даты начала')
    }
  }

  if (data.requiredVotes !== undefined && data.requiredVotes < 0) {
    errors.push('Требуемые голоса не могут быть отрицательными')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Валидация данных квартиры
 */
export function validateApartmentData(data: Partial<Apartment>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.number?.trim()) {
    errors.push('Номер квартиры обязателен')
  }

  if (!data.ownerName?.trim()) {
    errors.push('ФИО собственника обязательно')
  }

  if (data.area !== undefined && data.area <= 0) {
    errors.push('Площадь должна быть больше 0')
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Неверный формат телефона')
  }

  if (data.email && !isValidEmail(data.email)) {
    errors.push('Неверный формат email')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Простая валидация телефона
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\+\-\(\)]+$/
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

/**
 * Простая валидация email
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Получить следующий статус голосования
 */
export function getNextStatus(currentStatus: string): string | null {
  const statusFlow: Record<string, string> = {
    PREPARATION: 'ACTIVE',
    ACTIVE: 'COMPLETED'
  }
  return statusFlow[currentStatus] || null
}

/**
 * Проверить можно ли изменить статус
 */
export function canChangeStatus(voting: Voting, newStatus: string): { can: boolean; reason?: string } {
  if (newStatus === 'ACTIVE') {
    if (!voting.votingStartDate || !voting.votingEndDate) {
      return { can: false, reason: 'Необходимо указать даты голосования' }
    }
    
    if (!voting.apartments || voting.apartments.length === 0) {
      return { can: false, reason: 'Необходимо добавить хотя бы одну квартиру' }
    }
  }

  if (newStatus === 'COMPLETED') {
    if (voting.status !== 'ACTIVE') {
      return { can: false, reason: 'Можно завершить только активное голосование' }
    }
  }

  return { can: true }
}

