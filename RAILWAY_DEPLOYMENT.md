# Развертывание на Railway - Пошаговая инструкция

## 🚂 Что такое Railway?

Railway - это современная платформа для развертывания приложений, которая:
- ✅ Автоматически развертывает из GitHub
- ✅ Предоставляет базу данных PostgreSQL
- ✅ Включает SSL сертификат
- ✅ Стоит всего $5/месяц
- ✅ Нет ограничений по размеру проекта

## 📋 Шаг 1: Подготовка проекта

### 1.1 Создайте GitHub репозиторий
1. Зайдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `lead2build-crm`
4. Сделайте репозиторий публичным
5. Нажмите "Create repository"

### 1.2 Загрузите проект в GitHub
```bash
# В папке вашего проекта выполните:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/ваш-логин/lead2build-crm.git
git push -u origin main
```

## 🚂 Шаг 2: Настройка Railway

### 2.1 Регистрация
1. Зайдите на [railway.app](https://railway.app)
2. Нажмите "Login"
3. Войдите через GitHub

### 2.2 Создание проекта
1. Нажмите "New Project"
2. Выберите "Deploy from GitHub repo"
3. Найдите ваш репозиторий `lead2build-crm`
4. Нажмите "Deploy Now"

### 2.3 Настройка переменных окружения
В панели Railway добавьте переменные:
```
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_SECRET=ваш-секретный-ключ-измените-это
NEXTAUTH_URL=https://ваш-домен.railway.app
TELEGRAM_BOT_TOKEN=ваш-токен-бота
TELEGRAM_WEBHOOK_URL=https://ваш-домен.railway.app/api/telegram/webhook
```

## 🗄️ Шаг 3: Настройка базы данных

### 3.1 Добавление PostgreSQL
1. В панели Railway нажмите "New"
2. Выберите "Database" → "PostgreSQL"
3. Railway автоматически создаст базу данных

### 3.2 Обновление Prisma схемы
Замените в `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## 🌐 Шаг 4: Подключение домена

### 4.1 Получение домена Railway
1. В настройках проекта найдите "Domains"
2. Railway даст вам домен вида: `ваш-проект.railway.app`

### 4.2 Настройка DNS в Рег.ру
1. Зайдите в панель управления Рег.ру
2. Найдите ваш домен lead2build.ru
3. Перейдите в "DNS записи"
4. Добавьте CNAME запись:
   ```
   CNAME www    ваш-проект.railway.app
   ```
5. Добавьте A запись (получите IP у Railway):
   ```
   A     @      IP-адрес-Railway
   ```

## 🔧 Шаг 5: Обновление проекта для Railway

### 5.1 Обновление package.json
Добавьте скрипт для Railway:
```json
{
  "scripts": {
    "railway:build": "prisma generate && next build",
    "railway:start": "next start"
  }
}
```

### 5.2 Создание railway.json
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run railway:start",
    "healthcheckPath": "/api/health"
  }
}
```

## ✅ Шаг 6: Проверка развертывания

1. Railway автоматически развернет ваш проект
2. Проверьте логи в панели Railway
3. Откройте ваш домен: https://lead2build.ru

## 💰 Стоимость

- **Пробный период**: 30 дней бесплатно
- **После пробного периода**: $5/месяц
- **База данных**: включена в стоимость
- **SSL сертификат**: бесплатно
- **Домен**: бесплатно

## 🔄 Автоматические обновления

После настройки Railway будет автоматически:
- Развертывать изменения при push в GitHub
- Обновлять базу данных при изменении Prisma схемы
- Перезапускать приложение при необходимости

## 🆘 Поддержка

Если возникнут проблемы:
1. Проверьте логи в панели Railway
2. Убедитесь что все переменные окружения настроены
3. Проверьте что база данных подключена
4. Обратитесь в поддержку Railway (отвечают быстро)
