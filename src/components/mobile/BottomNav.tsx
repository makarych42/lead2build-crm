'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, ListTodo, Vote, User } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/mobile',
      label: 'Главная',
      icon: Home,
    },
    {
      href: '/mobile/leads',
      label: 'Лиды',
      icon: ListTodo,
    },
    {
      href: '/mobile/voting',
      label: 'Голосования',
      icon: Vote,
    },
    {
      href: '/mobile/tasks',
      label: 'Задачи',
      icon: User,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 active:bg-gray-100'
              }`}
            >
              <Icon className={`h-6 w-6 ${isActive ? 'stroke-2' : ''}`} />
              <span className={`text-xs ${isActive ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

