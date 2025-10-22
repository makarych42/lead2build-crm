# Loading States & Skeletons Guide

Руководство по использованию loading states и skeleton компонентов в Lead2Build CRM.

---

## 📦 Компоненты

### Базовые (src/components/LoadingStates.tsx)

**1. Skeleton** - базовый блок загрузки
```typescript
<Skeleton width={200} height={20} className="mb-2" />
```

**2. CardSkeleton** - скелетон карточки
```typescript
<CardSkeleton />
```

**3. TableSkeleton** - скелетон таблицы
```typescript
<TableSkeleton rows={5} columns={4} />
```

**4. ListSkeleton** - скелетон списка
```typescript
<ListSkeleton items={5} />
```

**5. Spinner** - спиннер загрузки
```typescript
<Spinner size="md" />  // sm, md, lg
```

**6. FullPageLoader** - полноэкранный loader
```typescript
<FullPageLoader message="Загрузка данных..." />
```

**7. ButtonLoader** - loader для кнопок
```typescript
<ButtonLoader />
```

**8. EmptyState** - пустое состояние
```typescript
<EmptyState
  icon={<Home />}
  title="Нет данных"
  description="Создайте первый лид"
  action={<button>Создать</button>}
/>
```

**9. ProgressBar** - прогресс-бар
```typescript
<ProgressBar 
  progress={75} 
  label="Завершено"
  color="blue"
/>
```

**10. Badge** - badge/метка
```typescript
<Badge variant="success">Активно</Badge>
```

---

### Специализированные (src/components/skeletons/)

#### Leads (LeadsSkeleton.tsx)

**LeadsGridSkeleton** - сетка лидов
```typescript
import { LeadsGridSkeleton } from '@/components/skeletons'

<LeadsGridSkeleton count={6} />
```

**LeadsListSkeleton** - список лидов
```typescript
import { LeadsListSkeleton } from '@/components/skeletons'

<LeadsListSkeleton count={10} />
```

#### Voting (VotingSkeleton.tsx)

**VotingTableSkeleton** - таблица голосований
```typescript
import { VotingTableSkeleton } from '@/components/skeletons'

<VotingTableSkeleton rows={5} />
```

**VotingStatsSkeleton** - статистика голосований
```typescript
import { VotingStatsSkeleton } from '@/components/skeletons'

<VotingStatsSkeleton />
```

**ApartmentTableSkeleton** - подтаблица квартир
```typescript
import { ApartmentTableSkeleton } from '@/components/skeletons'

<ApartmentTableSkeleton rows={3} />
```

#### Tasks (TasksSkeleton.tsx)

**TaskCardSkeleton** - карточка задачи
```typescript
import { TaskCardSkeleton } from '@/components/skeletons'

<TaskCardSkeleton />
```

**TasksListSkeleton** - список задач
```typescript
import { TasksListSkeleton } from '@/components/skeletons'

<TasksListSkeleton count={6} />
```

**TaskStatsSkeleton** - статистика задач
```typescript
import { TaskStatsSkeleton } from '@/components/skeletons'

<TaskStatsSkeleton />
```

**TasksKanbanSkeleton** - Kanban доска
```typescript
import { TasksKanbanSkeleton } from '@/components/skeletons'

<TasksKanbanSkeleton />
```

#### Analytics (AnalyticsSkeleton.tsx)

**MetricCardSkeleton** - метрическая карточка
```typescript
import { MetricCardSkeleton } from '@/components/skeletons'

<MetricCardSkeleton />
```

**MetricsGridSkeleton** - сетка метрик
```typescript
import { MetricsGridSkeleton } from '@/components/skeletons'

<MetricsGridSkeleton count={6} />
```

**ChartSkeleton** - график/диаграмма
```typescript
import { ChartSkeleton } from '@/components/skeletons'

<ChartSkeleton height={300} />
```

**AnalyticsTableSkeleton** - таблица аналитики
```typescript
import { AnalyticsTableSkeleton } from '@/components/skeletons'

<AnalyticsTableSkeleton rows={5} />
```

**FilterPanelSkeleton** - панель фильтров
```typescript
import { FilterPanelSkeleton } from '@/components/skeletons'

<FilterPanelSkeleton />
```

---

## 🎯 Паттерны использования

### 1. Zustand Store Initialization

```typescript
import { useLeadsStore } from '@/stores'
import { LeadsListSkeleton } from '@/components/skeletons'

export default function LeadsList() {
  const leads = useLeadsStore((state) => state.leads)
  const isInitialized = useLeadsStore((state) => state.isInitialized)

  if (!isInitialized) {
    return <LeadsListSkeleton count={10} />
  }

  return (
    // ... основной контент
  )
}
```

### 2. Async Operations (Forms)

```typescript
import { useState } from 'react'
import { ButtonLoader } from '@/components/LoadingStates'

export default function NewLeadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    setIsSubmitting(true)
    try {
      await createLead(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ... fields ... */}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className="...disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <ButtonLoader />
            <span className="ml-2">Сохранение...</span>
          </>
        ) : (
          <>
            <Save />
            Сохранить
          </>
        )}
      </button>
    </form>
  )
}
```

### 3. Empty States

```typescript
import { EmptyState } from '@/components/LoadingStates'
import { Plus, FileX } from 'lucide-react'

if (filteredLeads.length === 0) {
  return (
    <EmptyState
      icon={<FileX className="h-12 w-12 text-gray-400" />}
      title="Лиды не найдены"
      description="Попробуйте изменить фильтры или создайте новый лид"
      action={
        <button
          onClick={() => setShowNewLeadForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Создать лид
        </button>
      }
    />
  )
}
```

### 4. Progress Tracking

```typescript
import { ProgressBar } from '@/components/LoadingStates'

<ProgressBar
  progress={votedArea / totalArea * 100}
  label="Прогресс голосования"
  color="green"
  showPercentage={true}
/>
```

### 5. Conditional Skeletons

```typescript
import { LeadsGridSkeleton, LeadsListSkeleton } from '@/components/skeletons'

if (!isInitialized) {
  return viewMode === 'grid' 
    ? <LeadsGridSkeleton count={6} />
    : <LeadsListSkeleton count={10} />
}
```

---

## ✅ Реализованные компоненты

### С loading states:

- ✅ **LeadsList.tsx** - skeleton при инициализации
- ✅ **NewLeadForm.tsx** - button loader при создании

### Готовые skeleton компоненты:

- ✅ LeadsGridSkeleton, LeadsListSkeleton
- ✅ VotingTableSkeleton, VotingStatsSkeleton, ApartmentTableSkeleton
- ✅ TaskCardSkeleton, TasksListSkeleton, TaskStatsSkeleton, TasksKanbanSkeleton
- ✅ MetricCardSkeleton, MetricsGridSkeleton, ChartSkeleton, AnalyticsTableSkeleton, FilterPanelSkeleton

---

## 📋 TODO: Где добавить loading states

### HIGH PRIORITY:

1. **voting/index.tsx** ⏳
   - Skeleton при загрузке таблицы
   - Button loader при создании голосования
   - Button loader при изменении статуса

2. **tasks/index.tsx** ⏳
   - Skeleton при инициализации
   - Button loader при создании задачи
   - Loading для bulk operations

3. **DocumentManager.tsx** ⏳
   - Skeleton при загрузке
   - Progress bar для upload файлов
   - Button loader при смене статуса

4. **Analytics.tsx** ⏳
   - Skeleton для метрик
   - Loading для фильтрации

### MEDIUM PRIORITY:

5. **Settings/UserManagement.tsx** ⏳
   - Skeleton для таблицы пользователей
   - Button loader при сохранении

6. **TelegramIntegration.tsx** ⏳
   - Skeleton для списка подключений
   - Button loader при отправке уведомлений

7. **ErrorLogs.tsx** ⏳
   - Skeleton для списка ошибок

### LOW PRIORITY:

8. **Dashboard.tsx** ⏳
   - Skeleton для карточек метрик

---

## 🎨 Кастомизация

### Создание кастомного skeleton

```typescript
function CustomSkeleton() {
  return (
    <div className="space-y-4">
      {/* Заголовок */}
      <div className="flex items-center space-x-4">
        <Skeleton width={48} height={48} className="rounded-full" />
        <div className="flex-1">
          <Skeleton height={20} width="60%" className="mb-2" />
          <Skeleton height={16} width="40%" />
        </div>
      </div>

      {/* Контент */}
      <div className="space-y-2">
        <Skeleton height={16} width="100%" />
        <Skeleton height={16} width="95%" />
        <Skeleton height={16} width="90%" />
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-4 border-t">
        <Skeleton width={80} height={24} />
        <Skeleton width={100} height={32} className="rounded" />
      </div>
    </div>
  )
}
```

### Настройка анимации

В `tailwind.config.ts`:

```typescript
module.exports = {
  theme: {
    extend: {
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    }
  }
}
```

В `globals.css`:

```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 🚀 Best Practices

### 1. Matching Layout

Skeleton должен повторять layout реального контента:

```typescript
// ✅ GOOD - skeleton совпадает с реальным layout
<div className="grid grid-cols-3 gap-4">
  {isLoading ? (
    Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)
  ) : (
    items.map(item => <Card key={item.id} {...item} />)
  )}
</div>

// ❌ BAD - разный layout
{isLoading ? (
  <Spinner /> // просто спиннер вместо сетки карточек
) : (
  <div className="grid grid-cols-3 gap-4">...</div>
)}
```

### 2. Realistic Count

Показывайте реалистичное количество skeleton элементов:

```typescript
// ✅ GOOD
<LeadsListSkeleton count={10} /> // ~1 экран данных

// ❌ BAD
<LeadsListSkeleton count={100} /> // слишком много
```

### 3. Disable Interactions

Блокируйте взаимодействие при loading:

```typescript
<button
  onClick={handleSave}
  disabled={isSubmitting}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  {isSubmitting ? <ButtonLoader /> : 'Сохранить'}
</button>
```

### 4. Optimistic Updates

Для лучшего UX используйте optimistic updates:

```typescript
const handleDelete = async (id: string) => {
  // Оптимистично удаляем из UI
  const originalLeads = leads
  setLeads(leads.filter(l => l.id !== id))

  try {
    await deleteLead(id)
  } catch (error) {
    // Откатываем при ошибке
    setLeads(originalLeads)
    showError('Ошибка удаления')
  }
}
```

### 5. Progressive Enhancement

Показывайте skeleton только при первой загрузке:

```typescript
const [isFirstLoad, setIsFirstLoad] = useState(true)

useEffect(() => {
  if (isInitialized && isFirstLoad) {
    setIsFirstLoad(false)
  }
}, [isInitialized])

if (isFirstLoad && !isInitialized) {
  return <LeadsListSkeleton />
}

// При последующих обновлениях - просто обновляем данные
```

---

## 📊 Производительность

### Оптимизация skeleton

```typescript
// ✅ GOOD - useMemo для массива
const skeletons = useMemo(() => 
  Array.from({ length: count }).map((_, i) => (
    <CardSkeleton key={i} />
  ))
, [count])

// ❌ BAD - пересоздается каждый рендер
const skeletons = Array.from({ length: count }).map((_, i) => (
  <CardSkeleton key={i} />
))
```

---

## ✅ Итого

**Создано компонентов:** 24
- Базовых: 10
- Специализированных: 14

**Интегрировано:** 2/10 компонентов
- ✅ LeadsList
- ✅ NewLeadForm
- ⏳ VotingManager
- ⏳ TaskManagement
- ⏳ DocumentManager
- ⏳ Analytics
- ⏳ Settings
- ⏳ TelegramIntegration
- ⏳ ErrorLogs
- ⏳ Dashboard

**Покрытие:** ~20% (интеграция в критичных местах)

**Следующий шаг:** Добавить loading states в VotingManager и TaskManagement

