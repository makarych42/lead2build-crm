# Модуль голосований (Voting Module)

## Структура компонентов

Компонент VotingManager (1952 строки) разбит на подкомпоненты для лучшей поддерживаемости.

### Файлы

```
src/components/voting/
├── types.ts                    # Типы для модуля
├── VotingStats.tsx            # ✅ Статистика голосований
├── VotingTable.tsx            # 🔄 Таблица голосований
├── VotingForm.tsx             # Форма создания/редактирования
├── LeadSelectionModal.tsx     # Модальное окно выбора лида
├── ApartmentTable.tsx         # Таблица квартир
├── ApartmentForm.tsx          # Форма квартиры
├── ExcelImport.tsx            # Импорт/экспорт Excel
├── utils.ts                   # Утилиты (расчет прогресса и т.д.)
├── hooks.ts                   # Кастомные хуки
└── index.tsx                  # Главный компонент VotingManager
```

### Компоненты

#### ✅ VotingStats
**Размер**: ~120 строк  
**Ответственность**: Отображение статистики голосований  
**Props**: `{ votings: Voting[] }`

Показывает:
- Общее количество голосований
- Количество по статусам
- Процент успеха
- Средний прогресс

#### 🔄 VotingTable (в разработке)
**Размер**: ~300 строк  
**Ответственность**: Таблица голосований с inline редактированием  
**Props**: `{ votings, onUpdate, onDelete, onToggleExpand }`

Функции:
- Отображение списка голосований
- Inline редактирование полей
- Сортировка и фильтрация
- Управление статусами
- Раскрытие деталей квартир

#### VotingForm
**Размер**: ~200 строк  
**Ответственность**: Форма создания голосования  
**Props**: `{ lead, onSubmit, onCancel }`

Функции:
- Выбор формы голосования
- Установка дат начала/окончания
- Настройка параметров

#### LeadSelectionModal
**Размер**: ~150 строк  
**Ответственность**: Выбор лида для создания голосования  
**Props**: `{ leads, onSelect, onCancel }`

Функции:
- Отображение доступных лидов
- Поиск и фильтрация
- Выбор лида

#### ApartmentTable
**Размер**: ~300 строк  
**Ответственность**: Таблица квартир в голосовании  
**Props**: `{ apartments, votingId, onUpdate, onDelete }`

Функции:
- Отображение квартир
- Inline редактирование
- Управление статусами голосования
- Расчет прогресса

#### ApartmentForm
**Размер**: ~150 строк  
**Ответственность**: Форма добавления/редактирования квартиры  
**Props**: `{ apartment, onSubmit, onCancel }`

#### ExcelImport
**Размер**: ~200 строк  
**Ответственность**: Импорт/экспорт данных квартир  
**Props**: `{ votingId, apartments, onImport }`

Функции:
- Скачивание шаблона Excel
- Загрузка данных из Excel
- Валидация данных
- Массовое создание квартир

### Утилиты (utils.ts)

```typescript
- calculateVotingProgress(apartments) - расчет прогресса голосования
- formatVotingStatus(status) - форматирование статуса
- getStatusColor(status) - цвет для статуса
- validateVotingData(data) - валидация данных
- exportToExcel(apartments) - экспорт в Excel
- parseExcelData(file) - парсинг Excel файла
```

### Хуки (hooks.ts)

```typescript
- useVotings() - управление голосованиями
- useApartments(votingId) - управление квартирами
- useVotingForm() - логика формы голосования
- useExcelImport() - логика импорта Excel
```

## Преимущества разбиения

### До
- ❌ 1 файл 1952 строки
- ❌ Сложно найти нужный код
- ❌ Трудно тестировать
- ❌ Все в одном useState

### После
- ✅ 10 файлов по 100-300 строк
- ✅ Четкое разделение ответственности
- ✅ Легко тестировать
- ✅ Переиспользуемые компоненты
- ✅ Изолированная логика

## Миграция

Старый код:
```typescript
import VotingManager from '@/components/VotingManager'
```

Новый код:
```typescript
import VotingManager from '@/components/voting'
```

API остается тем же - компонент работает идентично.

## Прогресс

- [x] Создана структура
- [x] Вынесены типы
- [x] VotingStats - готов
- [ ] VotingTable - в разработке
- [ ] Остальные компоненты
- [ ] Интеграция
- [ ] Тестирование

## Следующие шаги

1. Завершить VotingTable
2. Создать VotingForm и LeadSelectionModal
3. Создать ApartmentTable и ApartmentForm
4. Создать ExcelImport
5. Вынести утилиты и хуки
6. Собрать все в index.tsx
7. Заменить старый VotingManager
8. Протестировать

