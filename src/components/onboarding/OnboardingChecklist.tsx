'use client'

import React from 'react'
import { CheckCircle, Circle, Play, BarChart3, Home as HomeIcon, FileText, Vote, Bell, MessageCircle, Settings as SettingsIcon } from 'lucide-react'
import { useOnboardingStore, useOnboardingProgress, useOnboardingActions } from '@/stores/useOnboardingStore'
import { useUsersStore } from '@/stores/useUsersStore'
import { getToursForRole } from '@/config/onboarding-tours'
import { UserRole } from '@/types'

interface OnboardingChecklistProps {
  isOpen: boolean
  onClose: () => void
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({ isOpen, onClose }) => {
  const { getCurrentUser } = useUsersStore()
  const progress = useOnboardingProgress()
  const { startTour } = useOnboardingActions()

  const currentUser = getCurrentUser()

  if (!isOpen || !currentUser) return null

  const userRole = currentUser.role as UserRole
  const availableTours = getToursForRole(userRole)

  const getTourIcon = (tourId: string) => {
    switch (tourId) {
      case 'dashboard':
        return <BarChart3 className="h-4 w-4" />
      case 'leads':
        return <HomeIcon className="h-4 w-4" />
      case 'documents':
        return <FileText className="h-4 w-4" />
      case 'voting':
        return <Vote className="h-4 w-4" />
      case 'analytics':
        return <BarChart3 className="h-4 w-4" />
      case 'tasks':
        return <Bell className="h-4 w-4" />
      case 'telegram':
        return <MessageCircle className="h-4 w-4" />
      case 'settings':
        return <SettingsIcon className="h-4 w-4" />
      default:
        return <Circle className="h-4 w-4" />
    }
  }

  const getTourColor = (tourId: string) => {
    switch (tourId) {
      case 'dashboard':
        return 'text-blue-600'
      case 'leads':
        return 'text-green-600'
      case 'documents':
        return 'text-purple-600'
      case 'voting':
        return 'text-orange-600'
      case 'analytics':
        return 'text-indigo-600'
      case 'tasks':
        return 'text-red-600'
      case 'telegram':
        return 'text-blue-500'
      case 'settings':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  const isTourCompleted = (tourId: string) => {
    return progress.completedTours.includes(tourId)
  }

  const handleStartTour = (tourId: string) => {
    startTour(tourId)
    onClose()
  }

  const completedTours = progress.completedTours.length
  const totalTours = availableTours.length
  const progressPercentage = totalTours > 0 ? Math.round((completedTours / totalTours) * 100) : 0

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Прогресс обучения
            </h3>
            <p className="text-sm text-gray-500">
              {completedTours} из {totalTours} туров завершено
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Circle className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Общий прогресс</span>
            <span className="text-sm text-gray-500">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Tours List */}
        <div className="p-4">
          <div className="space-y-3">
            {availableTours.map((tour) => {
              const completed = isTourCompleted(tour.id)
              const iconColor = getTourColor(tour.id)
              
              return (
                <div
                  key={tour.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    completed
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${iconColor} ${completed ? 'opacity-60' : ''}`}>
                      {getTourIcon(tour.id)}
                    </div>
                    <div>
                      <h4 className={`font-medium ${completed ? 'text-green-800' : 'text-gray-900'}`}>
                        {tour.name}
                      </h4>
                      <p className={`text-sm ${completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {tour.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {completed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <button
                        onClick={() => handleStartTour(tour.id)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Play className="h-3 w-3" />
                        <span>Начать</span>
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {completedTours === totalTours ? (
                <span className="text-green-600 font-medium">
                  🎉 Поздравляем! Вы завершили все туры!
                </span>
              ) : (
                <span>
                  Завершите все туры для полного понимания системы
                </span>
              )}
            </div>
            
            {completedTours > 0 && (
              <button
                onClick={() => {
                  // Сброс прогресса (для тестирования)
                  if (confirm('Сбросить прогресс обучения?')) {
                    // Здесь можно добавить функцию сброса
                    window.location.reload()
                  }
                }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Сбросить
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
