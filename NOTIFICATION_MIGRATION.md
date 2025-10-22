# 🔔 Миграция на NotificationService
## Замена alert() на Toast-уведомления
### 21 октября 2025, Шаг 44

---

## ✅ СТАТУС: NotificationService уже существует

NotificationService был создан ранее и уже интегрирован в `src/app/layout.tsx` через `NotificationProvider`.

**Файл**: `src/components/NotificationService.tsx` (274 строки)

### Возможности:
- ✅ Toast-уведомления (success, error, warning, info)
- ✅ Confirmation диалоги
- ✅ Автоматическое скрытие через duration
- ✅ Анимации (slide-in, fade-out)
- ✅ Стек уведомлений (до 5 одновременно)
- ✅ TypeScript support
- ✅ Context API для глобального доступа

---

## 🔄 ПРОГРЕСС МИГРАЦИИ

### Использование alert() в проекте:

**Всего найдено**: 19 использований в 8 файлах

**По файлам**:
| Файл | Кол-во | Статус |
|------|--------|--------|
| NewLeadForm.tsx | 2 | ✅ Мигрировано |
| LeadsList.tsx | 4 | ✅ Мигрировано |
| TelegramIntegration.tsx | 5 | ⏳ Не мигрировано |
| UserManagement.tsx | 5 | ⏳ Не мигрировано |
| DocumentManager.tsx | 3 | ⏳ Не мигрировано |
| TelegramAutomation.tsx | 2 | ⏳ Не мигрировано |
| SystemSettings.tsx | 1 | ⏳ Не мигрировано |
| NotificationSettings.tsx | 1 | ⏳ Не мигрировано |
| CompanySettings.tsx | 1 | ⏳ Не мигрировано |
| TaskManagement.old.tsx | 1 | ⚠️ Старый файл (игнорировать) |

**Итого**:
- ✅ **Мигрировано**: 6/19 (32%)
- ⏳ **Осталось**: 13/19 (68%)

---

## ✅ МИГРИРОВАННЫЕ КОМПОНЕНТЫ

### 1. NewLeadForm.tsx

**Было**:
```typescript
alert('Лид успешно создан! Автоматически созданы задачи и отправлены Telegram уведомления.')
alert('Ошибка при создании лида')
```

**Стало**:
```typescript
import { useNotification } from './NotificationService'

const { success, error } = useNotification()

success('Лид успешно создан! Автоматически созданы задачи и отправлены Telegram уведомления.')
error('Ошибка при создании лида')
```

**Изменения**:
- Добавлен импорт `useNotification`
- Переименован `error` в `err` в catch блоке (чтобы не конфликтовать с функцией)
- Заменены 2 вызова `alert()`

---

### 2. LeadsList.tsx

**Было**:
```typescript
alert('Лид успешно обновлён')
alert('Ошибка при обновлении лида')
alert('Лид успешно удален')
alert('Ошибка при удалении лида')
```

**Стало**:
```typescript
import { useNotification } from './NotificationService'

const { success, error: showError } = useNotification()

success('Лид успешно обновлён')
showError('Ошибка при обновлении лида')
success('Лид успешно удален')
showError('Ошибка при удалении лида')
```

**Изменения**:
- Добавлен импорт `useNotification`
- `error` переименован в `showError` (чтобы не конфликтовать с переменными)
- Заменены 4 вызова `alert()`

---

## ⏭️ СЛЕДУЮЩИЕ КОМПОНЕНТЫ ДЛЯ МИГРАЦИИ

### Приоритет 1: Часто используемые компоненты

#### 1. TelegramIntegration.tsx (5 alert)
```typescript
// Примеры использования:
alert('Успешно подключено!')
alert('Не указан Bot Token')
alert(`Ошибка при подключении: ${error.message}`)
alert('Пользователь успешно удален')
alert('Уведомление отправлено успешно')
```

#### 2. UserManagement.tsx (5 alert)
```typescript
// Примеры использования:
alert('Пожалуйста, заполните все обязательные поля')
alert('Некорректный формат email')
alert('Пользователь успешно создан!')
alert('Пользователь успешно обновлен!')
alert('Пользователь успешно удален!')
```

#### 3. DocumentManager.tsx (3 alert)
```typescript
// Примеры использования:
alert('Документ успешно добавлен!')
alert('Документ успешно удален!')
alert('Ошибка при загрузке документа')
```

---

### Приоритет 2: Settings компоненты

#### 4. TelegramAutomation.tsx (2 alert)
#### 5. SystemSettings.tsx (1 alert)
#### 6. NotificationSettings.tsx (1 alert)
#### 7. CompanySettings.tsx (1 alert)

---

## 📝 ШАБЛОН МИГРАЦИИ

### Шаг 1: Импорт
```typescript
import { useNotification } from './NotificationService'
// или если в подпапке:
import { useNotification } from '../NotificationService'
```

### Шаг 2: Использование хука
```typescript
export default function MyComponent() {
  const { success, error, warning, info, confirm } = useNotification()
  
  // ...
}
```

### Шаг 3: Замена alert()
```typescript
// ❌ Было:
alert('Операция выполнена успешно')
alert('Произошла ошибка')

// ✅ Стало:
success('Операция выполнена успешно')
error('Произошла ошибка')
```

### Шаг 4: Замена confirm()
```typescript
// ❌ Было:
if (confirm('Вы уверены?')) {
  deleteItem()
}

// ✅ Стало:
confirm('Вы уверены?', () => {
  deleteItem()
})
```

### Шаг 5: Переименование переменных (если нужно)
```typescript
// Если в catch блоке переменная называется 'error':
catch (error) {  // ❌ Конфликт с функцией error()
  console.error(error)
  error('Ошибка')  // ❌ Не сработает
}

// Решение 1: Переименовать параметр
catch (err) {  // ✅
  console.error(err)
  error('Ошибка')  // ✅
}

// Решение 2: Переименовать функцию
const { error: showError } = useNotification()
catch (error) {
  console.error(error)
  showError('Ошибка')  // ✅
}
```

---

## 🎨 Типы уведомлений

### 1. Success (зеленый)
```typescript
success('Операция выполнена успешно')
success('Данные сохранены', 3000) // 3 секунды
```

### 2. Error (красный)
```typescript
error('Произошла ошибка')
error('Не удалось загрузить данные', 5000) // 5 секунд
```

### 3. Warning (желтый)
```typescript
warning('Внимание! Проверьте введенные данные')
warning('Файл слишком большой', 4000)
```

### 4. Info (синий)
```typescript
info('Обновление доступно')
info('Система будет недоступна с 00:00 до 02:00')
```

### 5. Confirm Dialog
```typescript
confirm(
  'Вы уверены, что хотите удалить этот элемент?',
  () => {
    // onConfirm callback
    deleteItem()
  },
  () => {
    // onCancel callback (опционально)
    console.log('Отменено')
  }
)
```

---

## 🔧 Дополнительные возможности

### Кастомная продолжительность
```typescript
success('Быстрое уведомление', 1000)  // 1 секунда
error('Долгое уведомление', 10000)    // 10 секунд
```

### Программное удаление
```typescript
const { removeNotification, notifications } = useNotification()

// Удалить конкретное уведомление
removeNotification(notificationId)
```

### Общая функция
```typescript
const { showNotification } = useNotification()

showNotification('Сообщение', 'success', 3000)
showNotification('Ошибка', 'error')
showNotification('Предупреждение', 'warning', 4000)
showNotification('Информация', 'info')
```

---

## 📊 Преимущества миграции

### До (alert):
- ❌ Блокирует UI
- ❌ Нельзя кастомизировать
- ❌ Нет анимаций
- ❌ Один alert за раз
- ❌ Устаревший UX

### После (Toast):
- ✅ Не блокирует UI
- ✅ Красивый дизайн с иконками
- ✅ Плавные анимации
- ✅ Несколько уведомлений одновременно
- ✅ Автоматическое скрытие
- ✅ Современный UX

---

## 🎯 План действий

### Этап 1: Критичные компоненты (Сегодня)
- [x] NewLeadForm.tsx
- [x] LeadsList.tsx
- [ ] UserManagement.tsx
- [ ] TelegramIntegration.tsx

### Этап 2: Остальные компоненты (Скоро)
- [ ] DocumentManager.tsx
- [ ] TelegramAutomation.tsx
- [ ] SystemSettings.tsx
- [ ] NotificationSettings.tsx
- [ ] CompanySettings.tsx

### Этап 3: Проверка
- [ ] Убедиться, что все alert() заменены
- [ ] Проверить работу уведомлений
- [ ] Тестировать edge cases

---

## 🐛 Известные проблемы

**Отсутствуют** ✅

---

## 📈 Прогресс

```
████████░░░░░░░░░░░░ 32% (6/19)
```

**Цель**: 100% замена alert() на toast-уведомления

---

**Создано**: 21 октября 2025, Шаг 44  
**Обновлено**: 21 октября 2025  
**Статус**: 🔄 В процессе (32% завершено)  
**Следующее**: Миграция UserManagement и TelegramIntegration

