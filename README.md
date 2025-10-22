# 🏗️ Lead2Build CRM

![CI](https://img.shields.io/badge/CI-passing-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![License](https://img.shields.io/badge/license-MIT-green)

Современная CRM система для управления строительными проектами, лидами и голосованиями.

## ✨ Возможности

### 📊 Управление лидами
- Создание и отслеживание заявок на строительство
- Виртуализация для работы с большими объёмами данных (100+ лидов)
- Фильтрация по статусу, источнику, дате
- Экспорт/импорт данных

### 🗳 Система голосований
- Организация голосований жителей
- Управление квартирами и собственниками
- Inline-редактирование данных
- Excel импорт/экспорт квартир
- Автоматический подсчёт результатов

### ✅ Управление задачами
- Создание и назначение задач
- Группировка по статусу, приоритету, исполнителю
- Фильтры и поиск
- Автоматическое создание задач из лидов

### 📄 Документооборот
- Загрузка и хранение документов
- Привязка к лидам и голосованиям
- Контроль версий

### 📱 Telegram интеграция
- Автоматические уведомления
- Подключение пользователей через Telegram
- Автоматизация рутинных задач
- Настраиваемые правила уведомлений

### 📈 Аналитика
- Dashboard с ключевыми метриками
- Графики конверсии и динамики
- Статистика по источникам лидов
- Анализ эффективности работы

## 🚀 Технологии

- **Frontend**: Next.js 14, React 18, TypeScript
- **State Management**: Zustand (6 stores)
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL + Prisma ORM
- **Icons**: Lucide React
- **Virtualization**: TanStack Virtual
- **Testing**: Vitest + Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel / Railway

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/ваш-логин/lead2build-crm.git
cd lead2build-crm/construction-management
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
```bash
cp .env.example .env.local
# Отредактируйте .env.local с вашими настройками
```

4. Настройте базу данных:
```bash
npx prisma generate
npx prisma db push
```

5. Запустите сервер разработки:
```bash
npm run dev
```

## 🌐 Развертывание

Проект настроен для развертывания на Railway. Подробная инструкция в файле `RAILWAY_DEPLOYMENT.md`.

## 📁 Структура проекта

```
construction-management/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React компоненты
│   ├── lib/          # Утилиты и сервисы
│   └── hooks/        # React хуки
├── prisma/           # Схема базы данных
├── public/           # Статические файлы
└── docs/             # Документация
```

## 🔧 Доступные команды

### Разработка
```bash
npm run dev              # Запустить dev-сервер (localhost:3000)
npm run build            # Production build
npm run start            # Запустить production сервер
```

### Качество кода
```bash
npm run lint             # Проверить код ESLint
npm run lint:fix         # Исправить ошибки автоматически
npm run format           # Форматировать код Prettier
npm run type-check       # Проверить типы TypeScript
npm run validate         # Запустить все проверки (lint + types + tests)
```

### Тестирование
```bash
npm test                 # Запустить unit тесты
npm run test:watch       # Watch mode
npm run test:ui          # UI для тестов
npm run test:coverage    # Coverage report
```

### База данных
```bash
npm run db:generate      # Генерация Prisma Client
npm run db:push          # Синхронизация схемы с БД
npm run db:migrate       # Создать миграцию
npm run db:studio        # Открыть Prisma Studio
```

## 📊 Архитектура

### Структура проекта
```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx       # Root layout с ErrorBoundary
│   └── page.tsx         # Главная страница
├── components/          # React компоненты
│   ├── leads/           # Модуль лидов
│   ├── voting/          # Модуль голосований
│   ├── tasks/           # Модуль задач
│   ├── settings/        # Настройки
│   ├── skeletons/       # Loading states
│   └── ...
├── stores/              # Zustand state management
│   ├── useLeadsStore.ts
│   ├── useVotingsStore.ts
│   ├── useTasksStore.ts
│   ├── useUsersStore.ts
│   ├── useTelegramStore.ts
│   └── useDocumentsStore.ts
├── utils/               # Утилиты
│   ├── validation.ts    # Централизованная валидация
│   ├── performance.ts   # Оптимизация (debounce, memoize)
│   └── errorLogger.ts   # Логирование ошибок
└── test/                # Тестовые утилиты
```

### State Management (Zustand)

Проект использует 6 Zustand stores с localStorage persistence:

- **useLeadsStore** - управление лидами (CRUD + queries)
- **useVotingsStore** - голосования и квартиры
- **useTasksStore** - задачи
- **useUsersStore** - пользователи и роли
- **useTelegramStore** - Telegram интеграция
- **useDocumentsStore** - документы

### Ключевые фичи

#### ⚡️ Производительность
- Виртуализация списков (TanStack Virtual)
- Мемоизация с useMemo/useCallback
- Lazy loading компонентов
- Code splitting

#### 🛡 Качество кода
- 100% TypeScript
- 130+ unit тестов
- ESLint + Prettier
- Pre-commit hooks (Husky)

#### 🔔 UX
- Toast-уведомления (NotificationService)
- Loading states и скелетоны
- Error Boundary для отлова ошибок
- Централизованное логирование

## 🚀 CI/CD

Проект настроен с полным CI/CD pipeline:

### GitHub Actions Workflows

✅ **CI** - запускается на каждый push/PR
- Lint & Type Check
- Unit Tests (130+ тестов)
- Build verification
- Security audit

✅ **Deploy** - автодеплой на Vercel/Netlify
- При push в `main` → production
- Preview deploys для PR

✅ **CodeQL** - security scanning
- Сканирование уязвимостей
- Еженедельный автоматический анализ

✅ **Lighthouse CI** - performance audit
- Performance, Accessibility, SEO
- Отчёты в каждом PR

### Pre-commit Hooks

```bash
# Автоматически при commit:
✅ ESLint с автофиксом
✅ Prettier форматирование
✅ TypeScript type checking
✅ Commit message validation (Conventional Commits)

# Автоматически при push:
✅ Запуск всех тестов
```

**📖 Подробнее:** [CI_CD_GUIDE.md](./CI_CD_GUIDE.md)  
**⚡️ Быстрый старт:** [QUICK_START_CI_CD.md](./QUICK_START_CI_CD.md)

## 📚 Документация

- **[MIGRATION_COMPLETE.md](./MIGRATION_COMPLETE.md)** - Итоги миграции на Zustand
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Следующие шаги развития
- **[CI_CD_GUIDE.md](./CI_CD_GUIDE.md)** - Полное руководство по CI/CD
- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Руководство по тестированию
- **[LOADING_STATES_GUIDE.md](./LOADING_STATES_GUIDE.md)** - Loading states
- **[PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)** - Оптимизация
- **[src/utils/VALIDATION_README.md](./src/utils/VALIDATION_README.md)** - Валидация данных

## 🧪 Тестирование

```bash
# Запустить все тесты
npm test

# Watch mode (автоперезапуск)
npm run test:watch

# UI для тестов
npm run test:ui

# Coverage report
npm run test:coverage
```

**Покрытие тестами:**
- ✅ 70+ тестов валидации (validation.test.ts)
- ✅ 20+ тестов производительности (performance.test.ts)
- ✅ 30+ тестов логирования (errorLogger.test.ts)
- ✅ 10+ тестов stores (useLeadsStore.test.ts)

## 🎨 Кодовые стандарты

### Commit Messages (Conventional Commits)

```bash
feat: добавить новую функциональность
fix: исправить баг
docs: обновить документацию
style: форматирование кода
refactor: рефакторинг
perf: улучшение производительности
test: добавить тесты
chore: обновление зависимостей
ci: изменения в CI/CD
```

### Code Style

- **Форматирование**: Prettier (автоматически через pre-commit)
- **Линтинг**: ESLint (Next.js config)
- **Типы**: Строгий TypeScript (`strict: true`)

## 🤝 Contribution Guidelines

1. Форкните репозиторий
2. Создайте feature ветку: `git checkout -b feature/amazing-feature`
3. Сделайте изменения и commit: `git commit -m "feat: add amazing feature"`
4. Push в ветку: `git push origin feature/amazing-feature`
5. Создайте Pull Request

**Требования:**
- ✅ Все тесты должны проходить
- ✅ TypeScript без ошибок
- ✅ ESLint без ошибок
- ✅ Следовать Conventional Commits
- ✅ Добавить тесты для новой функциональности

## 📄 Лицензия

MIT License - см. [LICENSE](./LICENSE)

## 🙏 Благодарности

- [Next.js](https://nextjs.org/) - React фреймворк
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Tailwind CSS](https://tailwindcss.com/) - Утилитарный CSS
- [Lucide](https://lucide.dev/) - Иконки
- [Vitest](https://vitest.dev/) - Тестирование

## 📞 Контакты и поддержка

- 🐛 **Баг репорты**: [GitHub Issues](https://github.com/your-username/lead2build-crm/issues)
- 💡 **Идеи**: [Feature Requests](https://github.com/your-username/lead2build-crm/issues/new?template=feature_request.md)
- 📧 **Email**: your-email@example.com

---

**Сделано с ❤️ для оптимизации строительного бизнеса**
