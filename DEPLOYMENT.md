# Инструкция по развертыванию Lead2Build CRM

## 🚀 Варианты развертывания

### 1. VPS/Сервер (Рекомендуется)

#### Требования к серверу:
- **ОС**: Ubuntu 20.04+ или CentOS 8+
- **RAM**: минимум 2GB (рекомендуется 4GB+)
- **CPU**: 2 ядра
- **Диск**: 20GB+ свободного места
- **Node.js**: версия 18+

#### Установка на сервер:

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установка PM2 для управления процессами
sudo npm install -g pm2

# Клонирование проекта
git clone <your-repo-url> /var/www/lead2build-crm
cd /var/www/lead2build-crm/construction-management

# Установка зависимостей
npm install

# Настройка переменных окружения
cp .env.example .env.production
# Отредактируйте .env.production с вашими настройками

# Сборка проекта
npm run build

# Запуск с PM2
pm2 start npm --name "lead2build-crm" -- start:prod
pm2 save
pm2 startup
```

### 2. Docker (Простой способ)

```bash
# Сборка Docker образа
docker build -t lead2build-crm .

# Запуск контейнера
docker run -d \
  --name lead2build-crm \
  -p 3000:3000 \
  -e DATABASE_URL="file:./prisma/prod.db" \
  -e NEXTAUTH_SECRET="your-secret-key" \
  -e NEXTAUTH_URL="https://lead2build.ru" \
  lead2build-crm
```

### 3. Хостинг провайдеры

#### Vercel (Рекомендуется для Next.js)
1. Подключите GitHub репозиторий к Vercel
2. Настройте переменные окружения в панели Vercel
3. Домен автоматически подключится

#### Netlify
1. Подключите репозиторий к Netlify
2. Настройте build команду: `npm run build`
3. Настройте publish directory: `.next`

## 🔧 Настройка домена

### 1. DNS настройки
Настройте DNS записи у вашего регистратора домена:

```
A     @        YOUR_SERVER_IP
CNAME www      lead2build.ru
```

### 2. SSL сертификат
```bash
# Установка Certbot
sudo apt install certbot

# Получение SSL сертификата
sudo certbot --nginx -d lead2build.ru -d www.lead2build.ru
```

### 3. Nginx конфигурация
```nginx
server {
    listen 80;
    server_name lead2build.ru www.lead2build.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lead2build.ru www.lead2build.ru;

    ssl_certificate /etc/letsencrypt/live/lead2build.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lead2build.ru/privkey.pem;

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
    }
}
```

## 📋 Переменные окружения для продакшена

Создайте файл `.env.production`:

```env
NODE_ENV=production
DATABASE_URL="file:./prisma/prod.db"
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://lead2build.ru"
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
TELEGRAM_WEBHOOK_URL="https://lead2build.ru/api/telegram/webhook"
```

## 🔄 Автоматическое развертывание

### GitHub Actions
Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/lead2build-crm/construction-management
          git pull origin main
          npm install
          npm run build
          pm2 restart lead2build-crm
```

## 📊 Мониторинг

### PM2 мониторинг
```bash
# Просмотр статуса
pm2 status

# Логи
pm2 logs lead2build-crm

# Мониторинг в реальном времени
pm2 monit
```

### Nginx логи
```bash
# Доступ к логам
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🛡️ Безопасность

1. **Firewall**: Настройте UFW или iptables
2. **Обновления**: Регулярно обновляйте систему
3. **Резервные копии**: Настройте автоматические бэкапы базы данных
4. **Мониторинг**: Используйте инструменты мониторинга (например, UptimeRobot)

## 📞 Поддержка

После развертывания ваш CRM будет доступен по адресу: **https://lead2build.ru**
