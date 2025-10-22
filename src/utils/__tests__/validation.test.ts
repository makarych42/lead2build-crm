import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePhone,
  formatPhone,
  validateName,
  validateText,
  validateAddress,
  validateNumber,
  validatePositiveInteger,
  validateDate,
  validateDateRange,
  validateFutureDate,
  sanitizeString,
  sanitizeExcelCell,
  validateLead,
  isLeadValid,
  validateUser,
  isUserValid,
  validateApartment,
  isApartmentValid,
  validateVoting,
  isVotingValid,
  validateTask,
  isTaskValid,
  validateDocument,
  isDocumentValid,
  isUnique,
  isEmailUnique,
  getValidationErrors,
  getFirstValidationError
} from '../validation'

describe('Email Validation', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com').isValid).toBe(true)
    expect(validateEmail('user.name@domain.co.uk').isValid).toBe(true)
  })

  it('should reject invalid email', () => {
    expect(validateEmail('').isValid).toBe(false)
    expect(validateEmail('invalid').isValid).toBe(false)
    expect(validateEmail('test@').isValid).toBe(false)
    expect(validateEmail('@example.com').isValid).toBe(false)
  })

  it('should return error message for invalid email', () => {
    const result = validateEmail('')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Email обязателен')
  })
})

describe('Phone Validation', () => {
  it('should validate correct Russian phone numbers', () => {
    expect(validatePhone('+79991234567').isValid).toBe(true)
    expect(validatePhone('89991234567').isValid).toBe(true)
    expect(validatePhone('79991234567').isValid).toBe(true)
  })

  it('should reject invalid phone numbers', () => {
    expect(validatePhone('123').isValid).toBe(false)
    expect(validatePhone('abc').isValid).toBe(false)
  })

  it('should format phone correctly', () => {
    expect(formatPhone('89991234567')).toBe('+7 (999) 123-45-67')
    expect(formatPhone('+79991234567')).toBe('+7 (999) 123-45-67')
    expect(formatPhone('79991234567')).toBe('+7 (999) 123-45-67')
  })

  it('should handle optional phone validation', () => {
    expect(validatePhone('', false).isValid).toBe(true)
    expect(validatePhone('', true).isValid).toBe(false)
  })
})

describe('Name Validation', () => {
  it('should validate correct names', () => {
    expect(validateName('Иван Иванов').isValid).toBe(true)
    expect(validateName('AB').isValid).toBe(true) // минимум 2 символа
  })

  it('should reject too short names', () => {
    const result = validateName('A')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Имя должно содержать минимум 2 символа')
  })

  it('should reject too long names', () => {
    const longName = 'A'.repeat(101)
    expect(validateName(longName).isValid).toBe(false)
  })

  it('should use custom field name in error', () => {
    const result = validateName('', 'Город')
    expect(result.error).toBe('Город обязательно')
  })
})

describe('Number Validation', () => {
  it('should validate numbers within range', () => {
    expect(validateNumber(5, 0, 10).isValid).toBe(true)
    expect(validateNumber('7.5', 0, 10).isValid).toBe(true)
  })

  it('should reject numbers out of range', () => {
    expect(validateNumber(-1, 0, 10).isValid).toBe(false)
    expect(validateNumber(11, 0, 10).isValid).toBe(false)
  })

  it('should reject non-numbers', () => {
    expect(validateNumber('abc' as any).isValid).toBe(false)
  })

  it('should validate positive integers', () => {
    expect(validatePositiveInteger(5).isValid).toBe(true)
    expect(validatePositiveInteger(0).isValid).toBe(false)
    expect(validatePositiveInteger(-5).isValid).toBe(false)
    expect(validatePositiveInteger(5.5).isValid).toBe(false)
  })
})

describe('Date Validation', () => {
  it('should validate correct dates', () => {
    expect(validateDate('2025-10-21').isValid).toBe(true)
    expect(validateDate(new Date().toISOString()).isValid).toBe(true)
  })

  it('should reject invalid dates', () => {
    expect(validateDate('').isValid).toBe(false)
    expect(validateDate('invalid').isValid).toBe(false)
  })

  it('should validate date ranges', () => {
    expect(validateDateRange('2025-10-20', '2025-10-30').isValid).toBe(true)
    expect(validateDateRange('2025-10-30', '2025-10-20').isValid).toBe(false)
  })

  it('should validate future dates', () => {
    const futureDate = new Date(Date.now() + 86400000).toISOString()
    const pastDate = new Date(Date.now() - 86400000).toISOString()
    
    expect(validateFutureDate(futureDate).isValid).toBe(true)
    expect(validateFutureDate(pastDate).isValid).toBe(false)
  })
})

describe('Sanitization', () => {
  it('should remove script tags', () => {
    const dirty = '<script>alert("XSS")</script>Hello'
    expect(sanitizeString(dirty)).toBe('Hello')
  })

  it('should remove iframe tags', () => {
    const dirty = '<iframe src="malicious"></iframe>Content'
    expect(sanitizeString(dirty)).toBe('Content')
  })

  it('should remove javascript: protocol', () => {
    const dirty = 'javascript:alert("XSS")Normal text'
    expect(sanitizeString(dirty)).toBe('alert("XSS")Normal text')
  })

  it('should sanitize Excel cells with formulas', () => {
    expect(sanitizeExcelCell('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)")
    expect(sanitizeExcelCell('+A1+B1')).toBe("'+A1+B1")
    expect(sanitizeExcelCell('-10')).toBe("'-10")
    expect(sanitizeExcelCell('@A1')).toBe("'@A1")
  })

  it('should handle normal Excel values', () => {
    expect(sanitizeExcelCell('Normal text')).toBe('Normal text')
    expect(sanitizeExcelCell(123)).toBe('123')
  })
})

describe('Complex Validation - Lead', () => {
  it('should validate correct lead data', () => {
    const leadData = {
      address: 'ул. Ленина, д. 15',
      city: 'Москва',
      contactPerson: 'Иван Иванов',
      contactPhone: '+79991234567',
      contactEmail: 'ivan@example.com'
    }

    const validation = validateLead(leadData)
    expect(isLeadValid(validation)).toBe(true)
  })

  it('should detect invalid lead data', () => {
    const leadData = {
      address: 'abc', // слишком короткий
      city: 'A', // слишком короткий
      contactPerson: '',
      contactPhone: '123',
      contactEmail: 'invalid-email'
    }

    const validation = validateLead(leadData)
    expect(isLeadValid(validation)).toBe(false)
    expect(validation.address.isValid).toBe(false)
    expect(validation.city.isValid).toBe(false)
    expect(validation.contactPerson.isValid).toBe(false)
    expect(validation.contactPhone.isValid).toBe(false)
    expect(validation.contactEmail?.isValid).toBe(false)
  })
})

describe('Complex Validation - User', () => {
  it('should validate correct user data', () => {
    const userData = {
      name: 'Иван Иванов',
      email: 'ivan@lead2build.ru'
    }

    const validation = validateUser(userData)
    expect(isUserValid(validation)).toBe(true)
  })

  it('should handle optional fields', () => {
    const userData = {
      name: 'Иван Иванов',
      email: 'ivan@lead2build.ru',
      phone: '+79991234567',
      telegram: '@ivanov'
    }

    const validation = validateUser(userData)
    expect(isUserValid(validation)).toBe(true)
  })
})

describe('Complex Validation - Apartment', () => {
  it('should validate correct apartment data', () => {
    const apartmentData = {
      number: '42',
      ownerName: 'Петров П.П.',
      area: 45.5
    }

    const validation = validateApartment(apartmentData)
    expect(isApartmentValid(validation)).toBe(true)
  })

  it('should reject invalid area', () => {
    const apartmentData = {
      number: '42',
      ownerName: 'Петров П.П.',
      area: -5 // отрицательная площадь
    }

    const validation = validateApartment(apartmentData)
    expect(isApartmentValid(validation)).toBe(false)
    expect(validation.area.isValid).toBe(false)
  })
})

describe('Complex Validation - Voting', () => {
  it('should validate voting with date range', () => {
    const votingData = {
      address: 'ул. Ленина, д. 15',
      apartmentsCount: 20,
      votingStartDate: '2025-10-20',
      votingEndDate: '2025-10-30'
    }

    const validation = validateVoting(votingData)
    expect(isVotingValid(validation)).toBe(true)
  })

  it('should detect invalid date range in voting', () => {
    const votingData = {
      address: 'ул. Ленина, д. 15',
      votingStartDate: '2025-10-30',
      votingEndDate: '2025-10-20' // end < start
    }

    const validation = validateVoting(votingData)
    expect(isVotingValid(validation)).toBe(false)
    expect(validation.dateRange?.isValid).toBe(false)
  })
})

describe('Complex Validation - Task', () => {
  it('should validate task with assignees', () => {
    const taskData = {
      title: 'Позвонить клиенту',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      assignedTo: ['user-1']
    }

    const validation = validateTask(taskData)
    expect(isTaskValid(validation)).toBe(true)
  })

  it('should reject task without assignees', () => {
    const taskData = {
      title: 'Позвонить клиенту',
      assignedTo: []
    }

    const validation = validateTask(taskData)
    expect(isTaskValid(validation)).toBe(false)
    expect(validation.assignedTo.error).toBe('Необходимо назначить исполнителя')
  })
})

describe('Complex Validation - Document', () => {
  it('should validate correct document', () => {
    const documentData = {
      name: 'document.pdf',
      size: 1024 * 1024, // 1MB
      type: 'application/pdf'
    }

    const validation = validateDocument(documentData)
    expect(isDocumentValid(validation)).toBe(true)
  })

  it('should reject too large documents', () => {
    const documentData = {
      name: 'large.pdf',
      size: 20 * 1024 * 1024, // 20MB > 10MB limit
      type: 'application/pdf'
    }

    const validation = validateDocument(documentData)
    expect(isDocumentValid(validation)).toBe(false)
    expect(validation.size.error).toContain('10MB')
  })

  it('should reject invalid file types', () => {
    const documentData = {
      name: 'malicious.exe',
      size: 1024,
      type: 'application/x-msdownload'
    }

    const validation = validateDocument(documentData)
    expect(isDocumentValid(validation)).toBe(false)
    expect(validation.type.isValid).toBe(false)
  })
})

describe('Utility Functions', () => {
  it('should check uniqueness in array', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(isUnique(arr, 6)).toBe(true)
    expect(isUnique(arr, 3)).toBe(false)
    expect(isUnique(arr, 3, 2)).toBe(true) // элемент на индексе 2
  })

  it('should check email uniqueness', () => {
    const users = [
      { id: '1', email: 'user1@example.com' },
      { id: '2', email: 'user2@example.com' }
    ]

    expect(isEmailUnique(users, 'user3@example.com')).toBe(true)
    expect(isEmailUnique(users, 'user1@example.com')).toBe(false)
    expect(isEmailUnique(users, 'user1@example.com', '1')).toBe(true)
  })

  it('should get all validation errors', () => {
    const validation = {
      name: { isValid: false, error: 'Имя обязательно' },
      email: { isValid: false, error: 'Email некорректный' },
      phone: { isValid: true }
    }

    const errors = getValidationErrors(validation)
    expect(errors).toHaveLength(2)
    expect(errors).toContain('Имя обязательно')
    expect(errors).toContain('Email некорректный')
  })

  it('should get first validation error', () => {
    const validation = {
      name: { isValid: false, error: 'Имя обязательно' },
      email: { isValid: false, error: 'Email некорректный' }
    }

    const firstError = getFirstValidationError(validation)
    expect(firstError).toBe('Имя обязательно')
  })

  it('should return null when no errors', () => {
    const validation = {
      name: { isValid: true },
      email: { isValid: true }
    }

    expect(getFirstValidationError(validation)).toBeNull()
  })
})

