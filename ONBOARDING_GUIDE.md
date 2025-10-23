# Руководство по системе онбординга Lead2Build CRM

## Обзор

Система онбординга Lead2Build CRM предоставляет интерактивные туры для новых пользователей, помогая им быстро освоить функционал системы в зависимости от их роли.

## Архитектура

### Основные компоненты

1. **OnboardingProvider** - основной провайдер, интегрирующий React Joyride
2. **WelcomeModal** - модальное окно приветствия с выбором роли
3. **OnboardingChecklist** - виджет с прогрессом обучения
4. **TourController** - контроллер для управления турами
5. **useOnboardingStore** - Zustand store для управления состоянием

### Типы пользователей

Система поддерживает следующие роли:
- `SALES_MANAGER` - Менеджер по продажам
- `DOCUMENT_SPECIALIST` - Специалист по документам  
- `TECHNICAL_INSPECTOR` - Технический инспектор
- `VOTING_COORDINATOR` - Координатор голосований
- `VOTING_MANAGER` - Менеджер голосований
- `ADMIN` - Администратор

## Доступные туры

### 1. Dashboard (Главная панель)
- **Роли**: Все
- **Обязательный**: Да
- **Описание**: Обзор системы, статистика, быстрые действия

### 2. Leads (Управление лидами)
- **Роли**: SALES_MANAGER, ADMIN
- **Обязательный**: Да
- **Описание**: Работа с потенциальными клиентами

### 3. Documents (Управление документами)
- **Роли**: DOCUMENT_SPECIALIST, ADMIN
- **Обязательный**: Да
- **Описание**: Загрузка и обработка документов

### 4. Voting (Организация голосований)
- **Роли**: VOTING_COORDINATOR, VOTING_MANAGER, ADMIN
- **Обязательный**: Да
- **Описание**: Создание и управление голосованиями

### 5. Analytics (Аналитика и отчеты)
- **Роли**: SALES_MANAGER, VOTING_MANAGER, ADMIN
- **Обязательный**: Нет
- **Описание**: Просмотр статистики и аналитических данных

### 6. Tasks (Управление задачами)
- **Роли**: Все
- **Обязательный**: Да
- **Описание**: Создание и отслеживание задач

### 7. Telegram (Telegram интеграция)
- **Роли**: ADMIN
- **Обязательный**: Нет
- **Описание**: Настройка автоматизации через Telegram

### 8. Settings (Настройки системы)
- **Роли**: ADMIN
- **Обязательный**: Нет
- **Описание**: Управление пользователями и настройками

## Как добавить новый тур

### 1. Создание конфигурации тура

В файле `src/config/onboarding-tours.ts` добавьте новый тур:

```typescript
const newTour: OnboardingTour = {
  id: 'new-feature',
  name: 'Новая функция',
  description: 'Описание новой функции',
  roles: ['SALES_MANAGER', 'ADMIN'], // Роли, для которых доступен тур
  required: false, // Обязательный ли тур
  order: 9, // Порядок показа
  steps: [
    {
      target: '[data-tour="new-feature-header"]',
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Заголовок шага</h3>
          <p>Описание шага</p>
        </div>
      ),
      placement: 'bottom'
    }
  ]
}
```

### 2. Добавление в конфигурацию ролей

Обновите `roleBasedTours` для соответствующих ролей:

```typescript
SALES_MANAGER: {
  role: 'SALES_MANAGER',
  description: ROLE_DESCRIPTIONS.SALES_MANAGER,
  welcomeMessage: 'Добро пожаловать! Вы работаете менеджером по продажам.',
  tours: [dashboardTour, leadsTour, newTour] // Добавьте новый тур
}
```

### 3. Добавление data-атрибутов

В компоненте, который нужно показать в туре, добавьте data-атрибуты:

```tsx
<div data-tour="new-feature-header">
  <h2>Заголовок новой функции</h2>
</div>
```

### 4. Обновление констант

В файле `src/types/onboarding.ts` добавьте новый ID тура:

```typescript
export const ONBOARDING_TOURS = {
  // ... существующие туры
  NEW_FEATURE: 'new-feature'
} as const
```

## Как создать тур для новой роли

### 1. Добавление новой роли

В файле `src/types/index.ts` добавьте новую роль:

```typescript
export type UserRole = 
  | 'SALES_MANAGER' 
  | 'DOCUMENT_SPECIALIST' 
  | 'TECHNICAL_INSPECTOR' 
  | 'VOTING_COORDINATOR' 
  | 'VOTING_MANAGER' 
  | 'ADMIN'
  | 'NEW_ROLE' // Добавьте новую роль
```

### 2. Добавление описания роли

В файле `src/types/onboarding.ts` добавьте описание:

```typescript
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  // ... существующие роли
  NEW_ROLE: 'Описание новой роли'
}
```

### 3. Создание конфигурации туров

В файле `src/config/onboarding-tours.ts` добавьте конфигурацию:

```typescript
export const roleBasedTours: Record<UserRole, RoleBasedTour> = {
  // ... существующие роли
  NEW_ROLE: {
    role: 'NEW_ROLE',
    description: ROLE_DESCRIPTIONS.NEW_ROLE,
    welcomeMessage: 'Добро пожаловать! Вы работаете в новой роли.',
    tours: [dashboardTour, /* добавьте нужные туры */]
  }
}
```

## Конфигурация шагов

### Основные параметры шага

```typescript
{
  target: '[data-tour="element-id"]', // CSS селектор элемента
  content: <ReactNode>, // Содержимое шага
  placement: 'bottom', // Позиция tooltip
  title: 'Заголовок', // Заголовок шага
  disableBeacon: false, // Отключить маячок
  hideCloseButton: false, // Скрыть кнопку закрытия
  hideFooter: false, // Скрыть футер с кнопками
  spotlightClicks: false, // Разрешить клики в spotlight
  spotlightPadding: 4, // Отступ spotlight
  styles: {
    options: {
      primaryColor: '#3B82F6',
      textColor: '#1F2937',
      backgroundColor: '#FFFFFF',
      overlayColor: 'rgba(0, 0, 0, 0.4)',
      spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
      beaconSize: 36,
      zIndex: 1000
    }
  }
}
```

### Позиции tooltip

- `top` - сверху
- `bottom` - снизу  
- `left` - слева
- `right` - справа
- `center` - по центру
- `auto` - автоматически

## Best Practices

### 1. Структура шагов

- Начинайте с общего обзора
- Переходите к конкретным функциям
- Заканчивайте практическими действиями
- Ограничивайте количество шагов (5-7 максимум)

### 2. Содержимое шагов

- Используйте понятный язык
- Добавляйте визуальные элементы (иконки, эмодзи)
- Предоставляйте контекст и объяснения
- Включайте практические советы

### 3. Навигация

- Используйте data-атрибуты для целей
- Проверяйте доступность элементов
- Добавляйте fallback для отсутствующих элементов
- Тестируйте на разных размерах экрана

### 4. Производительность

- Ленивая загрузка туров
- Кэширование конфигураций
- Оптимизация анимаций
- Минимизация re-renders

## API Reference

### useOnboardingStore

```typescript
const {
  // State
  isActive,
  currentTour,
  currentStep,
  progress,
  showWelcomeModal,
  showChecklist,
  
  // Actions
  startTour,
  stopTour,
  nextStep,
  prevStep,
  skipTour,
  markTourCompleted,
  markStepCompleted,
  updateProgress,
  showWelcomeModal,
  hideWelcomeModal,
  toggleChecklist,
  initializeOnboarding,
  resetOnboarding
} = useOnboardingStore()
```

### useOnboarding (Context)

```typescript
const {
  isActive,
  currentTour,
  currentStep,
  startTour,
  stopTour,
  nextStep,
  prevStep,
  skipTour
} = useOnboarding()
```

### TourController

```typescript
<TourController 
  variant="default" | "compact" | "floating"
  showLabel={boolean}
  className="custom-class"
/>
```

## Отладка

### Проверка доступности элементов

```typescript
import { isTourTargetAvailable } from '@/utils/onboarding'

// Проверить, существует ли элемент
const isAvailable = isTourTargetAvailable('[data-tour="my-element"]')
```

### Логирование событий

```typescript
import { trackTourStart, trackTourComplete } from '@/utils/onboarding'

// Отследить начало тура
trackTourStart('dashboard', 'SALES_MANAGER')

// Отследить завершение тура
trackTourComplete('dashboard', 'SALES_MANAGER', 120) // 120 секунд
```

### Сброс прогресса

```typescript
import { clearOnboardingProgress } from '@/utils/onboarding'

// Очистить весь прогресс
clearOnboardingProgress()
```

## Тестирование

### Unit тесты

```typescript
import { renderHook } from '@testing-library/react'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

test('should start tour', () => {
  const { result } = renderHook(() => useOnboardingStore())
  
  act(() => {
    result.current.startTour('dashboard')
  })
  
  expect(result.current.isActive).toBe(true)
  expect(result.current.currentTour?.id).toBe('dashboard')
})
```

### Integration тесты

```typescript
import { render, screen } from '@testing-library/react'
import { OnboardingProvider } from '@/components/onboarding/OnboardingProvider'

test('should show welcome modal for new user', () => {
  render(
    <OnboardingProvider>
      <App />
    </OnboardingProvider>
  )
  
  expect(screen.getByText('Добро пожаловать в Lead2Build CRM!')).toBeInTheDocument()
})
```

## Troubleshooting

### Тур не запускается

1. Проверьте, что элемент с data-атрибутом существует
2. Убедитесь, что роль пользователя поддерживает тур
3. Проверьте консоль на ошибки JavaScript

### Элементы не подсвечиваются

1. Проверьте CSS селекторы в target
2. Убедитесь, что элементы видимы на странице
3. Проверьте z-index конфликты

### Модальные окна не показываются

1. Проверьте состояние в useOnboardingStore
2. Убедитесь, что компоненты правильно подключены
3. Проверьте CSS стили для z-index

## Обновления и миграции

При обновлении системы онбординга:

1. Обновите версию в localStorage ключе
2. Добавьте миграции для существующих данных
3. Обновите документацию
4. Протестируйте обратную совместимость

## Поддержка

Для вопросов и предложений по системе онбординга:

1. Проверьте этот документ
2. Изучите примеры в коде
3. Создайте issue в репозитории
4. Обратитесь к команде разработки
