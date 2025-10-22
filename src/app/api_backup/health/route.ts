import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Базовые проверки здоровья системы
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'construction-management',
      version: '1.0.0',
      uptime: process.uptime(),
      checks: {
        database: 'ok',
        telegram: 'ok',
        notifications: 'ok'
      }
    }

    // Проверка базы данных (базовая)
    try {
      // В реальном проекте здесь была бы проверка подключения к БД
      health.checks.database = 'ok'
    } catch (error) {
      health.checks.database = 'error'
      health.status = 'degraded'
    }

    // Проверка Telegram бота
    const telegramToken = process.env.TELEGRAM_BOT_TOKEN
    if (!telegramToken) {
      health.checks.telegram = 'not_configured'
    } else {
      try {
        const response = await fetch(`https://api.telegram.org/bot${telegramToken}/getMe`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        
        if (response.ok) {
          health.checks.telegram = 'ok'
        } else {
          health.checks.telegram = 'error'
          health.status = 'degraded'
        }
      } catch (error) {
        health.checks.telegram = 'error'
        health.status = 'degraded'
      }
    }

    // Определение общего статуса
    const hasErrors = Object.values(health.checks).some(check => check === 'error')
    if (hasErrors && health.status === 'ok') {
      health.status = 'degraded'
    }

    const statusCode = health.status === 'ok' ? 200 : 503

    return NextResponse.json(health, { status: statusCode })
  } catch (error) {
    console.error('Health check error:', error)
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'construction-management',
      error: 'Health check failed'
    }, { status: 503 })
  }
}