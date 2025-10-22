// ============= ВАЛИДАЦИЯ ДАННЫХ =============

export interface ValidationResult {
  isValid: boolean
  error?: string
}

// ============= EMAIL =============

export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email обязателен' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Введите корректный email' }
  }

  return { isValid: true }
}

// ============= ТЕЛЕФОН =============

export function validatePhone(phone: string, required: boolean = true): ValidationResult {
  if (!phone || phone.trim() === '') {
    if (required) {
      return { isValid: false, error: 'Телефон обязателен' }
    }
    return { isValid: true }
  }

  // Удаляем все кроме цифр и +
  const cleaned = phone.replace(/[^\d+]/g, '')
  
  // Проверяем формат: должно быть 11-12 цифр (с +7 или без)
  if (cleaned.length < 11 || cleaned.length > 12) {
    return { isValid: false, error: 'Введите корректный номер телефона (11 цифр)' }
  }

  // Проверяем, что начинается с +7 или 8 или 7
  if (!cleaned.startsWith('+7') && !cleaned.startsWith('8') && !cleaned.startsWith('7')) {
    return { isValid: false, error: 'Номер должен начинаться с +7, 8 или 7' }
  }

  return { isValid: true }
}

/**
 * Форматирует телефон в единый формат +7 (XXX) XXX-XX-XX
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[^\d]/g, '')
  
  // Убираем первую 8 или 7, оставляем только последние 10 цифр
  const digits = cleaned.startsWith('8') || cleaned.startsWith('7') 
    ? cleaned.slice(1) 
    : cleaned
  
  if (digits.length !== 10) return phone // Возвращаем как есть если не 10 цифр
  
  return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`
}

// ============= ИМЯ / ТЕКСТ =============

export function validateName(name: string, fieldName: string = 'Имя'): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} обязательно` }
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} должно содержать минимум 2 символа` }
  }

  if (name.length > 100) {
    return { isValid: false, error: `${fieldName} не может быть длиннее 100 символов` }
  }

  return { isValid: true }
}

export function validateText(text: string, fieldName: string = 'Поле', minLength: number = 1, maxLength: number = 1000): ValidationResult {
  if (!text || text.trim() === '') {
    return { isValid: false, error: `${fieldName} обязательно` }
  }

  if (text.trim().length < minLength) {
    return { isValid: false, error: `${fieldName} должно содержать минимум ${minLength} символов` }
  }

  if (text.length > maxLength) {
    return { isValid: false, error: `${fieldName} не может быть длиннее ${maxLength} символов` }
  }

  return { isValid: true }
}

// ============= АДРЕС =============

export function validateAddress(address: string): ValidationResult {
  if (!address || address.trim() === '') {
    return { isValid: false, error: 'Адрес обязателен' }
  }

  if (address.trim().length < 5) {
    return { isValid: false, error: 'Адрес должен содержать минимум 5 символов' }
  }

  if (address.length > 200) {
    return { isValid: false, error: 'Адрес не может быть длиннее 200 символов' }
  }

  return { isValid: true }
}

// ============= ЧИСЛА =============

export function validateNumber(value: number | string, min?: number, max?: number, fieldName: string = 'Значение'): ValidationResult {
  const num = typeof value === 'string' ? parseFloat(value) : value

  if (isNaN(num)) {
    return { isValid: false, error: `${fieldName} должно быть числом` }
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} не может быть меньше ${min}` }
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} не может быть больше ${max}` }
  }

  return { isValid: true }
}

export function validatePositiveInteger(value: number | string, fieldName: string = 'Значение'): ValidationResult {
  const num = typeof value === 'string' ? parseInt(value, 10) : value

  if (isNaN(num) || !Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} должно быть целым числом` }
  }

  if (num < 1) {
    return { isValid: false, error: `${fieldName} должно быть положительным числом` }
  }

  return { isValid: true }
}

// ============= ДАТЫ =============

export function validateDate(dateStr: string, fieldName: string = 'Дата'): ValidationResult {
  if (!dateStr || dateStr.trim() === '') {
    return { isValid: false, error: `${fieldName} обязательна` }
  }

  const date = new Date(dateStr)
  if (isNaN(date.getTime())) {
    return { isValid: false, error: `${fieldName} имеет некорректный формат` }
  }

  return { isValid: true }
}

export function validateDateRange(startDate: string, endDate: string): ValidationResult {
  const startValidation = validateDate(startDate, 'Дата начала')
  if (!startValidation.isValid) return startValidation

  const endValidation = validateDate(endDate, 'Дата окончания')
  if (!endValidation.isValid) return endValidation

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start >= end) {
    return { isValid: false, error: 'Дата окончания должна быть позже даты начала' }
  }

  return { isValid: true }
}

export function validateFutureDate(dateStr: string, fieldName: string = 'Дата'): ValidationResult {
  const dateValidation = validateDate(dateStr, fieldName)
  if (!dateValidation.isValid) return dateValidation

  const date = new Date(dateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0) // Сбрасываем время для сравнения только дат

  if (date < now) {
    return { isValid: false, error: `${fieldName} должна быть в будущем` }
  }

  return { isValid: true }
}

// ============= SANITIZATION =============

/**
 * Удаляет потенциально опасные символы из строки
 */
export function sanitizeString(input: string): string {
  if (!input) return ''
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Удаляем <script> теги
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Удаляем <iframe> теги
    .replace(/javascript:/gi, '') // Удаляем javascript: протокол
    .replace(/on\w+\s*=/gi, '') // Удаляем event handlers (onclick, onload, etc.)
    .trim()
}

/**
 * Санитизация для Excel данных
 */
export function sanitizeExcelCell(value: any): string {
  if (value === null || value === undefined) return ''
  
  const str = String(value).trim()
  
  // Удаляем формулы Excel (начинающиеся с =, +, -, @)
  if (str.length > 0 && ['=', '+', '-', '@'].includes(str[0])) {
    return "'" + str // Добавляем апостроф чтобы Excel не интерпретировал как формулу
  }
  
  return sanitizeString(str)
}

// ============= КОМПЛЕКСНАЯ ВАЛИДАЦИЯ =============

export interface LeadValidation {
  address: ValidationResult
  city: ValidationResult
  contactPerson: ValidationResult
  contactPhone: ValidationResult
  contactEmail?: ValidationResult
}

export function validateLead(data: {
  address: string
  city: string
  contactPerson: string
  contactPhone: string
  contactEmail?: string
}): LeadValidation {
  return {
    address: validateAddress(data.address),
    city: validateName(data.city, 'Город'),
    contactPerson: validateName(data.contactPerson, 'Контактное лицо'),
    contactPhone: validatePhone(data.contactPhone),
    contactEmail: data.contactEmail ? validateEmail(data.contactEmail) : undefined
  }
}

export function isLeadValid(validation: LeadValidation): boolean {
  return validation.address.isValid &&
         validation.city.isValid &&
         validation.contactPerson.isValid &&
         validation.contactPhone.isValid &&
         (validation.contactEmail ? validation.contactEmail.isValid : true)
}

export interface UserValidation {
  name: ValidationResult
  email: ValidationResult
  phone?: ValidationResult
  telegram?: ValidationResult
}

export function validateUser(data: {
  name: string
  email: string
  phone?: string
  telegram?: string
}): UserValidation {
  return {
    name: validateName(data.name, 'Имя пользователя'),
    email: validateEmail(data.email),
    phone: data.phone ? validatePhone(data.phone, false) : undefined,
    telegram: data.telegram ? validateText(data.telegram, 'Telegram username', 1, 50) : undefined
  }
}

export function isUserValid(validation: UserValidation): boolean {
  return validation.name.isValid &&
         validation.email.isValid &&
         (validation.phone ? validation.phone.isValid : true) &&
         (validation.telegram ? validation.telegram.isValid : true)
}

export interface ApartmentValidation {
  number: ValidationResult
  ownerName: ValidationResult
  area: ValidationResult
  phone?: ValidationResult
  email?: ValidationResult
}

export function validateApartment(data: {
  number: string
  ownerName: string
  area: number | string
  phone?: string
  email?: string
}): ApartmentValidation {
  return {
    number: validateText(data.number, 'Номер квартиры', 1, 10),
    ownerName: validateName(data.ownerName, 'Имя собственника'),
    area: validateNumber(data.area, 0.1, 10000, 'Площадь'),
    phone: data.phone ? validatePhone(data.phone, false) : undefined,
    email: data.email ? validateEmail(data.email) : undefined
  }
}

export function isApartmentValid(validation: ApartmentValidation): boolean {
  return validation.number.isValid &&
         validation.ownerName.isValid &&
         validation.area.isValid &&
         (validation.phone ? validation.phone.isValid : true) &&
         (validation.email ? validation.email.isValid : true)
}

export interface VotingValidation {
  address: ValidationResult
  apartmentsCount?: ValidationResult
  votingStartDate?: ValidationResult
  votingEndDate?: ValidationResult
  dateRange?: ValidationResult
}

export function validateVoting(data: {
  address: string
  apartmentsCount?: number | string
  votingStartDate?: string
  votingEndDate?: string
}): VotingValidation {
  const validation: VotingValidation = {
    address: validateAddress(data.address),
    apartmentsCount: data.apartmentsCount 
      ? validatePositiveInteger(data.apartmentsCount, 'Количество квартир')
      : undefined,
    votingStartDate: data.votingStartDate 
      ? validateDate(data.votingStartDate, 'Дата начала голосования')
      : undefined,
    votingEndDate: data.votingEndDate 
      ? validateDate(data.votingEndDate, 'Дата окончания голосования')
      : undefined
  }

  // Проверяем диапазон дат если обе даты указаны
  if (data.votingStartDate && data.votingEndDate) {
    validation.dateRange = validateDateRange(data.votingStartDate, data.votingEndDate)
  }

  return validation
}

export function isVotingValid(validation: VotingValidation): boolean {
  return validation.address.isValid &&
         (validation.apartmentsCount ? validation.apartmentsCount.isValid : true) &&
         (validation.votingStartDate ? validation.votingStartDate.isValid : true) &&
         (validation.votingEndDate ? validation.votingEndDate.isValid : true) &&
         (validation.dateRange ? validation.dateRange.isValid : true)
}

export interface TaskValidation {
  title: ValidationResult
  dueDate?: ValidationResult
  assignedTo: ValidationResult
}

export function validateTask(data: {
  title: string
  dueDate?: string
  assignedTo: string[]
}): TaskValidation {
  return {
    title: validateText(data.title, 'Название задачи', 3, 200),
    dueDate: data.dueDate ? validateFutureDate(data.dueDate, 'Срок выполнения') : undefined,
    assignedTo: data.assignedTo.length > 0 
      ? { isValid: true }
      : { isValid: false, error: 'Необходимо назначить исполнителя' }
  }
}

export function isTaskValid(validation: TaskValidation): boolean {
  return validation.title.isValid &&
         (validation.dueDate ? validation.dueDate.isValid : true) &&
         validation.assignedTo.isValid
}

export interface DocumentValidation {
  name: ValidationResult
  size: ValidationResult
  type: ValidationResult
}

export function validateDocument(data: {
  name: string
  size: number
  type: string
}): DocumentValidation {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  return {
    name: validateText(data.name, 'Название файла', 1, 255),
    size: data.size > maxSize
      ? { isValid: false, error: 'Размер файла не может превышать 10MB' }
      : { isValid: true },
    type: allowedTypes.includes(data.type)
      ? { isValid: true }
      : { isValid: false, error: 'Недопустимый тип файла. Разрешены: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX' }
  }
}

export function isDocumentValid(validation: DocumentValidation): boolean {
  return validation.name.isValid &&
         validation.size.isValid &&
         validation.type.isValid
}

// ============= УТИЛИТЫ =============

/**
 * Проверяет уникальность значения в массиве
 */
export function isUnique<T>(arr: T[], value: T, currentIndex?: number): boolean {
  const index = arr.indexOf(value)
  if (index === -1) return true
  if (currentIndex !== undefined && index === currentIndex) return true
  return false
}

/**
 * Проверяет уникальность email в списке пользователей
 */
export function isEmailUnique(users: Array<{ id: string; email: string }>, email: string, currentUserId?: string): boolean {
  return !users.some(u => u.email === email && u.id !== currentUserId)
}

/**
 * Получает все ошибки валидации из объекта результатов
 */
export function getValidationErrors(validation: Record<string, ValidationResult | undefined>): string[] {
  return Object.values(validation)
    .filter((v): v is ValidationResult => v !== undefined && !v.isValid)
    .map(v => v.error!)
    .filter(Boolean)
}

/**
 * Получает первую ошибку валидации
 */
export function getFirstValidationError(validation: Record<string, ValidationResult | undefined>): string | null {
  const errors = getValidationErrors(validation)
  return errors.length > 0 ? errors[0] : null
}

