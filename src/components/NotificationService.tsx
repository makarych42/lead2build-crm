'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

// ============= ТИПЫ =============

export type NotificationVariant = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  variant: NotificationVariant
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  showNotification: (message: string, variant?: NotificationVariant, duration?: number) => void
  removeNotification: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
  confirm: (message: string, onConfirm: () => void, onCancel?: () => void) => void
}

// ============= CONTEXT =============

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

// ============= PROVIDER =============

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string
    onConfirm: () => void
    onCancel?: () => void
  } | null>(null)

  const showNotification = useCallback((
    message: string,
    variant: NotificationVariant = 'info',
    duration: number = 5000
  ) => {
    const id = `notification-${Date.now()}-${Math.random()}`
    const notification: Notification = { id, message, variant, duration }

    setNotifications(prev => [...prev, notification])

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const success = useCallback((message: string, duration?: number) => {
    showNotification(message, 'success', duration)
  }, [showNotification])

  const error = useCallback((message: string, duration?: number) => {
    showNotification(message, 'error', duration)
  }, [showNotification])

  const warning = useCallback((message: string, duration?: number) => {
    showNotification(message, 'warning', duration)
  }, [showNotification])

  const info = useCallback((message: string, duration?: number) => {
    showNotification(message, 'info', duration)
  }, [showNotification])

  const confirm = useCallback((
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    setConfirmDialog({ message, onConfirm, onCancel })
  }, [])

  const handleConfirm = useCallback(() => {
    if (confirmDialog) {
      confirmDialog.onConfirm()
      setConfirmDialog(null)
    }
  }, [confirmDialog])

  const handleCancel = useCallback(() => {
    if (confirmDialog) {
      confirmDialog.onCancel?.()
      setConfirmDialog(null)
    }
  }, [confirmDialog])

  const value: NotificationContextType = {
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info,
    confirm
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer notifications={notifications} onRemove={removeNotification} />
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </NotificationContext.Provider>
  )
}

// ============= NOTIFICATION CONTAINER =============

interface NotificationContainerProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

function NotificationContainer({ notifications, onRemove }: NotificationContainerProps) {
  if (notifications.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  )
}

// ============= NOTIFICATION TOAST =============

interface NotificationToastProps {
  notification: Notification
  onClose: () => void
}

function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const { message, variant } = notification

  const variants = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-600'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600'
    }
  }

  const config = variants[variant]
  const Icon = config.icon

  return (
    <div className={`${config.bg} border rounded-lg shadow-lg p-4 flex items-start space-x-3 min-w-[320px] animate-slide-in`}>
      <Icon className={`h-5 w-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <p className={`${config.text} flex-1 text-sm font-medium`}>{message}</p>
      <button
        onClick={onClose}
        className={`${config.text} hover:opacity-70 transition-opacity flex-shrink-0`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

// ============= CONFIRM DIALOG =============

interface ConfirmDialogProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <div className="flex items-start space-x-3 mb-6">
          <AlertCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Подтверждение</h3>
            <p className="text-sm text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  )
}

// ============= ANIMATIONS =============

// Добавьте эти стили в globals.css:
/*
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
*/

