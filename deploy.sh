#!/bin/bash

# Скрипт для развертывания Next.js проекта
# Выполнить в папке проекта на сервере

echo "🚀 Развертываем Next.js проект..."

# Перейти в папку проекта
cd /var/www/lead2build

# Установить зависимости
echo "📦 Устанавливаем зависимости..."
npm install

# Настроить переменные окружения
echo "🔧 Настраиваем переменные окружения..."
cat > .env.local << EOF
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://lead2build.ru"
EOF

# Сгенерировать Prisma клиент
echo "🗄️ Настраиваем базу данных..."
npx prisma generate

# Создать базу данных
npx prisma db push

# Собрать проект
echo "🔨 Собираем проект..."
npm run build

# Остановить существующий процесс (если есть)
pm2 stop lead2build 2>/dev/null || true
pm2 delete lead2build 2>/dev/null || true

# Запустить проект через PM2
echo "🚀 Запускаем проект..."
pm2 start npm --name "lead2build" -- start
pm2 save
pm2 startup

# Настроить Nginx
echo "🌐 Настраиваем Nginx..."
cp nginx_config.conf /etc/nginx/sites-available/lead2build
ln -sf /etc/nginx/sites-available/lead2build /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Проверить конфигурацию Nginx
nginx -t

# Перезагрузить Nginx
systemctl reload nginx

echo "✅ Проект успешно развернут!"
echo "🌐 Сайт доступен по адресу: http://lead2build.ru"
echo "📊 Статус PM2: pm2 status"
echo "📝 Логи: pm2 logs lead2build"