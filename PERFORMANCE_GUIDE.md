# Руководство по производительности и UX компонентам

## 📦 Новые утилиты

### 1. Performance Utils (`src/utils/performance.ts`)

Набор утилит для оптимизации производительности приложения.

#### Debounce и Throttle

```typescript
import { debounce, throttle, useDebounce } from '@/utils/performance'

// Debounce - откладывает выполнение
const debouncedSearch = debounce((query: string) => {
  performSearch(query)
}, 300)

// Throttle - ограничивает частоту выполнения
const throttledScroll = throttle(() => {
  updateScrollPosition()
}, 100)

// React Hook для debounce
function SearchComponent() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  
  useEffect(() => {
    // Выполнится только после 300мс после последнего изменения
    performSearch(debouncedSearch)
  }, [debouncedSearch])
}
```

#### Хуки для оптимизации

```typescript
import { usePrevious, useUpdateEffect } from '@/utils/performance'

// Получить предыдущее значение
const prevCount = usePrevious(count)

// Выполнить эффект только при обновлении (не при mount)
useUpdateEffect(() => {
  console.log('Count changed!')
}, [count])
```

#### Работа с данными

```typescript
import {
  paginateArray,
  getPaginationInfo,
  sortByKey,
  groupBy,
  filterByConditions,
  searchInArray
} from '@/utils/performance'

// Пагинация
const page1 = paginateArray(items, 1, 10) // Первые 10 элементов
const info = getPaginationInfo(100, 1, 10)
// { totalPages: 10, currentPage: 1, hasNextPage: true, ... }

// Сортировка
const sorted = sortByKey(users, 'name', 'asc')

// Группировка
const grouped = groupBy(tasks, 'status')
// { PENDING: [...], IN_PROGRESS: [...], COMPLETED: [...] }

// Фильтрация
const filtered = filterByConditions(leads, {
  status: 'NEW',
  city: 'Москва'
})

// Поиск
const results = searchInArray(users, 'иван', ['name', 'email'])
```

#### Форматирование

```typescript
import {
  formatNumber,
  formatPercent,
  formatDate,
  getRelativeTime
} from '@/utils/performance'

formatNumber(1234567, 2) // "1 234 567,00"
formatPercent(75.5, 1) // "75.5%"
formatDate('2025-10-21', 'short') // "21.10.2025"
getRelativeTime('2025-10-20T10:00:00') // "1 дн назад"
```

---

### 2. Loading States (`src/components/LoadingStates.tsx`)

Компоненты для индикации загрузки и пустых состояний.

#### Скелетоны

```typescript
import { Skeleton, CardSkeleton, TableSkeleton, ListSkeleton } from '@/components/LoadingStates'

// Базовый скелетон
<Skeleton width={200} height={20} />

// Скелетон карточки
<CardSkeleton />

// Скелетон таблицы (5 строк, 4 колонки)
<TableSkeleton rows={5} columns={4} />

// Скелетон списка (3 элемента)
<ListSkeleton items={3} />
```

#### Спиннеры

```typescript
import { Spinner, FullPageLoader, ButtonLoader } from '@/components/LoadingStates'

// Обычный спиннер
<Spinner size="md" />

// Полноэкранная загрузка
<FullPageLoader message="Загрузка данных..." />

// В кнопке
<button disabled={loading}>
  {loading ? <ButtonLoader /> : 'Сохранить'}
</button>
```

#### Пустые состояния

```typescript
import { EmptyState } from '@/components/LoadingStates'
import { FileText } from 'lucide-react'

<EmptyState
  icon={<FileText className="h-12 w-12 text-gray-400" />}
  title="Нет документов"
  description="Загрузите первый документ для начала работы"
  action={
    <button className="btn-primary">
      Загрузить документ
    </button>
  }
/>
```

#### Прогресс-бар

```typescript
import { ProgressBar } from '@/components/LoadingStates'

<ProgressBar
  progress={75}
  label="Загрузка файлов"
  color="blue"
  showPercentage={true}
/>
```

#### Badge

```typescript
import { Badge } from '@/components/LoadingStates'

<Badge variant="success">Активен</Badge>
<Badge variant="error">Ошибка</Badge>
<Badge variant="warning" size="sm">3</Badge>
```

#### Tooltip

```typescript
import { Tooltip } from '@/components/LoadingStates'

<Tooltip content="Это подсказка" position="top">
  <button>Наведи на меня</button>
</Tooltip>
```

---

## 🎯 Примеры использования

### Пример 1: Оптимизация поиска

```typescript
import { useState, useEffect } from 'react'
import { useDebounce, searchInArray } from '@/utils/performance'
import { Spinner } from '@/components/LoadingStates'

function UserSearch({ users }) {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(search, 300)
  
  const results = searchInArray(users, debouncedSearch, ['name', 'email'])
  
  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск..."
      />
      {loading && <Spinner size="sm" />}
      <div>{results.length} результатов</div>
    </div>
  )
}
```

### Пример 2: Список с загрузкой

```typescript
import { ListSkeleton, EmptyState } from '@/components/LoadingStates'
import { Users } from 'lucide-react'

function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  
  if (loading) {
    return <ListSkeleton items={5} />
  }
  
  if (users.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12 text-gray-400" />}
        title="Нет пользователей"
        description="Добавьте первого пользователя"
      />
    )
  }
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  )
}
```

### Пример 3: Таблица с пагинацией

```typescript
import { useState, useMemo } from 'react'
import { paginateArray, getPaginationInfo } from '@/utils/performance'
import { TableSkeleton } from '@/components/LoadingStates'

function PaginatedTable({ data, loading }) {
  const [page, setPage] = useState(1)
  const pageSize = 10
  
  const paginatedData = useMemo(
    () => paginateArray(data, page, pageSize),
    [data, page]
  )
  
  const pagination = getPaginationInfo(data.length, page, pageSize)
  
  if (loading) {
    return <TableSkeleton rows={10} columns={5} />
  }
  
  return (
    <div>
      <table>
        {/* Таблица с paginatedData */}
      </table>
      
      <div className="flex justify-between items-center mt-4">
        <span>
          Показано {pagination.start}-{pagination.end} из {pagination.totalItems}
        </span>
        <div className="space-x-2">
          <button
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage(p => p - 1)}
          >
            Назад
          </button>
          <button
            disabled={!pagination.hasNextPage}
            onClick={() => setPage(p => p + 1)}
          >
            Вперед
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Пример 4: Кнопка с загрузкой

```typescript
import { useState } from 'react'
import { ButtonLoader } from '@/components/LoadingStates'
import { useNotification } from '@/components/NotificationService'

function SaveButton({ onSave }) {
  const [saving, setSaving] = useState(false)
  const { success, error } = useNotification()
  
  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave()
      success('Данные сохранены!')
    } catch (e) {
      error('Ошибка при сохранении')
    } finally {
      setSaving(false)
    }
  }
  
  return (
    <button
      onClick={handleSave}
      disabled={saving}
      className="btn-primary"
    >
      {saving ? (
        <>
          <ButtonLoader />
          <span className="ml-2">Сохранение...</span>
        </>
      ) : (
        'Сохранить'
      )}
    </button>
  )
}
```

---

## 🚀 Best Practices

### 1. Используйте debounce для поиска и фильтрации

```typescript
// ❌ Плохо - выполняется при каждом нажатии клавиши
<input onChange={(e) => performSearch(e.target.value)} />

// ✅ Хорошо - выполняется через 300мс после последнего изменения
const debouncedSearch = useDebounce(search, 300)
useEffect(() => performSearch(debouncedSearch), [debouncedSearch])
```

### 2. Мемоизируйте дорогие вычисления

```typescript
// ❌ Плохо - пересчитывается каждый рендер
const filtered = data.filter(...)

// ✅ Хорошо - пересчитывается только при изменении data или filters
const filtered = useMemo(
  () => data.filter(...),
  [data, filters]
)
```

### 3. Показывайте скелетоны вместо спиннеров

```typescript
// ❌ Плохо - пустой экран со спиннером
if (loading) return <Spinner />

// ✅ Хорошо - скелетон показывает структуру данных
if (loading) return <TableSkeleton />
```

### 4. Обрабатывайте пустые состояния

```typescript
// ❌ Плохо - пустой экран
if (items.length === 0) return null

// ✅ Хорошо - понятное сообщение и действие
if (items.length === 0) {
  return (
    <EmptyState
      title="Нет элементов"
      action={<button>Добавить</button>}
    />
  )
}
```

### 5. Используйте пагинацию для больших списков

```typescript
// ❌ Плохо - рендерим все 1000 элементов
items.map(item => <ItemCard key={item.id} {...item} />)

// ✅ Хорошо - рендерим только 10 на странице
const paged = paginateArray(items, page, 10)
paged.map(item => <ItemCard key={item.id} {...item} />)
```

---

## ⚡ Производительность

### Измерение производительности

```typescript
import { measurePerformance } from '@/utils/performance'

const expensiveCalculation = measurePerformance(
  (data) => {
    // Дорогая операция
    return data.map(...).filter(...).reduce(...)
  },
  'Expensive Calculation'
)

// В консоли: [Performance] Expensive Calculation: 123.45ms
```

### Оптимизация рендеринга

```typescript
import { memo, useMemo, useCallback } from 'react'

// Мемоизация компонента
const MemoizedCard = memo(Card)

// Мемоизация вычислений
const sortedData = useMemo(
  () => sortByKey(data, 'name'),
  [data]
)

// Мемоизация коллбэков
const handleClick = useCallback(
  () => onItemClick(item.id),
  [item.id, onItemClick]
)
```

---

## 📊 Метрики

После внедрения этих утилит:

- ✅ Поиск работает без задержек (debounce)
- ✅ Пользователь видит скелетоны вместо пустых экранов
- ✅ Большие списки не тормозят (пагинация)
- ✅ Улучшенный UX с loading states
- ✅ Понятные пустые состояния с действиями

---

## 🎓 Дополнительные ресурсы

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [useMemo vs useCallback](https://react.dev/reference/react/useMemo)
- [Debouncing and Throttling](https://css-tricks.com/debouncing-throttling-explained-examples/)

