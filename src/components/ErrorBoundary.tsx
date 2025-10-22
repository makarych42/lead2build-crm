'use client'

import { Component, ReactNode, ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { logError } from '@/utils/errorLogger'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Логирование ошибки
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Используем централизованную систему логирования
    logError(error, 'critical', {
      componentStack: errorInfo.componentStack,
      type: 'React Error Boundary'
    })

    // Вызываем коллбек если передан
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Если предоставлен кастомный fallback, используем его
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Иначе показываем стандартный UI ошибки
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Что-то пошло не так
                </h1>
                <p className="text-gray-600 mb-4">
                  Произошла непредвиденная ошибка. Мы автоматически сохранили информацию об ошибке.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mb-4">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
                      Детали ошибки (только для разработки)
                    </summary>
                    <div className="bg-gray-100 rounded-lg p-4 text-sm font-mono overflow-auto">
                      <div className="text-red-600 font-bold mb-2">
                        {this.state.error.toString()}
                      </div>
                      <div className="text-gray-700 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </div>
                      {this.state.errorInfo && (
                        <div className="mt-4 text-gray-600">
                          <div className="font-bold mb-1">Component Stack:</div>
                          <div className="whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </div>
                        </div>
                      )}
                    </div>
                  </details>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={this.handleReset}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Попробовать снова
                  </button>
                  <button
                    onClick={this.handleReload}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Перезагрузить страницу
                  </button>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  <p>Если проблема повторяется, пожалуйста, свяжитесь с поддержкой.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Хук для использования в функциональных компонентах
export function useErrorHandler() {
  return (error: Error) => {
    throw error
  }
}

