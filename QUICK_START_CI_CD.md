# ⚡️ Quick Start - CI/CD Setup

Быстрая настройка CI/CD за 5 минут!

## 🎯 Что получите

- ✅ Автоматические тесты на каждый push/PR
- ✅ Проверка кода перед коммитом
- ✅ Автодеплой на production
- ✅ Security сканирование
- ✅ Performance аудит

---

## 📋 Шаг 1: Установка зависимостей (1 мин)

```bash
# Установите Husky, lint-staged, prettier
npm install -D husky lint-staged prettier

# Инициализация git hooks
npm run prepare
```

**Windows (PowerShell как администратор):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 🔧 Шаг 2: Настройка GitHub (2 мин)

### 2.1 Создайте репозиторий на GitHub

```bash
# Инициализируйте git (если ещё не сделали)
git init
git add .
git commit -m "feat: initial commit with CI/CD setup"

# Добавьте remote
git remote add origin https://github.com/ваш-username/lead2build-crm.git
git branch -M main
git push -u origin main
```

### 2.2 Включите GitHub Actions

1. Откройте репозиторий на GitHub
2. Вкладка **Actions**
3. Нажмите "I understand my workflows, go ahead and enable them"

**Готово!** Теперь при каждом push будут запускаться:
- ✅ CI (тесты, линтинг, типы)
- ✅ Security audit
- ✅ PR checks

---

## 🚀 Шаг 3: Настройка деплоя (2 мин)

### Вариант A: Vercel (рекомендуется, бесплатно)

1. Откройте https://vercel.com
2. Нажмите "New Project"
3. Импортируйте GitHub репозиторий
4. Vercel автоматически настроит всё!

**Автодеплой работает!** При push в `main` → деплой на production.

---

### Вариант B: Netlify (альтернатива)

1. Откройте https://netlify.com
2. "Add new site" → "Import from Git"
3. Выберите репозиторий
4. Build command: `npm run build`
5. Publish directory: `.next`

---

### Вариант C: Настроить GitHub Actions для деплоя

**Для Vercel:**

1. Получите токен: https://vercel.com/account/tokens
2. Выполните первый деплой: `npx vercel` (локально)
3. Скопируйте из `.vercel/project.json`:
   - `orgId` → `VERCEL_ORG_ID`
   - `projectId` → `VERCEL_PROJECT_ID`

4. Добавьте secrets в GitHub:
   - Settings → Secrets and variables → Actions → New repository secret
   - `VERCEL_TOKEN` = ваш токен
   - `VERCEL_ORG_ID` = из project.json
   - `VERCEL_PROJECT_ID` = из project.json

**Готово!** Push в `main` → автодеплой через GitHub Actions.

---

## ✅ Шаг 4: Проверка (1 мин)

### Проверьте pre-commit hooks:

```bash
# Создайте тестовый коммит
git add .
git commit -m "test: check pre-commit hooks"

# Должно запуститься:
# ✅ Lint-staged (ESLint + Prettier)
# ✅ Type check
```

### Проверьте commit message validation:

```bash
# ❌ Это должно упасть
git commit -m "test commit"

# ✅ Это должно пройти
git commit -m "test: check commit message validation"
```

### Проверьте CI на GitHub:

1. Push в GitHub: `git push`
2. Откройте Actions на GitHub
3. Смотрите, как запускаются workflows! 🎉

---

## 🎨 Опционально: Настройте Dependabot

Откройте `.github/dependabot.yml` и замените:

```yaml
reviewers:
  - "ваш-github-username"
assignees:
  - "ваш-github-username"
```

Dependabot будет создавать PR для обновления зависимостей каждую неделю.

---

## 🛡 Опционально: Branch Protection

**Для `main` ветки (Settings → Branches):**

1. ✅ Require pull request before merging
2. ✅ Require status checks: CI, build, test
3. ✅ Require conversation resolution
4. ✅ Do not allow bypassing

Теперь нельзя напрямую пушить в `main` - только через PR!

---

## 📊 Опционально: Добавьте бейджи в README

```markdown
![CI](https://github.com/ваш-username/lead2build-crm/workflows/CI/badge.svg)
![Deploy](https://github.com/ваш-username/lead2build-crm/workflows/Deploy/badge.svg)
```

---

## 🎉 Готово!

Теперь у вас есть:

✅ **Pre-commit hooks** - проверяют код перед коммитом  
✅ **CI/CD pipeline** - автотесты на каждый push/PR  
✅ **Автодеплой** - при push в main → production  
✅ **Security scanning** - CodeQL + npm audit  
✅ **Dependabot** - автообновление зависимостей  

---

## 🧪 Проверьте workflow

Создайте PR:

```bash
# Создайте новую ветку
git checkout -b feature/test-ci

# Сделайте изменение
echo "console.log('test')" >> test.js

# Коммит (с правильным форматом!)
git add .
git commit -m "test: add test file for CI"

# Push
git push origin feature/test-ci
```

Откройте GitHub → создайте PR → посмотрите, как запускаются все проверки! 🚀

---

## 📚 Дальше

Прочитайте [CI_CD_GUIDE.md](./CI_CD_GUIDE.md) для подробной документации.

---

**Happy coding! 🎉**

