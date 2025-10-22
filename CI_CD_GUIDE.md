# 🚀 CI/CD Guide - Lead2Build CRM

Полное руководство по настройке и использованию CI/CD для проекта.

## 📋 Содержание

- [Обзор](#обзор)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Настройка](#настройка)
- [Pre-commit Hooks](#pre-commit-hooks)
- [Деплой](#деплой)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Обзор

Проект настроен с полным CI/CD pipeline, который включает:

- ✅ **Автоматическое тестирование** при каждом push/PR
- ✅ **Проверка типов** TypeScript
- ✅ **Линтинг кода** с автофиксом
- ✅ **Проверка безопасности** (CodeQL + npm audit)
- ✅ **Lighthouse аудит** производительности
- ✅ **Автоматический деплой** на production
- ✅ **Pre-commit hooks** для валидации перед коммитом
- ✅ **Dependabot** для обновления зависимостей

---

## 🔄 GitHub Actions Workflows

### 1. CI (Continuous Integration) - `.github/workflows/ci.yml`

**Триггеры:**
- Push в `main`, `master`, `develop`
- Pull Request в эти же ветки

**Jobs:**

#### 🔍 Lint & Type Check
- Запускает ESLint
- Проверяет типы TypeScript
- Статус: `continue-on-error: true` (предупреждения, не блокирует)

#### 🧪 Unit Tests
- Запускает все unit тесты
- Генерирует coverage report
- Загружает артефакты покрытия

#### 🏗 Build
- Собирает production build
- Проверяет, что проект собирается без ошибок
- Загружает `.next/` как артефакт

#### 🔒 Security Audit
- `npm audit` для проверки уязвимостей
- Проверка устаревших пакетов

**Как посмотреть результаты:**
1. Откройте вкладку "Actions" в GitHub
2. Выберите workflow "CI"
3. Нажмите на конкретный run
4. Просмотрите логи каждого job

---

### 2. Deploy - `.github/workflows/deploy.yml`

**Триггеры:**
- Push в `main`/`master`
- Ручной запуск (workflow_dispatch)

**Что делает:**
1. Собирает production build
2. Деплоит на Vercel (или Netlify)
3. Отправляет уведомление о статусе

**⚠️ Требует настройки secrets:**
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

---

### 3. PR Checks - `.github/workflows/pr-checks.yml`

**Триггеры:**
- Открытие PR
- Обновление PR
- Reopening PR

**Что проверяет:**

#### 📏 PR Size
- Количество изменённых файлов (рекомендация: < 50)
- Количество строк (рекомендация: < 1000)
- Выводит предупреждения, если PR слишком большой

#### 📝 Commit Messages
- Проверяет длину сообщений коммитов
- Предупреждает, если > 100 символов

#### 🔍 Dependency Review
- Проверяет новые зависимости на уязвимости
- Блокирует PR при обнаружении moderate+ уязвимостей

#### 💬 PR Comment
- Автоматически комментирует PR со статистикой
- Показывает количество файлов/строк/коммитов

---

### 4. CodeQL - `.github/workflows/codeql.yml`

**Триггеры:**
- Push в основные ветки
- Pull Request
- Расписание: каждый понедельник в 6:00 UTC

**Что делает:**
- Анализирует код на уязвимости безопасности
- Находит потенциальные баги
- Создаёт Security Alerts в GitHub

**Языки:** JavaScript, TypeScript

---

### 5. Release - `.github/workflows/release.yml`

**Триггеры:**
- Push тега вида `v*.*.*` (например, `v1.0.0`)

**Что делает:**
1. Генерирует changelog из коммитов
2. Создаёт GitHub Release
3. Прикрепляет build артефакты

**Как создать релиз:**
```bash
# Обновите версию в package.json
npm version patch  # или minor, major

# Создайте тег
git tag v1.0.1

# Отправьте тег
git push origin v1.0.1
```

---

### 6. Lighthouse - `.github/workflows/lighthouse.yml`

**Триггеры:**
- Push/PR в `main`/`master`

**Что делает:**
- Запускает Lighthouse аудит
- Проверяет Performance, Accessibility, Best Practices, SEO
- Генерирует отчёт

**Thresholds (в `lighthouserc.json`):**
- Performance: ≥ 80%
- Accessibility: ≥ 90%
- Best Practices: ≥ 85%
- SEO: ≥ 90%

---

## ⚙️ Настройка

### Шаг 1: Установка зависимостей для pre-commit hooks

```bash
# Установите Husky и lint-staged
npm install -D husky lint-staged prettier

# Инициализация Husky
npm run prepare

# Сделайте hooks исполняемыми (на Linux/Mac)
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

**На Windows (PowerShell как администратор):**
```powershell
# Разрешите выполнение скриптов
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### Шаг 2: Настройка GitHub Secrets

Для деплоя нужно добавить secrets:

#### Для Vercel:
1. Откройте Settings → Secrets and variables → Actions
2. Добавьте:
   - `VERCEL_TOKEN` - токен из https://vercel.com/account/tokens
   - `VERCEL_ORG_ID` - из `.vercel/project.json` после первого деплоя
   - `VERCEL_PROJECT_ID` - оттуда же

#### Для Netlify (альтернатива):
```
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

---

### Шаг 3: Настройка Dependabot

Откройте `.github/dependabot.yml` и замените:
```yaml
reviewers:
  - "your-username"  # ← Ваш GitHub username
assignees:
  - "your-username"  # ← Ваш GitHub username
```

Dependabot будет автоматически создавать PR для обновления зависимостей каждый понедельник.

---

### Шаг 4: Включение Branch Protection Rules

**Рекомендуется для `main`/`master`:**

1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Включите:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
     - CI: lint, test, build
     - PR Checks: pr-size, commit-checks
   - ✅ Require branches to be up to date before merging
   - ✅ Require conversation resolution before merging
   - ✅ Do not allow bypassing the above settings

---

## 🎣 Pre-commit Hooks

### Pre-commit (`.husky/pre-commit`)

Запускается **перед каждым коммитом:**

1. **Lint-staged** - проверяет только изменённые файлы:
   - ESLint с автофиксом
   - Prettier форматирование
2. **Type check** - проверяет все типы TypeScript

**Обойти (не рекомендуется):**
```bash
git commit --no-verify -m "message"
```

---

### Pre-push (`.husky/pre-push`)

Запускается **перед push:**

- Запускает все тесты (`npm test`)

**Если тесты падают:**
```bash
# Исправьте тесты или обойдите (осторожно!)
git push --no-verify
```

---

### Commit Message Hook (`.husky/commit-msg`)

Проверяет формат сообщения коммита.

**Требуемый формат (Conventional Commits):**
```
type(scope?): subject

Types:
  feat     - новая функциональность
  fix      - исправление бага
  docs     - документация
  style    - форматирование, запятые и т.д.
  refactor - рефакторинг кода
  perf     - улучшение производительности
  test     - добавление тестов
  chore    - обновление зависимостей, конфигурации
  ci       - изменения в CI/CD
  build    - изменения в сборке
```

**Примеры:**
```bash
git commit -m "feat: add user authentication"
git commit -m "fix(voting): correct apartment calculation"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor(stores): migrate to Zustand"
git commit -m "test: add unit tests for validation"
```

---

## 🚀 Деплой

### Автоматический деплой (рекомендуется)

**Vercel (бесплатно для hobby проектов):**

1. Создайте аккаунт на https://vercel.com
2. Подключите GitHub репозиторий
3. Vercel автоматически задетектит Next.js
4. Настройте environment variables (если нужны)
5. При каждом push в `main` → автодеплой!

**Netlify:**

1. Создайте аккаунт на https://netlify.com
2. Подключите GitHub репозиторий
3. Build command: `npm run build`
4. Publish directory: `.next`

---

### Ручной деплой

**Vercel CLI:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 📊 Мониторинг и отчёты

### Coverage Reports

После каждого CI run:
1. Откройте Actions → выберите workflow → artifacts
2. Скачайте `coverage-report`
3. Откройте `coverage/index.html` в браузере

### Lighthouse Reports

1. Откройте Actions → Lighthouse CI workflow
2. Скачайте `lighthouse-results`
3. Или смотрите в логах temporary public storage URL

### CodeQL Alerts

1. Security → Code scanning alerts
2. Просматривайте найденные уязвимости
3. Фиксите и закрывайте алерты

---

## 🛠 Доступные команды

```bash
# Разработка
npm run dev              # Запустить dev-сервер
npm run build            # Production build
npm run start            # Запустить production сервер

# Качество кода
npm run lint             # Проверить код
npm run lint:fix         # Исправить автоматически
npm run format           # Форматировать код
npm run format:check     # Проверить форматирование
npm run type-check       # Проверить типы

# Тестирование
npm test                 # Запустить тесты
npm run test:watch       # Watch mode
npm run test:ui          # UI для тестов
npm run test:coverage    # Coverage report
npm run test:ci          # Тесты для CI (с coverage)

# Валидация (запускает всё)
npm run validate         # type-check + lint + test:ci

# Husky
npm run prepare          # Установить git hooks

# Очистка
npm run clean            # Удалить .next, node_modules, coverage
```

---

## 🐛 Troubleshooting

### Problem: Pre-commit hooks не запускаются

**Решение:**
```bash
# Переустановите Husky
rm -rf .husky
npm run prepare

# На Linux/Mac сделайте исполняемыми
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
```

---

### Problem: CI падает на тестах

**Проверьте:**
1. Тесты проходят локально: `npm test`
2. Все зависимости установлены: `npm ci`
3. Node версия совпадает (20.x)

**Временное решение:**
В `.github/workflows/ci.yml` добавьте `continue-on-error: true` к шагу тестов.

---

### Problem: Deploy не работает

**Проверьте:**
1. Secrets настроены правильно
2. Build проходит локально: `npm run build`
3. Environment variables настроены на платформе

---

### Problem: Commit message validation fails

**Правильный формат:**
```bash
# ✅ Правильно
git commit -m "feat: add new feature"
git commit -m "fix(component): fix bug"

# ❌ Неправильно
git commit -m "added new feature"
git commit -m "bug fix"

# Обойти (не рекомендуется)
git commit --no-verify -m "any message"
```

---

### Problem: Dependabot создаёт слишком много PR

**Решение:**
В `.github/dependabot.yml`:
```yaml
open-pull-requests-limit: 3  # Уменьшите лимит
```

Или отключите для определённых пакетов:
```yaml
ignore:
  - dependency-name: "package-name"
```

---

## 📈 Метрики и бейджи

Добавьте в README.md:

```markdown
![CI](https://github.com/your-username/lead2build-crm/workflows/CI/badge.svg)
![Deploy](https://github.com/your-username/lead2build-crm/workflows/Deploy/badge.svg)
![CodeQL](https://github.com/your-username/lead2build-crm/workflows/CodeQL/badge.svg)
```

---

## 🎯 Best Practices

### 1. Коммиты
- Делайте маленькие, атомарные коммиты
- Используйте conventional commits формат
- Пишите понятные сообщения

### 2. Pull Requests
- Держите PR маленькими (< 50 файлов, < 1000 строк)
- Используйте PR template
- Запрашивайте code review
- Убедитесь, что все checks прошли

### 3. Тестирование
- Пишите тесты для новых функций
- Поддерживайте coverage > 70%
- Запускайте тесты перед push

### 4. Деплой
- Тестируйте на staging перед production
- Используйте feature flags для больших изменений
- Мониторьте ошибки после деплоя

### 5. Безопасность
- Регулярно обновляйте зависимости
- Фиксите security alerts сразу
- Не коммитьте secrets/tokens

---

## 📚 Дополнительные ресурсы

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Husky Documentation](https://typicode.github.io/husky/)
- [Vercel Deployment](https://vercel.com/docs)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

**Готово! CI/CD настроен и работает! 🚀**

*Если возникнут вопросы - создавайте issue в репозитории.*

