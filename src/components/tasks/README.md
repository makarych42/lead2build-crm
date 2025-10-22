# Модуль управления задачами (Tasks Module)

## Структура

Компонент TaskManagement (1208 строк) разбит на модульную архитектуру.

### Файлы

```
src/components/tasks/
├── types.ts                  # Типы и интерфейсы
├── constants.ts              # Константы (labels, роли)
├── utils.ts                  # Утилиты (фильтрация, сортировка, валидация)
├── TaskStats.tsx             # Статистика по задачам
├── TaskCard.tsx              # Карточка задачи
├── TaskFilters.tsx           # Панель фильтров
├── TaskList.tsx              # Список задач с группировкой
├── CreateTaskModal.tsx       # Форма создания/редактирования
└── index.tsx                 # Главный компонент
```

## Компоненты

### TaskStats
**Размер**: ~120 строк  
**Ответственность**: Отображение статистики задач

**Метрики**:
- Всего задач / Мои задачи
- Ожидающие
- Завершенные (с процентом выполнения)
- Просроченные (по приоритетам)

### TaskCard
**Размер**: ~140 строк  
**Ответственность**: Отображение карточки задачи

**Функции**:
- Отображение всех данных задачи
- Иконки приоритета и статуса
- Аватары исполнителей
- Quick actions (Начать, Завершить, Отменить)

### TaskFilters
**Размер**: ~150 строк  
**Ответственность**: Фильтрация и поиск задач

**Фильтры**:
- Поиск по названию/описанию
- Статус
- Приоритет
- Исполнитель
- Тип задачи

### TaskList
**Размер**: ~200 строк  
**Ответственность**: Отображение списка задач с группировкой

**Функции**:
- Группировка (статус/приоритет/исполнитель/тип)
- Сортировка
- Expandable группы
- Grid/List view

### CreateTaskModal
**Размер**: ~250 строк  
**Ответственность**: Создание и редактирование задачи

**Поля**:
- Название и описание
- Тип задачи
- Исполнители (множественный выбор)
- Приоритет
- Срок выполнения
- Привязка к лиду/голосованию
- Примечания

### index.tsx
**Размер**: ~200 строк  
**Ответственность**: Координация всех компонентов

**Функции**:
- Управление состоянием (tasks, users, filters)
- CRUD операции
- Автоматическое обновление просроченных
- Интеграция компонентов

## Утилиты

### utils.ts

```typescript
// Цвета и стили
- getStatusColor(status)
- getPriorityColor(priority)
- getPriorityIcon(priority)

// Работа с датами
- formatDate(dateString)
- formatDateTime(dateString)
- getRelativeTime(dateString)

// Проверки
- isTaskOverdue(task)
- updateOverdueTasks(tasks)

// Фильтрация и сортировка
- filterTasks(tasks, filters)
- sortTasks(tasks, sortBy, order)
- groupTasks(tasks, groupBy)

// Валидация
- validateTaskData(data)
```

## Константы

### constants.ts

- `TASK_TYPE_LABELS` - названия типов задач
- `ROLE_LABELS` - названия ролей
- `STATUS_LABELS` - названия статусов
- `PRIORITY_LABELS` - названия приоритетов

## Использование

```typescript
import TaskManagement from '@/components/tasks'

// В компоненте
<TaskManagement />
```

## API

### Props главного компонента

```typescript
interface TaskManagementProps {
  // Нет внешних props - self-contained
}
```

### Хуки и утилиты

```typescript
// Импорт утилит
import { 
  filterTasks, 
  sortTasks, 
  groupTasks,
  validateTaskData
} from '@/components/tasks/utils'

// Импорт констант
import { 
  TASK_TYPE_LABELS,
  ROLE_LABELS 
} from '@/components/tasks/constants'
```

## Преимущества разбиения

### До
- ❌ 1 файл 1208 строк
- ❌ Все перемешано
- ❌ Сложно найти код
- ❌ Невозможно тестировать

### После
- ✅ 9 файлов по 100-300 строк
- ✅ Четкая структура
- ✅ Легко найти код
- ✅ Легко тестировать
- ✅ Переиспользуемые компоненты

## Интеграция

Модуль полностью самодостаточный, использует:
- `useLocalStorage` для персистентности
- `@/types` для общих типов
- `@/components/LoadingStates` для UI
- `@/components/NotificationService` для уведомлений

## Прогресс

- [x] Типы
- [x] Константы
- [x] Утилиты
- [x] TaskStats
- [x] TaskCard
- [ ] TaskFilters
- [ ] TaskList
- [ ] CreateTaskModal
- [ ] index.tsx
- [ ] Тестирование

