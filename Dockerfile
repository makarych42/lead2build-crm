# Dockerfile для Next.js приложения
FROM node:18-alpine AS base

# Установка зависимостей только когда нужно
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Установка зависимостей
COPY package.json package-lock.json* ./
RUN npm ci

# Пересборка исходного кода только когда нужно
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Генерация Prisma Client
RUN npx prisma generate

# Сборка приложения
RUN npm run build

# Продакшен образ, скопируем все файлы и запустим next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Автоматически используем output traces для уменьшения размера образа
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Копируем Prisma файлы
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
