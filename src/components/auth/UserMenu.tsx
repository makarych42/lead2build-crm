'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { User, LogOut, Settings, Shield } from 'lucide-react'
import { ROLE_LABELS } from '@/types'

export default function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Закрывать меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen])

  if (!session?.user) {
    return null
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const userRole = session.user.role as keyof typeof ROLE_LABELS
  const roleLabel = ROLE_LABELS[userRole] || session.user.role

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold">
          {session.user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-gray-900">
            {session.user.name}
          </div>
          <div className="text-xs text-gray-500">{roleLabel}</div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {session.user.name}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {session.user.email}
            </p>
            <div className="mt-2 flex items-center">
              <Shield className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-xs text-gray-500">{roleLabel}</span>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false)
                // Navigate to profile or settings
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <User className="h-4 w-4 mr-2" />
              Профиль
            </button>

            <button
              onClick={() => {
                setIsOpen(false)
                // Navigate to settings
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <Settings className="h-4 w-4 mr-2" />
              Настройки
            </button>
          </div>

          <div className="border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

