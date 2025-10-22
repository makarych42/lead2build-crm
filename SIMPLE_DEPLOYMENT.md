# Простая инструкция по развертыванию на VPS

## 🖥️ Шаг 1: Аренда VPS

1. Зайдите на сайт провайдера (например, Timeweb.ru)
2. Выберите тариф "VPS" 
3. Выберите Ubuntu 20.04
4. Минимум 1GB RAM, 20GB диска
5. Оформите заказ

## 🔑 Шаг 2: Подключение к серверу

После создания VPS вы получите:
- IP адрес сервера (например: 123.456.789.012)
- Логин: root
- Пароль: (будет отправлен на email)

### Подключение через Windows:
1. Скачайте программу **PuTTY** (бесплатная)
2. Введите IP адрес сервера
3. Нажмите "Open"
4. Введите логин: `root`
5. Введите пароль

## 📦 Шаг 3: Установка Node.js

В терминале сервера выполните команды:

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Проверка установки
node --version
npm --version
```

## 📁 Шаг 4: Загрузка проекта

### Вариант A: Через Git (если проект в GitHub)
```bash
# Установка Git
apt install git -y

# Клонирование проекта
git clone https://github.com/ваш-логин/lead2build-crm.git
cd lead2build-crm/construction-management
```

### Вариант B: Через файловый менеджер
1. Скачайте программу **WinSCP** (бесплатная)
2. Подключитесь к серверу (те же данные что и для PuTTY)
3. Загрузите папку `construction-management` в `/root/`

## ⚙️ Шаг 5: Настройка проекта

```bash
# Переход в папку проекта
cd /root/lead2build-crm/construction-management

# Установка зависимостей
npm install

# Создание файла с переменными окружения
nano .env.production
```

### Содержимое файла .env.production:
```
NODE_ENV=production
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_SECRET="ваш-секретный-ключ-измените-это"
NEXTAUTH_URL="https://lead2build.ru"
TELEGRAM_BOT_TOKEN=""
TELEGRAM_WEBHOOK_URL="https://lead2build.ru/api/telegram/webhook"
```

## 🚀 Шаг 6: Запуск проекта

```bash
# Генерация Prisma Client
npx prisma generate

# Синхронизация базы данных
npx prisma db push

# Сборка проекта
npm run build

# Установка PM2 для управления процессами
npm install -g pm2

# Запуск проекта
pm2 start npm --name "lead2build-crm" -- start:prod

# Сохранение конфигурации PM2
pm2 save
pm2 startup
```

## 🌐 Шаг 7: Настройка DNS

1. Зайдите в панель управления Рег.ру
2. Найдите ваш домен lead2build.ru
3. Перейдите в раздел "DNS записи"
4. Добавьте записи:
   ```
   A     @        123.456.789.012    (IP вашего сервера)
   CNAME www      lead2build.ru
   ```

## 🔒 Шаг 8: SSL сертификат (HTTPS)

```bash
# Установка Nginx
apt install nginx -y

# Установка Certbot для SSL
apt install certbot python3-certbot-nginx -y

# Получение SSL сертификата
certbot --nginx -d lead2build.ru -d www.lead2build.ru
```

## ✅ Готово!

Ваш сайт будет доступен по адресу: **https://lead2build.ru**

## 🔧 Управление проектом

```bash
# Просмотр статуса
pm2 status

# Просмотр логов
pm2 logs lead2build-crm

# Перезапуск
pm2 restart lead2build-crm

# Остановка
pm2 stop lead2build-crm
```
