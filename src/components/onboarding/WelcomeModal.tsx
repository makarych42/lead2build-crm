'use client'

import React, { useState } from 'react'
import { X, User, ArrowRight, Play, SkipForward } from 'lucide-react'
import { useOnboardingStore, useOnboardingState, useOnboardingActions } from '@/stores/useOnboardingStore'
import { useUsersStore } from '@/stores/useUsersStore'
import { getWelcomeMessage, getRoleDescription, getToursForRole } from '@/config/onboarding-tours'
import { UserRole } from '@/types'

interface WelcomeModalProps {
  isOpen: boolean
  onClose: () => void
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { getCurrentUser, updateUser } = useUsersStore()
  const onboardingState = useOnboardingState()
  const onboardingActions = useOnboardingActions()
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isRoleSelection, setIsRoleSelection] = useState(false)

  const currentUser = getCurrentUser()

  // Определяем, нужно ли показывать выбор роли
  React.useEffect(() => {
    if (currentUser && !currentUser.role) {
      setIsRoleSelection(true)
    } else if (currentUser?.role) {
      setSelectedRole(currentUser.role as UserRole)
    }
  }, [currentUser])

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    if (currentUser) {
      updateUser(currentUser.id, { role })
    }
  }

  const handleStartTour = () => {
    if (selectedRole) {
      const tours = getToursForRole(selectedRole)
      const firstTour = tours.find(tour => tour.required) || tours[0]
      
      if (firstTour) {
        onboardingActions.startTour(firstTour.id)
      }
    }
    onClose()
  }

  const handleSkipOnboarding = () => {
    onboardingActions.hideWelcomeModal()
    if (currentUser) {
      updateUser(currentUser.id, { onboardingCompleted: true })
    }
    onClose()
  }

  const handleClose = () => {
    onboardingActions.hideWelcomeModal()
    onClose()
  }

  if (!isOpen) return null

  const availableRoles: { role: UserRole; title: string; description: string }[] = [
    {
      role: 'SALES_MANAGER',
      title: 'Менеджер по продажам',
      description: 'Работа с лидами, консультации, ведение клиентов'
    },
    {
      role: 'DOCUMENT_SPECIALIST',
      title: 'Специалист по документам',
      description: 'Подготовка и обработка документов'
    },
    {
      role: 'TECHNICAL_INSPECTOR',
      title: 'Технический инспектор',
      description: 'Проведение обследований и технических проверок'
    },
    {
      role: 'VOTING_COORDINATOR',
      title: 'Координатор голосований',
      description: 'Организация и проведение голосований жильцов'
    },
    {
      role: 'VOTING_MANAGER',
      title: 'Менеджер голосований',
      description: 'Управление процессом голосований'
    },
    {
      role: 'ADMIN',
      title: 'Администратор',
      description: 'Полный доступ ко всем функциям системы'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Добро пожаловать в Lead2Build CRM!
              </h2>
              <p className="text-sm text-gray-500">
                Система управления процессом голосования жильцов
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isRoleSelection ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Выберите вашу роль в системе
                </h3>
                <p className="text-gray-600">
                  Это поможет нам показать вам релевантные функции и создать персонализированный тур.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableRoles.map((roleInfo) => (
                  <button
                    key={roleInfo.role}
                    onClick={() => handleRoleSelect(roleInfo.role)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      selectedRole === roleInfo.role
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900 mb-1">
                      {roleInfo.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {roleInfo.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {selectedRole ? getWelcomeMessage(selectedRole) : 'Добро пожаловать!'}
                </h3>
                <p className="text-gray-600">
                  {selectedRole ? getRoleDescription(selectedRole) : 'Давайте познакомимся с системой.'}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Что вас ждет в туре:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Обзор главной панели и статистики</li>
                  <li>• Работа с лидами и документами</li>
                  <li>• Организация голосований</li>
                  <li>• Управление задачами</li>
                  <li>• Настройки системы</li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  💡 Совет
                </h4>
                <p className="text-sm text-gray-700">
                  Вы всегда можете запустить тур повторно из раздела настроек или нажав на кнопку "Помощь" в правом верхнем углу.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleSkipOnboarding}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <SkipForward className="h-4 w-4" />
            <span>Пропустить тур</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Закрыть
            </button>
            
            {selectedRole && (
              <button
                onClick={handleStartTour}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>Начать тур</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
