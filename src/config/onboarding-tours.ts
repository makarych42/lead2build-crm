import { UserRole } from '@/types'
import { OnboardingTour, RoleBasedTour, ONBOARDING_TOURS, ROLE_DESCRIPTIONS } from '@/types/onboarding'

// ============= ОСНОВНЫЕ ТУРЫ =============

const dashboardTour: OnboardingTour = {
  id: ONBOARDING_TOURS.DASHBOARD,
  name: 'Главная панель',
  description: 'Обзор системы и основные метрики',
  roles: ['SALES_MANAGER', 'DOCUMENT_SPECIALIST', 'TECHNICAL_INSPECTOR', 'VOTING_COORDINATOR', 'VOTING_MANAGER', 'ADMIN'],
  required: true,
  order: 1,
  steps: [
    {
      target: '[data-tour="dashboard-header"]',
      content: 'Добро пожаловать в Lead2Build CRM! Это главная панель системы управления процессом голосования жильцов.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="dashboard-stats"]',
      content: 'Здесь отображаются ключевые метрики: общее количество лидов, активные голосования, завершенные задачи, документы на рассмотрении.',
      placement: 'top'
    },
    {
      target: '[data-tour="dashboard-actions"]',
      content: 'Используйте эти кнопки для быстрого доступа к основным функциям: создать новый лид, перейти к голосованиям, просмотреть задачи.',
      placement: 'left'
    }
  ]
}

const leadsTour: OnboardingTour = {
  id: ONBOARDING_TOURS.LEADS,
  name: 'Управление лидами',
  description: 'Работа с потенциальными клиентами',
  roles: ['SALES_MANAGER', 'ADMIN'],
  required: true,
  order: 2,
  steps: [
    {
      target: '[data-tour="leads-header"]',
      content: 'Раздел "Лиды" - здесь вы управляете всеми потенциальными клиентами - жильцами, заинтересованными в капитальном ремонте.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="leads-filters"]',
      content: 'Используйте фильтры для быстрого поиска лидов по статусу, городу, этапу работы, дате создания.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="leads-table"]',
      content: 'Основная информация о каждом лиде: адрес и контактное лицо, текущий статус, этап работы, дата последнего обновления.',
      placement: 'top'
    },
    {
      target: '[data-tour="leads-actions"]',
      content: 'Доступные операции: создать новый лид, экспортировать данные, массовые операции.',
      placement: 'left'
    }
  ]
}

const documentsTour: OnboardingTour = {
  id: ONBOARDING_TOURS.DOCUMENTS,
  name: 'Управление документами',
  description: 'Загрузка и обработка документов',
  roles: ['DOCUMENT_SPECIALIST', 'ADMIN'],
  required: true,
  order: 3,
  steps: [
    {
      target: '[data-tour="documents-header"]',
      content: 'Раздел "Документы" - здесь вы управляете всеми документами проекта: предложения, схемы КТ, документы голосования.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="documents-upload"]',
      content: 'Загружайте документы по категориям: комплексное предложение, реестр собственников, схема КТ, документы голосования, документы ТКО.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="documents-list"]',
      content: 'Просматривайте и управляйте загруженными документами: статус обработки, дата загрузки, размер файла, действия (скачать, удалить).',
      placement: 'top'
    }
  ]
}

const votingTour: OnboardingTour = {
  id: ONBOARDING_TOURS.VOTING,
  name: 'Организация голосований',
  description: 'Создание и управление голосованиями жильцов',
  roles: ['VOTING_COORDINATOR', 'VOTING_MANAGER', 'ADMIN'],
  required: true,
  order: 4,
  steps: [
    {
      target: '[data-tour="voting-header"]',
      content: 'Раздел "Голосования" - здесь вы создаете и управляете голосованиями жильцов по капитальному ремонту.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="voting-create"]',
      content: 'Создайте новое голосование: выберите лид (дом), укажите форму голосования, добавьте квартиры, настройте параметры.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="voting-list"]',
      content: 'Управляйте активными голосованиями: статус голосования, прогресс сбора голосов, количество участников, результаты.',
      placement: 'top'
    }
  ]
}

const analyticsTour: OnboardingTour = {
  id: ONBOARDING_TOURS.ANALYTICS,
  name: 'Аналитика и отчеты',
  description: 'Просмотр статистики и аналитических данных',
  roles: ['SALES_MANAGER', 'VOTING_MANAGER', 'ADMIN'],
  required: false,
  order: 5,
  steps: [
    {
      target: '[data-tour="analytics-header"]',
      content: 'Раздел "Аналитика" - здесь вы можете анализировать эффективность работы и строить отчеты.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="analytics-charts"]',
      content: 'Визуализация данных: динамика лидов по месяцам, статистика голосований, эффективность по этапам, географическое распределение.',
      placement: 'top'
    },
    {
      target: '[data-tour="analytics-filters"]',
      content: 'Настройте параметры анализа: период времени, географический регион, тип голосования, статус проектов.',
      placement: 'bottom'
    }
  ]
}

const tasksTour: OnboardingTour = {
  id: ONBOARDING_TOURS.TASKS,
  name: 'Управление задачами',
  description: 'Создание и отслеживание задач',
  roles: ['SALES_MANAGER', 'DOCUMENT_SPECIALIST', 'TECHNICAL_INSPECTOR', 'VOTING_COORDINATOR', 'VOTING_MANAGER', 'ADMIN'],
  required: true,
  order: 6,
  steps: [
    {
      target: '[data-tour="tasks-header"]',
      content: 'Раздел "Задачи и уведомления" - здесь вы управляете задачами и получаете уведомления о важных событиях.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="tasks-create"]',
      content: 'Создавайте задачи для отслеживания работы: связать с лидом, назначить исполнителя, установить приоритет, указать срок выполнения.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="tasks-list"]',
      content: 'Просматривайте и управляйте задачами: фильтрация по статусу, сортировка по приоритету, поиск по названию, массовые операции.',
      placement: 'top'
    }
  ]
}

const telegramTour: OnboardingTour = {
  id: ONBOARDING_TOURS.TELEGRAM,
  name: 'Telegram интеграция',
  description: 'Настройка автоматизации через Telegram',
  roles: ['ADMIN'],
  required: false,
  order: 7,
  steps: [
    {
      target: '[data-tour="telegram-header"]',
      content: 'Раздел "Telegram" - настройте автоматизацию уведомлений и взаимодействия через Telegram бота.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="telegram-setup"]',
      content: 'Подключите Telegram бота: укажите токен бота, настройте webhook, выберите каналы уведомлений, настройте автоматические ответы.',
      placement: 'bottom'
    }
  ]
}

const settingsTour: OnboardingTour = {
  id: ONBOARDING_TOURS.SETTINGS,
  name: 'Настройки системы',
  description: 'Управление пользователями и настройками',
  roles: ['ADMIN'],
  required: false,
  order: 8,
  steps: [
    {
      target: '[data-tour="settings-header"]',
      content: 'Раздел "Настройки" - здесь вы управляете пользователями, настройками компании и экспортом данных.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="settings-users"]',
      content: 'Добавляйте и настраивайте пользователей: создание новых пользователей, назначение ролей, управление доступом, активация/деактивация.',
      placement: 'bottom'
    },
    {
      target: '[data-tour="settings-company"]',
      content: 'Конфигурация системы: информация о компании, настройки уведомлений, параметры экспорта, резервное копирование.',
      placement: 'top'
    }
  ]
}

// ============= ТУРЫ ПО РОЛЯМ =============

export const roleBasedTours: Record<UserRole, RoleBasedTour> = {
  SALES_MANAGER: {
    role: 'SALES_MANAGER',
    description: ROLE_DESCRIPTIONS.SALES_MANAGER,
    welcomeMessage: 'Добро пожаловать! Вы работаете менеджером по продажам.',
    tours: [dashboardTour, leadsTour, analyticsTour, tasksTour]
  },
  DOCUMENT_SPECIALIST: {
    role: 'DOCUMENT_SPECIALIST',
    description: ROLE_DESCRIPTIONS.DOCUMENT_SPECIALIST,
    welcomeMessage: 'Добро пожаловать! Вы работаете специалистом по документам.',
    tours: [dashboardTour, documentsTour, tasksTour]
  },
  TECHNICAL_INSPECTOR: {
    role: 'TECHNICAL_INSPECTOR',
    description: ROLE_DESCRIPTIONS.TECHNICAL_INSPECTOR,
    welcomeMessage: 'Добро пожаловать! Вы работаете техническим инспектором.',
    tours: [dashboardTour, tasksTour]
  },
  VOTING_COORDINATOR: {
    role: 'VOTING_COORDINATOR',
    description: ROLE_DESCRIPTIONS.VOTING_COORDINATOR,
    welcomeMessage: 'Добро пожаловать! Вы работаете координатором голосований.',
    tours: [dashboardTour, votingTour, tasksTour]
  },
  VOTING_MANAGER: {
    role: 'VOTING_MANAGER',
    description: ROLE_DESCRIPTIONS.VOTING_MANAGER,
    welcomeMessage: 'Добро пожаловать! Вы работаете менеджером голосований.',
    tours: [dashboardTour, votingTour, analyticsTour, tasksTour]
  },
  ADMIN: {
    role: 'ADMIN',
    description: ROLE_DESCRIPTIONS.ADMIN,
    welcomeMessage: 'Добро пожаловать! У вас есть полный доступ ко всем функциям системы.',
    tours: [dashboardTour, leadsTour, documentsTour, votingTour, analyticsTour, tasksTour, telegramTour, settingsTour]
  }
}

// ============= УТИЛИТЫ =============

export const getToursForRole = (role: UserRole): OnboardingTour[] => {
  return roleBasedTours[role]?.tours || []
}

export const getWelcomeMessage = (role: UserRole): string => {
  return roleBasedTours[role]?.welcomeMessage || 'Добро пожаловать в Lead2Build CRM!'
}

export const getRoleDescription = (role: UserRole): string => {
  return roleBasedTours[role]?.description || ''
}

export const getAllTours = (): OnboardingTour[] => {
  return [
    dashboardTour,
    leadsTour,
    documentsTour,
    votingTour,
    analyticsTour,
    tasksTour,
    telegramTour,
    settingsTour
  ]
}