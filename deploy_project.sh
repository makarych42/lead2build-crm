#!/bin/bash

echo "🚀 Развертываем Next.js проект..."

# Перейти в папку проекта
cd /var/www/lead2build

# Установить зависимости
echo "📦 Устанавливаем зависимости..."
npm install

# Настроить переменные окружения
echo "🔧 Настраиваем переменные окружения..."
cat > .env.local << EOF
DATABASE_URL="file:./prod.db"
NEXTAUTH_SECRET="lead2build-production-secret-key-2024"
NEXTAUTH_URL="http://lead2build.ru"
NODE_ENV="production"
PORT=3000
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
cat > /etc/nginx/sites-available/lead2build << 'EOF'
server {
    listen 80;
    server_name lead2build.ru www.lead2build.ru;

    # Логи
    access_log /var/log/nginx/lead2build_access.log;
    error_log /var/log/nginx/lead2build_error.log;

    # Основное приложение
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Статические файлы
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }

    # Безопасность
    location ~ /\. {
        deny all;
    }
}
EOF

# Активировать конфигурацию
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
