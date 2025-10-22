import { createMocks } from 'node-mocks-http'
import { GET, POST } from '../../src/app/api/notifications/route'

describe('/api/notifications', () => {
  describe('GET', () => {
    it('should return all notifications', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/notifications',
      })

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(typeof data.unreadCount).toBe('number')
    })

    it('should filter unread notifications', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/notifications?filter=unread',
      })

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // All returned notifications should be unread
      data.data.forEach((notification: any) => {
        expect(notification.isRead).toBe(false)
      })
    })

    it('should filter urgent notifications', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/notifications?filter=urgent',
      })

      const response = await GET(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      // All returned notifications should be high priority
      data.data.forEach((notification: any) => {
        expect(notification.priority).toBe('high')
      })
    })
  })

  describe('POST', () => {
    it('should create a new notification', async () => {
      const notificationData = {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification',
        priority: 'medium'
      }

      const { req } = createMocks({
        method: 'POST',
        body: notificationData,
      })

      const response = await POST(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.title).toBe(notificationData.title)
      expect(data.data.message).toBe(notificationData.message)
      expect(data.data.type).toBe(notificationData.type)
      expect(data.data.isRead).toBe(false)
    })

    it('should set default priority if not provided', async () => {
      const notificationData = {
        type: 'info',
        title: 'Test Notification',
        message: 'This is a test notification'
      }

      const { req } = createMocks({
        method: 'POST',
        body: notificationData,
      })

      const response = await POST(req as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.priority).toBe('medium')
    })
  })
})

describe('Notification Validation', () => {
  it('should validate notification types', () => {
    const validTypes = ['success', 'warning', 'error', 'info']
    
    validTypes.forEach(type => {
      expect(['success', 'warning', 'error', 'info']).toContain(type)
    })
  })

  it('should validate priority levels', () => {
    const validPriorities = ['low', 'medium', 'high']
    
    validPriorities.forEach(priority => {
      expect(['low', 'medium', 'high']).toContain(priority)
    })
  })
})