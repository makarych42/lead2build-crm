# Error Logging System

Централизованная система логирования и обработки ошибок для Lead2Build CRM.

## Компоненты системы

### 1. ErrorLogger (`src/utils/errorLogger.ts`)
Основная утилита для логирования ошибок.

### 2. ErrorBoundary (`src/components/ErrorBoundary.tsx`)
React Error Boundary для отлова ошибок React компонентов.

### 3. GlobalErrorHandler (`src/components/GlobalErrorHandler.tsx`)
Инициализирует глобальные обработчики для unhandled errors и promise rejections.

### 4. ErrorLogs (`src/components/settings/ErrorLogs.tsx`)
UI компонент для просмотра и управления логами ошибок (Settings → Логи ошибок).

---

## Использование

### Автоматическое логирование

Система автоматически логирует:
- ✅ Ошибки React компонентов (через ErrorBoundary)
- ✅ Необработанные Promise rejections
- ✅ Глобальные JavaScript ошибки

```typescript
// Никаких действий не требуется - все автоматически!
```

### Ручное логирование

```typescript
import { logError } from '@/utils/errorLogger'

try {
  await someAsyncOperation()
} catch (error) {
  if (error instanceof Error) {
    logError(error, 'high', {
      operation: 'someAsyncOperation',
      userId: currentUser.id
    })
  }
}
```

**Уровни severity:**
- `low` - незначительные ошибки (информационные)
- `medium` - средние ошибки (требуют внимания)
- `high` - высокие ошибки (критичны для функционала)
- `critical` - критические ошибки (полный отказ системы)

### Wrapper для async функций

```typescript
import { withErrorLogging } from '@/utils/errorLogger'

const fetchData = withErrorLogging(
  async (id: string) => {
    const response = await fetch(`/api/data/${id}`)
    return response.json()
  },
  { operation: 'fetchData' } // контекст
)

// Теперь все ошибки будут автоматически логироваться
await fetchData('123')
```

---

## API

### `logError(error, severity, context)`

Логирует ошибку в localStorage.

```typescript
logError(
  new Error('Connection timeout'),
  'high',
  { endpoint: '/api/leads', timeout: 5000 }
)
```

**Параметры:**
- `error: Error` - объект ошибки
- `severity: 'low' | 'medium' | 'high' | 'critical'` - уровень критичности
- `context?: Record<string, any>` - дополнительный контекст

### `getErrorLogs()`

Получает все логи ошибок из localStorage.

```typescript
const errors = getErrorLogs()
// ErrorLog[]
```

### `clearErrorLogs()`

Очищает все логи ошибок.

```typescript
clearErrorLogs()
```

### `getErrorStats()`

Получает статистику по ошибкам.

```typescript
const stats = getErrorStats()
/*
{
  total: 15,
  bySeverity: {
    low: 2,
    medium: 5,
    high: 7,
    critical: 1
  },
  last24h: 8,
  byMessage: {
    'Network error': 5,
    'Validation failed': 3,
    ...
  }
}
*/
```

### `exportErrorLogs()`

Экспортирует логи в JSON формат.

```typescript
const json = exportErrorLogs()
// Строка с JSON
```

### `setupGlobalErrorHandlers()`

Инициализирует глобальные обработчики ошибок. Вызывается автоматически в `GlobalErrorHandler`.

```typescript
// Вызывается автоматически при загрузке приложения
setupGlobalErrorHandlers()
```

---

## Структура ErrorLog

```typescript
interface ErrorLog {
  id: string                    // Уникальный ID
  message: string               // Сообщение ошибки
  stack?: string                // Stack trace
  componentStack?: string       // React component stack
  timestamp: string             // ISO 8601 timestamp
  userAgent?: string            // Browser user agent
  url?: string                  // URL где произошла ошибка
  userId?: string               // ID пользователя (если доступен)
  severity: 'low' | 'medium' | 'high' | 'critical'
  context?: Record<string, any> // Дополнительный контекст
}
```

---

## UI для просмотра логов

Перейдите в **Settings → Логи ошибок** для просмотра:

### Возможности:
- 📊 Статистика по ошибкам (всего, по уровням, за 24 часа)
- 🔍 Фильтрация по severity
- 📋 Детальная информация (stack trace, component stack, context)
- 💾 Экспорт в JSON
- 🗑️ Очистка всех логов

---

## Примеры использования

### 1. В компонентах React

```typescript
import { logError } from '@/utils/errorLogger'

function MyComponent() {
  const handleSubmit = async () => {
    try {
      await saveData(formData)
    } catch (error) {
      if (error instanceof Error) {
        logError(error, 'high', {
          component: 'MyComponent',
          formData
        })
      }
      showError('Не удалось сохранить данные')
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### 2. В API вызовах

```typescript
import { withErrorLogging } from '@/utils/errorLogger'

const apiClient = {
  fetchLeads: withErrorLogging(
    async () => {
      const response = await fetch('/api/leads')
      if (!response.ok) throw new Error('Failed to fetch leads')
      return response.json()
    },
    { api: 'fetchLeads' }
  ),

  createLead: withErrorLogging(
    async (data: Lead) => {
      const response = await fetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify(data)
      })
      if (!response.ok) throw new Error('Failed to create lead')
      return response.json()
    },
    { api: 'createLead' }
  )
}
```

### 3. В утилитах

```typescript
import { logError } from '@/utils/errorLogger'

function parseExcelData(file: File): Apartment[] {
  try {
    const data = XLSX.read(file, { type: 'binary' })
    // ... парсинг
    return apartments
  } catch (error) {
    if (error instanceof Error) {
      logError(error, 'medium', {
        utility: 'parseExcelData',
        fileName: file.name,
        fileSize: file.size
      })
    }
    throw error // Re-throw для обработки в компоненте
  }
}
```

### 4. Мониторинг критических операций

```typescript
import { logError } from '@/utils/errorLogger'

async function performCriticalOperation() {
  try {
    await doSomethingCritical()
  } catch (error) {
    if (error instanceof Error) {
      // Критическая ошибка - высший приоритет
      logError(error, 'critical', {
        operation: 'performCriticalOperation',
        timestamp: Date.now()
      })
      
      // Можно отправить уведомление администратору
      notifyAdmin('Critical operation failed!')
    }
  }
}
```

---

## Интеграция с внешними сервисами

Вы можете расширить `logError()` для отправки ошибок в внешние системы:

### Sentry

```typescript
// src/utils/errorLogger.ts
import * as Sentry from '@sentry/nextjs'

export function logError(error, severity, context) {
  // ... существующий код

  // Отправка в Sentry
  if (severity === 'critical' || severity === 'high') {
    Sentry.captureException(error, {
      level: severity,
      contexts: { custom: context }
    })
  }
}
```

### Custom API endpoint

```typescript
export function logError(error, severity, context) {
  // ... существующий код

  // Отправка на сервер
  if (severity === 'critical' || severity === 'high') {
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog)
    }).catch(console.error)
  }
}
```

---

## Лимиты и производительность

- **localStorage limit:** Хранится максимум 50 последних ошибок
- **Старые ошибки:** Автоматически удаляются при превышении лимита
- **Производительность:** Минимальное влияние, все операции асинхронные

---

## Best Practices

1. **Используйте правильный severity:**
   - `critical` - только для полного отказа системы
   - `high` - для ошибок, блокирующих функционал
   - `medium` - для ошибок, не блокирующих работу
   - `low` - для информационных ошибок

2. **Добавляйте контекст:**
   ```typescript
   logError(error, 'high', {
     userId: currentUser.id,
     operation: 'saveData',
     data: sanitizedData // Не логируйте чувствительные данные!
   })
   ```

3. **Не логируйте чувствительные данные:**
   - Пароли
   - Токены
   - Персональные данные

4. **Проверяйте логи регулярно:**
   - Переходите в Settings → Логи ошибок
   - Анализируйте повторяющиеся ошибки
   - Экспортируйте логи для анализа

5. **Очищайте старые логи:**
   - Периодически очищайте логи через UI
   - Экспортируйте перед очисткой при необходимости

---

## Тестирование

Для тестирования системы логирования:

```typescript
import { logError, getErrorLogs, clearErrorLogs } from '@/utils/errorLogger'

// 1. Создать тестовую ошибку
logError(new Error('Test error'), 'low', { test: true })

// 2. Проверить, что она залогирована
const logs = getErrorLogs()
console.log('Total errors:', logs.length)

// 3. Очистить после теста
clearErrorLogs()
```

---

## Troubleshooting

### Ошибки не логируются

1. Проверьте, что `GlobalErrorHandler` включен в layout.tsx
2. Проверьте console - там должно быть сообщение "✅ Global error handlers initialized"
3. Проверьте localStorage - ключ `app_errors`

### localStorage переполнен

Система автоматически ограничивает количество ошибок до 50. Если нужно больше, измените `MAX_ERRORS` в `errorLogger.ts`.

### Ошибки не отображаются в UI

1. Перейдите в Settings → Логи ошибок
2. Проверьте фильтр (по умолчанию "Все")
3. Обновите страницу

---

## Итого

Система логирования ошибок обеспечивает:
- 🛡️ **Автоматический перехват** всех ошибок
- 📊 **Статистика и аналитика** ошибок
- 🔍 **Детальная информация** для отладки
- 💾 **Персистентность** в localStorage
- 📱 **Удобный UI** для просмотра
- 🚀 **Готовность к интеграции** с внешними сервисами

**Production ready!** ✅

