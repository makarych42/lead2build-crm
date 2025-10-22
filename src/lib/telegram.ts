// Telegram Bot API интеграция
export interface TelegramConfig {
  botToken: string
  webhookUrl?: string
}

export interface TelegramUser {
  id: number
  firstName: string
  lastName?: string
  username?: string
  chatId: number
  role: 'resident' | 'manager' | 'admin'
  address?: string
  leadId?: string
  notifications: boolean
}

export interface TelegramMessage {
  chatId: number
  text: string
  parseMode?: 'HTML' | 'Markdown'
  replyMarkup?: TelegramKeyboard
}

export interface TelegramKeyboard {
  inline_keyboard?: Array<Array<{
    text: string
    callback_data?: string
    url?: string
  }>>
  keyboard?: Array<Array<{
    text: string
  }>>
  resize_keyboard?: boolean
  one_time_keyboard?: boolean
}

class TelegramService {
  private botToken: string
  private baseUrl: string

  constructor(botToken: string) {
    this.botToken = botToken
    this.baseUrl = `https://api.telegram.org/bot${botToken}`
  }

  // Отправка текстового сообщения
  async sendMessage(message: TelegramMessage): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: message.chatId,
          text: message.text,
          parse_mode: message.parseMode || 'HTML',
          reply_markup: message.replyMarkup,
        }),
      })

      const result = await response.json()
      return result.ok
    } catch (error) {
      console.error('Telegram send message error:', error)
      return false
    }
  }

  // Массовая рассылка
  async sendBroadcast(userIds: number[], text: string, keyboard?: TelegramKeyboard): Promise<{
    sent: number
    failed: number
  }> {
    let sent = 0
    let failed = 0

    for (const chatId of userIds) {
      const success = await this.sendMessage({
        chatId,
        text,
        replyMarkup: keyboard,
      })

      if (success) {
        sent++
      } else {
        failed++
      }

      // Пауза между отправками для избежания лимитов API
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    return { sent, failed }
  }

  // Отправка уведомления о голосовании
  async sendVotingNotification(chatId: number, votingData: {
    address: string
    date: string
    time: string
    topic: string
    meetingUrl?: string
  }): Promise<boolean> {
    const keyboard: TelegramKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ Буду участвовать', callback_data: `vote_yes_${votingData.address}` },
          { text: '❌ Не смогу', callback_data: `vote_no_${votingData.address}` }
        ],
        votingData.meetingUrl ? [
          { text: '🔗 Подключиться к голосованию', url: votingData.meetingUrl }
        ] : []
      ].filter(row => row.length > 0)
    }

    const text = `
🏠 <b>Уведомление о голосовании</b>

📍 <b>Адрес:</b> ${votingData.address}
📅 <b>Дата:</b> ${votingData.date}
⏰ <b>Время:</b> ${votingData.time}
📋 <b>Тема:</b> ${votingData.topic}

Просим принять участие в голосовании по вопросу модернизации вашего дома.
    `

    return this.sendMessage({
      chatId,
      text: text.trim(),
      replyMarkup: keyboard
    })
  }

  // Отправка напоминания о дедлайне
  async sendDeadlineReminder(chatId: number, reminderData: {
    address: string
    deadline: string
    task: string
    daysLeft: number
  }): Promise<boolean> {
    const urgencyIcon = reminderData.daysLeft <= 1 ? '🚨' : reminderData.daysLeft <= 3 ? '⚠️' : 'ℹ️'
    
    const text = `
${urgencyIcon} <b>Напоминание о дедлайне</b>

📍 <b>Адрес:</b> ${reminderData.address}
📋 <b>Задача:</b> ${reminderData.task}
⏰ <b>Дедлайн:</b> ${reminderData.deadline}
⏳ <b>Осталось дней:</b> ${reminderData.daysLeft}

${reminderData.daysLeft <= 1 ? 
  'СРОЧНО! Время почти истекло!' : 
  'Пожалуйста, не забудьте выполнить необходимые действия.'
}
    `

    const keyboard: TelegramKeyboard = {
      inline_keyboard: [
        [
          { text: '✅ Выполнено', callback_data: `task_done_${reminderData.address}` },
          { text: '❓ Нужна помощь', callback_data: `help_${reminderData.address}` }
        ]
      ]
    }

    return this.sendMessage({
      chatId,
      text: text.trim(),
      replyMarkup: keyboard
    })
  }

  // Отправка результатов голосования
  async sendVotingResults(chatId: number, resultsData: {
    address: string
    topic: string
    totalVotes: number
    yesVotes: number
    noVotes: number
    percentage: number
    approved: boolean
  }): Promise<boolean> {
    const statusIcon = resultsData.approved ? '✅' : '❌'
    const statusText = resultsData.approved ? 'ОДОБРЕНО' : 'ОТКЛОНЕНО'

    const text = `
${statusIcon} <b>Результаты голосования</b>

📍 <b>Адрес:</b> ${resultsData.address}
📋 <b>Тема:</b> ${resultsData.topic}

📊 <b>Результаты:</b>
• Всего голосов: ${resultsData.totalVotes}
• За: ${resultsData.yesVotes} (${resultsData.percentage}%)
• Против: ${resultsData.noVotes}

🏆 <b>Решение:</b> ${statusText}

${resultsData.approved ? 
  'Поздравляем! Предложение одобрено и будет реализовано.' :
  'Предложение не набрало необходимого количества голосов.'
}
    `

    return this.sendMessage({
      chatId,
      text: text.trim()
    })
  }

  // Обработка входящих сообщений (webhook)
  async handleWebhook(update: any): Promise<void> {
    try {
      if (update.message) {
        await this.handleMessage(update.message)
      } else if (update.callback_query) {
        await this.handleCallbackQuery(update.callback_query)
      }
    } catch (error) {
      console.error('Telegram webhook error:', error)
    }
  }

  private async handleMessage(message: any): Promise<void> {
    const chatId = message.chat.id
    const text = message.text
    const userId = message.from.id

    // Обработка команд
    if (text.startsWith('/start')) {
      await this.sendWelcomeMessage(chatId, userId)
    } else if (text.startsWith('/help')) {
      await this.sendHelpMessage(chatId)
    } else if (text.startsWith('/register')) {
      await this.handleRegistration(chatId, userId, text)
    } else if (text.startsWith('/status')) {
      await this.sendStatusInfo(chatId, userId)
    }
  }

  private async handleCallbackQuery(callbackQuery: any): Promise<void> {
    const chatId = callbackQuery.message.chat.id
    const data = callbackQuery.data
    const userId = callbackQuery.from.id

    if (data.startsWith('vote_')) {
      await this.handleVoteCallback(chatId, userId, data)
    } else if (data.startsWith('task_done_')) {
      await this.handleTaskDoneCallback(chatId, userId, data)
    } else if (data.startsWith('help_')) {
      await this.handleHelpRequest(chatId, userId, data)
    }
  }

  private async sendWelcomeMessage(chatId: number, userId: number): Promise<void> {
    const keyboard: TelegramKeyboard = {
      keyboard: [
        [{ text: '🏠 Мои объекты' }, { text: '📊 Статус проектов' }],
        [{ text: '🔔 Настройки уведомлений' }, { text: '❓ Помощь' }]
      ],
      resize_keyboard: true
    }

    const text = `
👋 Добро пожаловать в систему управления строительством!

Я помогу вам отслеживать процесс подготовки вашего дома к модернизации.

🔹 Получайте уведомления о важных событиях
🔹 Участвуйте в голосованиях
🔹 Отслеживайте статус проектов
🔹 Получайте напоминания о дедлайнах

Для начала работы введите команду:
/register [ваш адрес]

Например: /register ул. Ленина, 15
    `

    await this.sendMessage({
      chatId,
      text: text.trim(),
      replyMarkup: keyboard
    })
  }

  private async sendHelpMessage(chatId: number): Promise<void> {
    const text = `
❓ <b>Помощь по использованию бота</b>

<b>Доступные команды:</b>
• /start - Начать работу с ботом
• /register [адрес] - Зарегистрироваться
• /status - Статус ваших проектов
• /help - Показать эту справку

<b>Возможности:</b>
🔔 Уведомления о голосованиях
⏰ Напоминания о дедлайнах
📊 Информация о статусе проектов
✅ Подтверждение выполнения задач

<b>Нужна помощь?</b>
Свяжитесь с нашей службой поддержки:
📞 +7 (XXX) XXX-XX-XX
📧 support@construction.ru
    `

    await this.sendMessage({
      chatId,
      text: text.trim()
    })
  }

  private async handleRegistration(chatId: number, userId: number, text: string): Promise<void> {
    const address = text.replace('/register', '').trim()
    
    if (!address) {
      await this.sendMessage({
        chatId,
        text: '❌ Пожалуйста, укажите адрес.\nПример: /register ул. Ленина, 15'
      })
      return
    }

    // Здесь должна быть логика сохранения пользователя в базу данных
    await this.sendMessage({
      chatId,
      text: `✅ Регистрация успешна!

📍 Адрес: ${address}

Вы будете получать уведомления о проектах по этому адресу.`
    })
  }

  private async sendStatusInfo(chatId: number, userId: number): Promise<void> {
    // Здесь должна быть логика получения статуса проектов пользователя
    const text = `
📊 <b>Статус ваших проектов</b>

🏠 <b>ул. Ленина, 15</b>
• Этап: Подготовка документов
• Прогресс: 60%
• Следующий дедлайн: 25.09.2025

🏠 <b>ул. Мира, 8</b>
• Этап: Голосование
• Прогресс: 80%
• Голосование: 23.09.2025 в 18:00
    `

    await this.sendMessage({
      chatId,
      text: text.trim()
    })
  }

  private async handleVoteCallback(chatId: number, userId: number, data: string): Promise<void> {
    const vote = data.includes('vote_yes') ? 'yes' : 'no'
    const address = data.split('_').slice(2).join('_')

    // Здесь должна быть логика сохранения голоса
    await this.sendMessage({
      chatId,
      text: `✅ Ваш голос учтен!\n\n📍 ${address}\n🗳️ Выбор: ${vote === 'yes' ? 'Буду участвовать' : 'Не смогу участвовать'}`
    })
  }

  private async handleTaskDoneCallback(chatId: number, userId: number, data: string): Promise<void> {
    const address = data.split('_').slice(2).join('_')

    await this.sendMessage({
      chatId,
      text: `✅ Отлично! Задача отмечена как выполненная.\n\n📍 ${address}`
    })
  }

  private async handleHelpRequest(chatId: number, userId: number, data: string): Promise<void> {
    const address = data.split('_').slice(1).join('_')

    const keyboard: TelegramKeyboard = {
      inline_keyboard: [
        [
          { text: '📞 Позвонить', callback_data: `call_${address}` },
          { text: '📧 Написать', callback_data: `email_${address}` }
        ]
      ]
    }

    await this.sendMessage({
      chatId,
      text: `❓ Нужна помощь по проекту?

📍 ${address}

Выберите способ связи:`,
      replyMarkup: keyboard
    })
  }
}

export default TelegramService