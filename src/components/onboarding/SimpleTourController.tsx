'use client'

import React from 'react'
import { Play, Square, HelpCircle } from 'lucide-react'
import { useOnboarding } from './SimpleOnboardingProvider'

interface SimpleTourControllerProps {
  className?: string
  variant?: 'default' | 'floating'
}

export const SimpleTourController: React.FC<SimpleTourControllerProps> = ({ 
  className = '', 
  variant = 'default'
}) => {
  const { isActive, startTour, stopTour } = useOnboarding()

  const handleStartTour = () => {
    startTour('demo')
  }

  const handleStopTour = () => {
    stopTour()
  }

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
          {isActive ? (
            <button
              onClick={handleStopTour}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              title="Остановить тур"
            >
              <Square className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleStartTour}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
              title="Начать тур"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {isActive ? (
        <button
          onClick={handleStopTour}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
        >
          <Square className="h-4 w-4" />
          <span>Остановить тур</span>
        </button>
      ) : (
        <button
          onClick={handleStartTour}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
          <Play className="h-4 w-4" />
          <span>Начать обучение</span>
        </button>
      )}
    </div>
  )
}
