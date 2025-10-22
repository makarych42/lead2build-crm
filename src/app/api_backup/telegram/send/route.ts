import { NextRequest, NextResponse } from 'next/server'
import TelegramService from '../../../../lib/telegram'

const telegramService = new TelegramService(
  process.env.TELEGRAM_BOT_TOKEN || ''
)

// POST - отправка сообщения или рассылки
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    switch (type) {
      case 'broadcast':
        return await handleBroadcast(data)
      case 'voting_notification':
        return await handleVotingNotification(data)
      case 'deadline_reminder':
        return await handleDeadlineReminder(data)
      case 'voting_results':
        return await handleVotingResults(data)
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown message type' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Telegram send error:', error)
    return NextResponse.json(
      { success: false, error: 'Message sending failed' },
      { status: 500 }
    )
  }
}

async function handleBroadcast(data: {
  message: string
  userIds: number[]
  keyboard?: any
}) {
  const result = await telegramService.sendBroadcast(
    data.userIds,
    data.message,
    data.keyboard
  )

  return NextResponse.json({
    success: true,
    result: {
      sent: result.sent,
      failed: result.failed,
      total: data.userIds.length
    }
  })
}

async function handleVotingNotification(data: {
  chatId: number
  votingData: {
    address: string
    date: string
    time: string
    topic: string
    meetingUrl?: string
  }
}) {
  const success = await telegramService.sendVotingNotification(
    data.chatId,
    data.votingData
  )

  return NextResponse.json({
    success,
    message: success ? 'Voting notification sent' : 'Failed to send notification'
  })
}

async function handleDeadlineReminder(data: {
  chatId: number
  reminderData: {
    address: string
    deadline: string
    task: string
    daysLeft: number
  }
}) {
  const success = await telegramService.sendDeadlineReminder(
    data.chatId,
    data.reminderData
  )

  return NextResponse.json({
    success,
    message: success ? 'Deadline reminder sent' : 'Failed to send reminder'
  })
}

async function handleVotingResults(data: {
  chatId: number
  resultsData: {
    address: string
    topic: string
    totalVotes: number
    yesVotes: number
    noVotes: number
    percentage: number
    approved: boolean
  }
}) {
  const success = await telegramService.sendVotingResults(
    data.chatId,
    data.resultsData
  )

  return NextResponse.json({
    success,
    message: success ? 'Voting results sent' : 'Failed to send results'
  })
}