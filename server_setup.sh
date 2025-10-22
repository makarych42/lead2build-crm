#!/bin/bash

# Скрипт для настройки сервера Timeweb Cloud
# Выполнить на сервере: bash server_setup.sh

echo "🚀 Начинаем настройку сервера для Next.js проекта..."

# Обновить систему
echo "📦 Обновляем систему..."
apt update && apt upgrade -y

# Установить необходимые пакеты
echo "🔧 Устанавливаем базовые пакеты..."
apt install -y curl wget git unzip

# Установить Node.js 20
echo "📦 Устанавливаем Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Проверить версии
echo "✅ Проверяем версии:"
node --version
npm --version

# Установить PM2
echo "📦 Устанавливаем PM2..."
npm install -g pm2

# Установить Nginx
echo "📦 Устанавливаем Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# Установить SQLite
echo "📦 Устанавливаем SQLite..."
apt install sqlite3 -y

# Создать папку для проекта
echo "📁 Создаем папку для проекта..."
mkdir -p /var/www/lead2build
cd /var/www/lead2build

# Создать пользователя для приложения
echo "👤 Создаем пользователя для приложения..."
useradd -m -s /bin/bash lead2build
chown -R lead2build:lead2build /var/www/lead2build

echo "✅ Базовая настройка сервера завершена!"
echo "📋 Следующие шаги:"
echo "1. Загрузить проект в /var/www/lead2build"
echo "2. Установить зависимости: npm install"
echo "3. Настроить базу данных: npx prisma generate && npx prisma db push"
echo "4. Собрать проект: npm run build"
echo "5. Запустить через PM2: pm2 start npm --name 'lead2build' -- start"
echo "6. Настроить Nginx для проксирования на порт 3000"
