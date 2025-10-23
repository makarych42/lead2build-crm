import { UserRole } from '@/types'
import { OnboardingTour, RoleBasedTour, ONBOARDING_TOURS, ROLE_DESCRIPTIONS } from '@/types/onboarding'
import { 
  BarChart3, 
  Home as HomeIcon, 
  FileText, 
  Vote, 
  Bell, 
  MessageCircle, 
  Settings as SettingsIcon,
  Plus,
  Filter,
  Download,
  Upload,
  Users,
  Calendar,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

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
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
            Добро пожаловать в Lead2Build CRM!
          </h3>
          <p>Это главная панель системы управления процессом голосования жильцов.</p>
          <p>Здесь вы можете видеть общую статистику и быстрые действия.</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="dashboard-stats"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Статистика проекта</h4>
          <p>Здесь отображаются ключевые метрики:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Общее количество лидов</li>
            <li>Активные голосования</li>
            <li>Завершенные задачи</li>
            <li>Документы на рассмотрении</li>
          </ul>
        </div>
      ),
      placement: 'top'
    },
    {
      target: '[data-tour="dashboard-actions"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Быстрые действия</h4>
          <p>Используйте эти кнопки для быстрого доступа к основным функциям:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Создать новый лид</li>
            <li>Перейти к голосованиям</li>
            <li>Просмотреть задачи</li>
          </ul>
        </div>
      ),
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
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <HomeIcon className="h-5 w-5 mr-2 text-green-600" />
            Раздел "Лиды"
          </h3>
          <p>Здесь вы управляете всеми потенциальными клиентами - жильцами, заинтересованными в капитальном ремонте.</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="leads-filters"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Фильтры и поиск
          </h4>
          <p>Используйте фильтры для быстрого поиска лидов по:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Статусу (новый, в работе, голосование)</li>
            <li>Городу</li>
            <li>Этапу работы</li>
            <li>Дате создания</li>
          </ul>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="leads-table"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Таблица лидов</h4>
          <p>Основная информация о каждом лиде:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Адрес и контактное лицо</li>
            <li>Текущий статус</li>
            <li>Этап работы</li>
            <li>Дата последнего обновления</li>
          </ul>
        </div>
      ),
      placement: 'top'
    },
    {
      target: '[data-tour="leads-actions"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Действия с лидами
          </h4>
          <p>Доступные операции:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Создать новый лид</li>
            <li>Экспортировать данные</li>
            <li>Массовые операции</li>
          </ul>
        </div>
      ),
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
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <FileText className="h-5 w-5 mr-2 text-purple-600" />
            Раздел "Документы"
          </h3>
          <p>Здесь вы управляете всеми документами проекта: предложения, схемы КТ, документы голосования.</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="documents-upload"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Загрузка документов
          </h4>
          <p>Загружайте документы по категориям:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Комплексное предложение</li>
            <li>Реестр собственников</li>
            <li>Схема КТ</li>
            <li>Документы голосования</li>
            <li>Документы ТКО</li>
          </ul>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="documents-list"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Список документов</h4>
          <p>Просматривайте и управляйте загруженными документами:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Статус обработки</li>
            <li>Дата загрузки</li>
            <li>Размер файла</li>
            <li>Действия (скачать, удалить)</li>
          </ul>
        </div>
      ),
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
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <Vote className="h-5 w-5 mr-2 text-orange-600" />
            Раздел "Голосования"
          </h3>
          <p>Здесь вы создаете и управляете голосованиями жильцов по капитальному ремонту.</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="voting-create"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Создание голосования
          </h4>
          <p>Создайте новое голосование:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Выберите лид (дом)</li>
            <li>Укажите форму голосования</li>
            <li>Добавьте квартиры</li>
            <li>Настройте параметры</li>
          </ul>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="voting-list"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Список голосований</h4>
          <p>Управляйте активными голосованиями:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Статус голосования</li>
            <li>Прогресс сбора голосов</li>
            <li>Количество участников</li>
            <li>Результаты</li>
          </ul>
        </div>
      ),
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
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
            Раздел "Аналитика"
          </h3>
          <p>Здесь вы можете анализировать эффективность работы и строить отчеты.</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="analytics-charts"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Графики и диаграммы</h4>
          <p>Визуализация данных:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Динамика лидов по месяцам</li>
            <li>Статистика голосований</li>
            <li>Эффективность по этапам</li>
            <li>Географическое распределение</li>
          </ul>
        </div>
      ),
      placement: 'top'
    },
    {
      target: '[data-tour="analytics-filters"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Фильтры отчетов
          </h4>
          <p>Настройте параметры анализа:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Период времени</li>
            <li>Географический регион</li>
            <li>Тип голосования</li>
            <li>Статус проектов</li>
          </ul>
        </div>
      ),
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
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <Bell className="h-5 w-5 mr-2 text-red-600" />
            Раздел "Задачи и уведомления"
          </h3>
          <p>Здесь вы управляете задачами и получаете уведомления о важных событиях.</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="tasks-create"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Создание задач
          </h4>
          <p>Создавайте задачи для отслеживания работы:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Связать с лидом</li>
            <li>Назначить исполнителя</li>
            <li>Установить приоритет</li>
            <li>Указать срок выполнения</li>
          </ul>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="tasks-list"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Список задач</h4>
          <p>Просматривайте и управляйте задачами:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Фильтрация по статусу</li>
            <li>Сортировка по приоритету</li>
            <li>Поиск по названию</li>
            <li>Массовые операции</li>
          </ul>
        </div>
      ),
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
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-blue-500" />
            Раздел "Telegram"
          </h3>
          <p>Настройте автоматизацию уведомлений и взаимодействия через Telegram бота.</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="telegram-setup"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Настройка бота</h4>
          <p>Подключите Telegram бота:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Укажите токен бота</li>
            <li>Настройте webhook</li>
            <li>Выберите каналы уведомлений</li>
            <li>Настройте автоматические ответы</li>
          </ul>
        </div>
      ),
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
      content: (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2 text-gray-600" />
            Раздел "Настройки"
          </h3>
          <p>Здесь вы управляете пользователями, настройками компании и экспортом данных.</p>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="settings-users"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Управление пользователями
          </h4>
          <p>Добавляйте и настраивайте пользователей:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Создание новых пользователей</li>
            <li>Назначение ролей</li>
            <li>Управление доступом</li>
            <li>Активация/деактивация</li>
          </ul>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '[data-tour="settings-company"]',
      content: (
        <div className="space-y-2">
          <h4 className="font-semibold">Настройки компании</h4>
          <p>Конфигурация системы:</p>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Информация о компании</li>
            <li>Настройки уведомлений</li>
            <li>Параметры экспорта</li>
            <li>Резервное копирование</li>
          </ul>
        </div>
      ),
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
