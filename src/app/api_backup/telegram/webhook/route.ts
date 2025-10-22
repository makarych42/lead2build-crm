import { NextRequest, NextResponse } from 'next/server'
import TelegramService from '../../../../lib/telegram'

// Инициализация Telegram сервиса
const telegramService = new TelegramService(
  process.env.TELEGRAM_BOT_TOKEN || ''
)

// POST - webhook для получения сообщений от Telegram
export async function POST(request: NextRequest) {
  try {
    const update = await request.json()
    
    // Обработка входящего обновления
    await telegramService.handleWebhook(update)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Telegram webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing error' },
      { status: 500 }
    )
  }
}

// GET - получение информации о боте
export async function GET() {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    
    if (!botToken) {
      return NextResponse.json({
        success: false,
        error: 'Bot token not configured'
      })
    }

    // Проверка статуса бота
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
    const botInfo = await response.json()
    
    if (botInfo.ok) {
      return NextResponse.json({
        success: true,
        bot: botInfo.result,
        status: 'connected'
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid bot token',
        status: 'disconnected'
      })
    }
  } catch (error) {
    console.error('Bot status check error:', error)
    return NextResponse.json({
      success: false,
      error: 'Status check failed',
      status: 'disconnected'
    })
  }
}