'use client'

import { useState, useEffect } from 'react'

function getStorageValue<T>(key: string, defaultValue: T): T {
  // Возвращаем значение по умолчанию на сервере
  if (typeof window === 'undefined') {
    return defaultValue
  }
  
  try {
    const saved = localStorage.getItem(key)
    if (saved !== null) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error(`Ошибка загрузки из localStorage для ключа "${key}":`, error)
  }
  
  return defaultValue
}

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Инициализируем значение только на клиенте
  useEffect(() => {
    if (isInitialized) return // Предотвращаем повторную инициализацию
    
    let value = getStorageValue(key, defaultValue)
    
    // Добавляем тестовые данные для лидов, если данных нет ИЛИ если принудительно запрашивается обновление
    if (key === 'construction_leads' && (Array.isArray(value) && value.length === 0 || typeof window !== 'undefined' && window.location.search.includes('regenerate=true'))) {
      // Генерируем 105 тестовых лидов
      const testLeads = []
      
      // Исходные 5 лидов
      const originalLeads = [
        {
          id: '1',
          address: 'ул. Ленина, 15',
          city: 'Москва',
          contactPerson: 'Иван Петров',
          contactPhone: '+7 (912) 345-67-89',
          contactEmail: 'ivan.petrov@example.com',
          source: 'ОЗ',
          status: 'NEW',
          currentStage: 'INITIAL_CONSULTATION',
          createdAt: new Date().toISOString(),
          buildingType: null,
          floorsCount: 5,
          apartmentsCount: 20
        },
        {
          id: '2',
          address: 'пр. Победы, 32',
          city: 'СПб',
          contactPerson: 'Мария Сидорова',
          contactPhone: '+7 (923) 456-78-90',
          contactEmail: 'maria.sidorova@example.com',
          source: 'Сарафанная радио',
          status: 'IN_PROGRESS',
          currentStage: 'DOCUMENT_PREPARATION',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          buildingType: null,
          floorsCount: 9,
          apartmentsCount: 54
        },
        {
          id: '3',
          address: 'ул. Мира, 7',
          city: 'Новосибирск',
          contactPerson: 'Алексей Козлов',
          contactPhone: '+7 (934) 567-89-01',
          contactEmail: null,
          source: 'Фронты',
          status: 'VOTING',
          currentStage: 'VOTING_PROCESS',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          buildingType: null,
          floorsCount: 4,
          apartmentsCount: 16
        },
        {
          id: '4',
          address: 'ул. Гагарина, 12',
          city: 'Екатеринбург',
          contactPerson: 'Елена Смирнова',
          contactPhone: '+7 (945) 678-90-12',
          contactEmail: 'elena.smirnova@example.com',
          source: 'ОЗ',
          status: 'COMPLETED',
          currentStage: 'CONSTRUCTION_READY',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          buildingType: null,
          floorsCount: 12,
          apartmentsCount: 72
        },
        {
          id: '5',
          address: 'пр. Молодежный, 8',
          city: 'Казань',
          contactPerson: 'Дмитрий Новиков',
          contactPhone: '+7 (956) 789-01-23',
          contactEmail: 'dmitry.novikov@example.com',
          source: 'Сарафанная радио',
          status: 'REJECTED',
          currentStage: 'INITIAL_CONSULTATION',
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          buildingType: null,
          floorsCount: 3,
          apartmentsCount: 12
        }
      ]
      
      testLeads.push(...originalLeads)
      
      // Массивы для генерации данных
      const streets = [
        'ул. Советская', 'пр. Мира', 'ул. Красная', 'ул. Центральная', 'пр. Ленина',
        'ул. Садовая', 'ул. Школьная', 'ул. Новая', 'пр. Победы', 'ул. Первомайская',
        'ул. Комсомольская', 'ул. Строителей', 'ул. Рабочая', 'ул. Молодежная', 'пр. Кирова',
        'ул. Парковая', 'ул. Речная', 'ул. Лесная', 'ул. Полевая', 'ул. Заречная',
        'ул. Дружбы', 'пр. Космонавтов', 'ул. Трудовая', 'ул. Зеленая', 'ул. Солнечная'
      ]
      
      const firstNames = [
        'Александр', 'Алексей', 'Андрей', 'Антон', 'Артем', 'Борис', 'Вадим', 'Валерий', 'Василий', 'Виктор',
        'Владимир', 'Владислав', 'Вячеслав', 'Геннадий', 'Денис', 'Дмитрий', 'Евгений', 'Егор', 'Иван', 'Игорь',
        'Анна', 'Валентина', 'Галина', 'Дарья', 'Екатерина', 'Елена', 'Жанна', 'Зоя', 'Ирина', 'Ксения',
        'Лариса', 'Людмила', 'Марина', 'Мария', 'Надежда', 'Наталья', 'Ольга', 'Полина', 'Светлана', 'Татьяна'
      ]
      
      const lastNames = [
        'Иванов', 'Петров', 'Сидоров', 'Козлов', 'Смирнов', 'Новиков', 'Морозов', 'Петухов', 'Волков', 'Соколов',
        'Зайцев', 'Павлов', 'Семенов', 'Голубев', 'Виноградов', 'Богданов', 'Воробьев', 'Федоров', 'Михайлов', 'Беляев',
        'Тарасов', 'Белов', 'Комаров', 'Орлов', 'Киселев', 'Макаров', 'Андреев', 'Ковалев', 'Ильин', 'Гусев',
        'Титов', 'Кузнецов', 'Кудрявцев', 'Баранов', 'Куликов', 'Алексеев', 'Степанов', 'Яковлев', 'Сорокин', 'Сергеев'
      ]
      
      const sources = ['ОЗ', 'Сарафанная радио', 'Фронты', 'Интернет', 'Реклама', 'Партнеры']
      const statuses = ['NEW', 'IN_PROGRESS', 'VOTING', 'COMPLETED', 'REJECTED']
      const stages = ['INITIAL_CONSULTATION', 'DOCUMENT_PREPARATION', 'VOTING_PROCESS', 'CONSTRUCTION_READY']
      const cities = ['Москва', 'СПб', 'Новосибирск', 'Екатеринбург', 'Казань', 'Нижний Новгород', 'Челябинск', 'Омск', 'Самара', 'Ростов-на-Дону', 'Уфа', 'Красноярск']
      
      // Генерируем еще 100 лидов
      for (let i = 6; i <= 105; i++) {
        const streetIndex = Math.floor(Math.random() * streets.length)
        const buildingNumber = Math.floor(Math.random() * 200) + 1
        const firstNameIndex = Math.floor(Math.random() * firstNames.length)
        const lastNameIndex = Math.floor(Math.random() * lastNames.length)
        
        const phoneBase = Math.floor(Math.random() * 900) + 100
        const phoneMid = Math.floor(Math.random() * 900) + 100
        const phoneEnd = Math.floor(Math.random() * 90) + 10
        
        const floorsCount = Math.floor(Math.random() * 15) + 3 // 3-17 этажей
        const apartmentsPerFloor = Math.floor(Math.random() * 8) + 2 // 2-9 квартир на этаж
        const apartmentsCount = floorsCount * apartmentsPerFloor
        
        const daysAgo = Math.floor(Math.random() * 90) // 0-89 дней назад
        
        const hasEmail = Math.random() > 0.3 // 70% имеют email
        
        testLeads.push({
          id: i.toString(),
          address: `${streets[streetIndex]}, ${buildingNumber}`,
          city: cities[Math.floor(Math.random() * cities.length)],
          contactPerson: `${firstNames[firstNameIndex]} ${lastNames[lastNameIndex]}`,
          contactPhone: `+7 (9${phoneBase.toString().slice(0, 2)}) ${phoneMid.toString().slice(0, 3)}-${phoneEnd.toString()}-${Math.floor(Math.random() * 90) + 10}`,
          contactEmail: hasEmail ? `${firstNames[firstNameIndex].toLowerCase()}.${lastNames[lastNameIndex].toLowerCase()}@example.com` : null,
          source: sources[Math.floor(Math.random() * sources.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          currentStage: stages[Math.floor(Math.random() * stages.length)],
          createdAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
          buildingType: null,
          floorsCount: floorsCount,
          apartmentsCount: apartmentsCount
        })
      }
      
      value = testLeads as T
      
      // Сохраняем тестовые данные в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(value))
      }
    }
    
    setStoredValue(value)
    setIsInitialized(true)
  }, []) // Пустой массив зависимостей - выполняется только один раз

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Ошибка сохранения в localStorage для ключа "${key}":`, error)
    }
  }

  return [storedValue, setValue, isInitialized] as const
}