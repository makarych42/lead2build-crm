'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-gray-400">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-4">
            Страница не найдена
          </h2>
          <p className="text-gray-500 mt-2">
            Извините, запрашиваемая страница не существует.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Вернуться на главную
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-block w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
  )
}
