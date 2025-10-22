# ⚡️ Быстрая шпаргалка по деплою

## ✅ Уже сделано за вас
- Prisma → PostgreSQL ✅
- Vercel конфигурация ✅
- Git init + commit ✅

## 🚀 Что нужно сделать (5 шагов)

### 1️⃣ Создать GitHub репозиторий
👉 https://github.com/new
- Name: `lead2build-crm`
- ❌ НЕ добавляйте README/gitignore

### 2️⃣ Залить код на GitHub
```powershell
cd Z:\gighub\lead2build-crm
git remote add origin https://github.com/YOUR_USERNAME/lead2build-crm.git
git branch -M main
git push -u origin main
```

### 3️⃣ Зарегистрироваться на Vercel
👉 https://vercel.com/signup
- "Continue with GitHub"

### 4️⃣ Импортировать проект
- "Add New" → "Project"
- Выбрать `lead2build-crm`
- **Перед Deploy** → создать БД!

### 5️⃣ Создать PostgreSQL БД
- Storage → Create Database → Postgres
- Region: Washington DC
- После создания → нажать **Deploy**

## 🎯 Результат
Через 5-7 минут получите:
- 🌐 `https://lead2build-crm.vercel.app`
- Отправляйте ссылку заказчикам!

## 📖 Подробная инструкция
См. **DEPLOYMENT_INSTRUCTIONS.md**

## ⚠️ Важно
База создана, но приложение пока использует localStorage.
Для работы с PostgreSQL нужны API routes (отдельная задача).

Сейчас это **демо-версия** для показа заказчикам! ✨

