import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
  TelegramConnection,
  TelegramNotification,
  TelegramSettings,
  AutomationRule,
} from '@/types'

interface TelegramState {
  connections: TelegramConnection[]
  notifications: TelegramNotification[]
  settings: TelegramSettings | null
  automationRules: AutomationRule[]
  isInitialized: boolean
  
  // Actions - Connections
  setConnections: (connections: TelegramConnection[]) => void
  addConnection: (connection: TelegramConnection) => void
  updateConnection: (userId: string, updates: Partial<TelegramConnection>) => void
  deleteConnection: (userId: string) => void
  
  // Actions - Notifications
  setNotifications: (notifications: TelegramNotification[]) => void
  addNotification: (notification: TelegramNotification) => void
  markNotificationAsRead: (id: string) => void
  clearNotifications: () => void
  
  // Actions - Settings
  setSettings: (settings: TelegramSettings) => void
  updateSettings: (updates: Partial<TelegramSettings>) => void
  
  // Actions - Automation Rules
  setAutomationRules: (rules: AutomationRule[]) => void
  addAutomationRule: (rule: AutomationRule) => void
  updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => void
  deleteAutomationRule: (id: string) => void
  toggleAutomationRule: (id: string) => void
  
  // Queries
  getConnectionByUserId: (userId: string) => TelegramConnection | undefined
  getActiveConnections: () => TelegramConnection[]
  getUnreadNotifications: () => TelegramNotification[]
  getActiveAutomationRules: () => AutomationRule[]
  getAutomationRulesByTrigger: (trigger: string) => AutomationRule[]
}

export const useTelegramStore = create<TelegramState>()(
  persist(
    (set, get) => ({
      connections: [],
      notifications: [],
      settings: null,
      automationRules: [],
      isInitialized: false,

      // Actions - Connections
      setConnections: (connections) => set({ connections, isInitialized: true }),

      addConnection: (connection) =>
        set((state) => ({
          connections: [...state.connections, connection],
        })),

      updateConnection: (userId, updates) =>
        set((state) => ({
          connections: state.connections.map((conn) =>
            conn.userId === userId ? { ...conn, ...updates } : conn
          ),
        })),

      deleteConnection: (userId) =>
        set((state) => ({
          connections: state.connections.filter((conn) => conn.userId !== userId),
        })),

      // Actions - Notifications
      setNotifications: (notifications) => set({ notifications }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),

      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        })),

      clearNotifications: () => set({ notifications: [] }),

      // Actions - Settings
      setSettings: (settings) => set({ settings }),

      updateSettings: (updates) =>
        set((state) => ({
          settings: state.settings 
            ? { ...state.settings, ...updates } 
            : { botToken: '', webhookUrl: '', notificationsEnabled: true, ...updates },
        })),

      // Actions - Automation Rules
      setAutomationRules: (rules) => set({ automationRules: rules }),

      addAutomationRule: (rule) =>
        set((state) => ({
          automationRules: [...state.automationRules, rule],
        })),

      updateAutomationRule: (id, updates) =>
        set((state) => ({
          automationRules: state.automationRules.map((rule) =>
            rule.id === id ? { ...rule, ...updates } : rule
          ),
        })),

      deleteAutomationRule: (id) =>
        set((state) => ({
          automationRules: state.automationRules.filter((rule) => rule.id !== id),
        })),

      toggleAutomationRule: (id) =>
        set((state) => ({
          automationRules: state.automationRules.map((rule) =>
            rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
          ),
        })),

      // Queries
      getConnectionByUserId: (userId) =>
        get().connections.find((conn) => conn.userId === userId),

      getActiveConnections: () =>
        get().connections.filter((conn) => conn.isActive),

      getUnreadNotifications: () =>
        get().notifications.filter((notif) => !notif.read),

      getActiveAutomationRules: () =>
        get().automationRules.filter((rule) => rule.enabled),

      getAutomationRulesByTrigger: (trigger) =>
        get().automationRules.filter((rule) => rule.trigger === trigger),
    }),
    {
      name: 'construction_telegram', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        connections: state.connections,
        notifications: state.notifications,
        settings: state.settings,
        automationRules: state.automationRules,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      },
    }
  )
)

