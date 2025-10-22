import { NextRequest, NextResponse } from 'next/server'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  leadId?: string
  stage?: string
  priority: 'low' | 'medium' | 'high'
  actionRequired?: boolean
}

// Временное хранилище уведомлений
let notifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Истекает срок подготовки документов',
    message: 'Дом по адресу ул. Ленина, 15 - осталось 2 дня для подготовки документов',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isRead: false,
    leadId: 'lead-1',
    stage: 'Подготовка документов',
    priority: 'high',
    actionRequired: true
  }
]

// GET - получить все уведомления
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter')
    
    let filteredNotifications = [...notifications]
    
    if (filter === 'unread') {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead)
    } else if (filter === 'urgent') {
      filteredNotifications = filteredNotifications.filter(n => n.priority === 'high')
    }
    
    filteredNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    
    return NextResponse.json({
      success: true,
      data: filteredNotifications,
      unreadCount: notifications.filter(n => !n.isRead).length
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ошибка получения уведомлений' },
      { status: 500 }
    )
  }
}

// POST - создать новое уведомление
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newNotification: Notification = {
      id: Date.now().toString(),
      ...body,
      timestamp: new Date(),
      isRead: false,
      priority: body.priority || 'medium'
    }
    
    notifications.unshift(newNotification)
    
    return NextResponse.json({
      success: true,
      data: newNotification
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Ошибка создания уведомления' },
      { status: 500 }
    )
  }
}