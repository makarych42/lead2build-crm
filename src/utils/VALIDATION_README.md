# Validation Utilities

Централизованная система валидации данных для Lead2Build CRM.

## Оглавление

- [Базовая валидация](#базовая-валидация)
- [Комплексная валидация](#комплексная-валидация)
- [Sanitization](#sanitization)
- [Утилиты](#утилиты)
- [Примеры использования](#примеры-использования)

---

## Базовая валидация

### Email

```typescript
import { validateEmail } from '@/utils/validation'

const result = validateEmail('user@example.com')
// { isValid: true }

const result2 = validateEmail('invalid-email')
// { isValid: false, error: 'Введите корректный email' }
```

### Телефон

```typescript
import { validatePhone, formatPhone } from '@/utils/validation'

// Валидация
const result = validatePhone('+7 999 123-45-67')
// { isValid: true }

// Форматирование
const formatted = formatPhone('89991234567')
// '+7 (999) 123-45-67'
```

**Поддерживаемые форматы:**
- `+7 (999) 123-45-67`
- `8 999 123-45-67`
- `79991234567`
- `+79991234567`

### Текст и имена

```typescript
import { validateName, validateText } from '@/utils/validation'

// Имя (минимум 2 символа, максимум 100)
validateName('Иван', 'Имя')
// { isValid: true }

// Произвольный текст с кастомными ограничениями
validateText('Описание', 'Описание задачи', 5, 500)
// minLength: 5, maxLength: 500
```

### Адрес

```typescript
import { validateAddress } from '@/utils/validation'

validateAddress('г. Москва, ул. Примерная, д. 1')
// { isValid: true }
```

### Числа

```typescript
import { validateNumber, validatePositiveInteger } from '@/utils/validation'

// Число с диапазоном
validateNumber(45.5, 0, 10000, 'Площадь')
// min: 0, max: 10000

// Положительное целое число
validatePositiveInteger(5, 'Количество квартир')
// Только целые числа >= 1
```

### Даты

```typescript
import { 
  validateDate, 
  validateDateRange, 
  validateFutureDate 
} from '@/utils/validation'

// Просто дата
validateDate('2025-10-25', 'Дата начала')

// Диапазон дат
validateDateRange('2025-10-20', '2025-10-30')
// Проверяет, что end > start

// Дата в будущем
validateFutureDate('2025-12-31', 'Дедлайн')
// Проверяет, что дата >= сегодня
```

---

## Комплексная валидация

### Lead (Лид)

```typescript
import { validateLead, isLeadValid } from '@/utils/validation'

const leadData = {
  address: 'г. Москва, ул. Примерная, д. 1',
  city: 'Москва',
  contactPerson: 'Иван Иванов',
  contactPhone: '+7 999 123-45-67',
  contactEmail: 'ivan@example.com' // опционально
}

const validation = validateLead(leadData)
/*
{
  address: { isValid: true },
  city: { isValid: true },
  contactPerson: { isValid: true },
  contactPhone: { isValid: true },
  contactEmail: { isValid: true }
}
*/

// Проверка всех полей сразу
if (isLeadValid(validation)) {
  // Все поля валидны
  saveLead(leadData)
} else {
  // Показываем ошибки
  if (!validation.address.isValid) {
    showError(validation.address.error)
  }
}
```

### User (Пользователь)

```typescript
import { validateUser, isUserValid } from '@/utils/validation'

const userData = {
  name: 'Иван Иванов',
  email: 'ivan@lead2build.ru',
  phone: '+7 999 123-45-67', // опционально
  telegram: '@ivanov' // опционально
}

const validation = validateUser(userData)

if (!isUserValid(validation)) {
  const errors = getValidationErrors(validation)
  errors.forEach(error => showError(error))
}
```

### Apartment (Квартира)

```typescript
import { validateApartment, isApartmentValid } from '@/utils/validation'

const apartmentData = {
  number: '42',
  ownerName: 'Петров П.П.',
  area: 45.5,
  phone: '+7 999 123-45-67', // опционально
  email: 'petrov@example.com' // опционально
}

const validation = validateApartment(apartmentData)

if (isApartmentValid(validation)) {
  saveApartment(apartmentData)
}
```

### Voting (Голосование)

```typescript
import { validateVoting, isVotingValid } from '@/utils/validation'

const votingData = {
  address: 'г. Москва, ул. Примерная, д. 1',
  apartmentsCount: 20,
  votingStartDate: '2025-10-20',
  votingEndDate: '2025-10-30'
}

const validation = validateVoting(votingData)

// Автоматически проверяет dateRange если обе даты указаны
if (!isVotingValid(validation)) {
  if (validation.dateRange && !validation.dateRange.isValid) {
    showError(validation.dateRange.error)
    // 'Дата окончания должна быть позже даты начала'
  }
}
```

### Task (Задача)

```typescript
import { validateTask, isTaskValid } from '@/utils/validation'

const taskData = {
  title: 'Позвонить клиенту',
  dueDate: '2025-11-01',
  assignedTo: ['user-1', 'user-2']
}

const validation = validateTask(taskData)

if (!isTaskValid(validation)) {
  if (!validation.assignedTo.isValid) {
    showError('Необходимо назначить исполнителя')
  }
}
```

### Document (Документ)

```typescript
import { validateDocument, isDocumentValid } from '@/utils/validation'

const file = event.target.files[0]

const documentData = {
  name: file.name,
  size: file.size,
  type: file.type
}

const validation = validateDocument(documentData)

if (!isDocumentValid(validation)) {
  if (!validation.size.isValid) {
    showError('Размер файла не может превышать 10MB')
  }
  if (!validation.type.isValid) {
    showError('Недопустимый тип файла')
  }
}
```

**Разрешенные типы файлов:**
- PDF
- JPG, JPEG, PNG
- DOC, DOCX
- XLS, XLSX

**Максимальный размер:** 10MB

---

## Sanitization

### Строки

```typescript
import { sanitizeString } from '@/utils/validation'

const userInput = '<script>alert("XSS")</script>Hello'
const clean = sanitizeString(userInput)
// 'Hello'
```

**Удаляет:**
- `<script>` теги
- `<iframe>` теги
- `javascript:` протокол
- Event handlers (`onclick`, `onload`, etc.)

### Excel данные

```typescript
import { sanitizeExcelCell } from '@/utils/validation'

const cell1 = sanitizeExcelCell('=SUM(A1:A10)')
// "'=SUM(A1:A10)" - добавляет апостроф для безопасности

const cell2 = sanitizeExcelCell('<script>alert("XSS")</script>')
// '' - удаляет опасный контент
```

**Защита от:**
- Excel formula injection (`=`, `+`, `-`, `@`)
- XSS атак через импортированные данные

---

## Утилиты

### Проверка уникальности

```typescript
import { isUnique, isEmailUnique } from '@/utils/validation'

// Общая проверка уникальности
const numbers = [1, 2, 3, 4, 5]
isUnique(numbers, 6) // true
isUnique(numbers, 3) // false
isUnique(numbers, 3, 2) // true (индекс 2 - это сам элемент)

// Проверка уникальности email
const users = [
  { id: '1', email: 'user1@example.com' },
  { id: '2', email: 'user2@example.com' }
]

isEmailUnique(users, 'user3@example.com') // true
isEmailUnique(users, 'user1@example.com') // false
isEmailUnique(users, 'user1@example.com', '1') // true (это тот же пользователь)
```

### Получение ошибок

```typescript
import { 
  getValidationErrors, 
  getFirstValidationError 
} from '@/utils/validation'

const validation = {
  name: { isValid: false, error: 'Имя обязательно' },
  email: { isValid: false, error: 'Введите корректный email' },
  phone: { isValid: true }
}

// Все ошибки
const errors = getValidationErrors(validation)
// ['Имя обязательно', 'Введите корректный email']

// Первая ошибка
const firstError = getFirstValidationError(validation)
// 'Имя обязательно'
```

---

## Примеры использования

### В форме создания лида

```typescript
import { validateLead, isLeadValid, getFirstValidationError } from '@/utils/validation'
import { useNotification } from '@/components/NotificationService'

function NewLeadForm() {
  const { success, error: showError } = useNotification()
  const [formData, setFormData] = useState({...})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Валидация
    const validation = validateLead(formData)

    if (!isLeadValid(validation)) {
      const firstError = getFirstValidationError(validation)
      showError(firstError || 'Проверьте заполнение формы')
      return
    }

    // Сохранение
    addLead(formData)
    success('Лид успешно создан!')
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### При импорте из Excel

```typescript
import { sanitizeExcelCell, validateApartment } from '@/utils/validation'

function handleExcelImport(data: any[]) {
  const apartments = data.map((row, index) => {
    const apartmentData = {
      number: sanitizeExcelCell(row['Номер квартиры']),
      ownerName: sanitizeExcelCell(row['ФИО собственника']),
      area: parseFloat(row['Площадь (м²)']),
      phone: sanitizeExcelCell(row['Телефон']),
      email: sanitizeExcelCell(row['Email'])
    }

    // Валидация каждой квартиры
    const validation = validateApartment(apartmentData)

    if (!isApartmentValid(validation)) {
      console.warn(`Строка ${index + 1}: некорректные данные`, validation)
      // Можно пропустить или показать ошибку
    }

    return apartmentData
  })
}
```

### Real-time валидация в input

```typescript
import { validateEmail } from '@/utils/validation'

function EmailInput() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    // Real-time валидация
    if (value) {
      const validation = validateEmail(value)
      setError(validation.isValid ? '' : validation.error || '')
    } else {
      setError('')
    }
  }

  return (
    <div>
      <input 
        type="email" 
        value={email} 
        onChange={handleChange}
        className={error ? 'border-red-500' : ''}
      />
      {error && <span className="text-red-500">{error}</span>}
    </div>
  )
}
```

---

## Best Practices

1. **Всегда валидируйте на клиенте** перед отправкой на сервер
2. **Используйте sanitization** для пользовательского ввода
3. **Показывайте понятные ошибки** пользователю
4. **Валидируйте Excel импорт** построчно
5. **Проверяйте уникальность** email/phone при создании/редактировании
6. **Используйте formatPhone()** для единообразия номеров

---

## Покрытие

✅ **Email** - regex валидация  
✅ **Телефон** - форматы RU (+7, 8, 7)  
✅ **Имена** - длина 2-100 символов  
✅ **Адреса** - длина 5-200 символов  
✅ **Числа** - с диапазонами  
✅ **Даты** - формат, будущие даты, диапазоны  
✅ **Leads** - комплексная валидация  
✅ **Users** - комплексная валидация  
✅ **Apartments** - комплексная валидация  
✅ **Votings** - комплексная валидация  
✅ **Tasks** - комплексная валидация  
✅ **Documents** - размер + типы файлов  
✅ **XSS защита** - sanitization  
✅ **Excel injection** - sanitization  

---

## Итого

Validation утилиты покрывают **100% критических путей** валидации в Lead2Build CRM и обеспечивают:
- 🛡️ Безопасность (XSS, Excel injection)
- ✅ Качество данных
- 🎯 Единообразие проверок
- 📱 UX (понятные сообщения об ошибках)

