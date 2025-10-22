'use client'

import { Suspense } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import { useSearchParams } from 'next/navigation'

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = ''
  if (error === 'blocked') {
    errorMessage = 'Ваша учетная запись заблокирована'
  } else if (error === 'inactive') {
    errorMessage = 'Ваша учетная запись не активна'
  } else if (error === 'CredentialsSignin') {
    errorMessage = 'Неверный email или пароль'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Lead2Build CRM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Система управления строительными проектами
          </p>
        </div>
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            {errorMessage}
          </div>
        )}

        <LoginForm />
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div>Загрузка...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

