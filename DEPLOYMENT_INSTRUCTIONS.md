# 🚀 Инструкция по деплою на Vercel

## ✅ Что уже сделано

- ✅ Prisma schema обновлен для PostgreSQL
- ✅ Создана конфигурация Vercel (`vercel.json`)
- ✅ Обновлен build скрипт в package.json
- ✅ Git репозиторий инициализирован
- ✅ Первый коммит создан

---

## 📋 Следующие шаги (выполните сами)

### Шаг 1: Создайте GitHub репозиторий

1. **Откройте в браузере:** https://github.com/new

2. **Настройки репозитория:**
   - Repository name: `lead2build-crm`
   - Description: `CRM система для контроля процесса голосования жильцов`
   - Visibility: **Public** (или Private, если хотите)
   - ⚠️ **НЕ СТАВЬТЕ галочки:**
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license

3. **Нажмите:** "Create repository"

4. **Скопируйте** URL репозитория (будет показан на следующей странице)
   - Формат: `https://github.com/ваш-username/lead2build-crm.git`

---

### Шаг 2: Подключите локальный проект к GitHub

Откройте PowerShell в папке проекта и выполните:

```powershell
cd Z:\gighub\lead2build-crm

# Замените YOUR_GITHUB_USERNAME на ваш реальный username!
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/lead2build-crm.git

# Переименуйте ветку в main
git branch -M main

# Залейте код на GitHub
git push -u origin main
```

**Пример для пользователя "ivanov":**
```powershell
git remote add origin https://github.com/ivanov/lead2build-crm.git
git branch -M main
git push -u origin main
```

Вас могут попросить ввести логин/пароль GitHub или использовать Personal Access Token.

---

### Шаг 3: Зарегистрируйтесь на Vercel

1. **Откройте:** https://vercel.com/signup

2. **Выберите:** "Continue with GitHub"

3. **Разрешите Vercel** доступ к вашему GitHub аккаунту

4. Вы попадёте в Vercel Dashboard

---

### Шаг 4: Импортируйте проект в Vercel

1. **В Vercel Dashboard** нажмите: **"Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Найдите репозиторий `lead2build-crm`
   - Нажмите **"Import"**

3. **Configure Project:**
   - Framework Preset: **Next.js** (определится автоматически)
   - Root Directory: `./` (оставьте по умолчанию)
   - Build Command: `prisma generate && next build` (должно быть автоматически)
   - Output Directory: `.next` (по умолчанию)
   
4. **Пока НЕ нажимайте Deploy!** Сначала настроим базу данных.

---

### Шаг 5: Создайте PostgreSQL базу данных

1. **В настройках проекта Vercel** перейдите:
   - **Storage** (вкладка сверху)

2. **Create Database:**
   - Нажмите **"Create Database"**
   - Выберите **"Postgres"**

3. **Настройки БД:**
   - Database Name: `lead2build-crm-db` (или любое другое)
   - Region: **Washington, D.C., USA (iad1)** (ближайший к вам)
   
4. **Нажмите:** "Create"

5. **Важно!** Vercel автоматически добавит переменную `DATABASE_URL` в Environment Variables вашего проекта

6. **Скопируйте строку подключения:**
   - Во вкладке "Quickstart" или "Connection String"
   - Она понадобится для локального применения миграций

---

### Шаг 6: Первый деплой

1. **Вернитесь во вкладку** "Deployments" (или "Overview")

2. **Нажмите:** **"Deploy"** (большая синяя кнопка)

3. **Vercel начнёт деплой:**
   - ⏳ Installing dependencies... (~2 мин)
   - ⏳ Running `prisma generate`...
   - ⏳ Building Next.js app... (~3 мин)
   - ⏳ Deploying... (~30 сек)

4. **После успешного деплоя** вы увидите:
   - ✅ "Your project has been deployed"
   - 🌐 URL типа: `https://lead2build-crm.vercel.app`

5. **Нажмите на URL** чтобы открыть сайт

⚠️ **Сайт откроется, но будет пустой** - нужно применить миграции к БД!

---

### Шаг 7: Примените миграции к базе данных

#### Вариант А: Через Vercel Postgres Console (рекомендуется)

1. **В Vercel** → **Storage** → **Ваша БД** → **Data** → **Query**

2. **Выполните SQL** для создания таблиц:

```sql
-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageHistory" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "stage" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StageHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StageHistory" ADD CONSTRAINT "StageHistory_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

3. **Нажмите:** "Run Query"

4. **Готово!** База данных настроена.

#### Вариант Б: Через локальный Prisma (требует настройки)

1. **Скопируйте DATABASE_URL** из Vercel (Storage → ваша БД → Quickstart)

2. **Создайте файл `.env`** в корне проекта:
```
DATABASE_URL="postgresql://user:password@hostname:5432/dbname?sslmode=require"
```

3. **Выполните миграцию:**
```powershell
npx prisma migrate dev --name init
npx prisma migrate deploy
```

---

### Шаг 8: Проверьте работу сайта

1. **Откройте ваш Vercel URL:** `https://lead2build-crm.vercel.app`

2. **Проверьте функциональность:**
   - ✅ Главная страница загружается
   - ✅ Вкладки переключаются
   - ✅ Можно создать лид
   - ✅ Данные сохраняются (в localStorage пока что)

3. **Отправьте ссылку заказчикам!** 🎉

---

## 🎯 Что вы получили

- ✅ **Production URL:** `https://lead2build-crm.vercel.app`
- ✅ **PostgreSQL база данных** (бесплатно 256MB)
- ✅ **Автоматический SSL** сертификат (HTTPS)
- ✅ **Автодеплой:** каждый `git push` → новая версия сайта
- ✅ **Preview URLs:** для каждого Pull Request
- ✅ **Analytics** в Vercel Dashboard
- ✅ **Логи** и мониторинг

---

## ⚠️ Важные замечания

### 1. Данные из localStorage не перенесутся
Сейчас приложение использует localStorage (данные в браузере). На production сайте БД будет пустая.

**Решения:**
- **Для демо:** Создайте тестовые данные прямо в production
- **Для реального использования:** Нужно интегрировать Prisma API routes

### 2. Сейчас приложение работает на localStorage
База данных создана, но приложение её не использует (используются Zustand stores с localStorage).

**Чтобы использовать PostgreSQL:**
Нужно создать API routes для работы с БД (это отдельная задача).

### 3. Бесплатный план Vercel
- ✅ 100GB bandwidth/месяц
- ✅ Unlimited deployments
- ✅ Автоматический SSL
- ⚠️ Hobby план (не для коммерческого использования)

### 4. PostgreSQL от Vercel (бесплатно)
- ✅ 256MB storage
- ✅ 60 hours compute/месяц
- ✅ 256 MB RAM
- ⚠️ Достаточно для демо, но не для production с нагрузкой

---

## 🔄 Автодеплой

Теперь при каждом изменении кода:

```powershell
# Делаете изменения в коде
git add .
git commit -m "feat: добавил новую функцию"
git push

# Vercel автоматически:
# 1. Обнаружит push
# 2. Соберёт новую версию
# 3. Задеплоит её
# 4. ~3-5 минут и новая версия live!
```

---

## 🆘 Troubleshooting

### Проблема: Build failed
**Решение:** Проверьте логи в Vercel → Deployments → Failed build → View logs

### Проблема: База данных не работает
**Решение:** 
1. Проверьте что миграции применены (Шаг 7)
2. Проверьте что `DATABASE_URL` есть в Environment Variables

### Проблема: Сайт не открывается
**Решение:**
1. Подождите 2-3 минуты после деплоя
2. Проверьте статус в Vercel Dashboard
3. Проверьте логи deployment

### Проблема: git push просит пароль
**Решение:** Используйте Personal Access Token вместо пароля:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Выберите `repo` scope
3. Используйте token как пароль

---

## 📞 Дополнительная помощь

**Vercel Documentation:** https://vercel.com/docs
**Prisma Documentation:** https://www.prisma.io/docs
**Next.js Documentation:** https://nextjs.org/docs

---

## 🎉 Поздравляем!

Ваш проект теперь в production и доступен всему миру!

Отправьте ссылку заказчикам: `https://lead2build-crm.vercel.app`

**Удачи! 🚀**

