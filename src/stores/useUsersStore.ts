import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/types'

interface UsersState {
  users: User[]
  currentUserId: string | null
  isInitialized: boolean
  
  // Actions
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  deleteUser: (id: string) => void
  setCurrentUser: (userId: string | null) => void
  
  // Queries
  getUserById: (id: string) => User | undefined
  getUsersByRole: (role: string) => User[]
  getActiveUsers: () => User[]
  getCurrentUser: () => User | undefined
  getManagers: () => User[]
  getExecutors: () => User[]
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUserId: null,
      isInitialized: false,

      // Actions
      setUsers: (users) => set({ users, isInitialized: true }),

      addUser: (user) =>
        set((state) => ({
          users: [...state.users, user],
        })),

      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        })),

      setCurrentUser: (userId) => set({ currentUserId: userId }),

      // Queries
      getUserById: (id) => get().users.find((user) => user.id === id),

      getUsersByRole: (role) =>
        get().users.filter((user) => user.role === role),

      getActiveUsers: () =>
        get().users.filter((user) => user.active !== false),

      getCurrentUser: () => {
        const { currentUserId } = get()
        return currentUserId ? get().getUserById(currentUserId) : undefined
      },

      getManagers: () =>
        get().users.filter(
          (user) =>
            user.role === 'MANAGER' || user.role === 'ADMIN'
        ),

      getExecutors: () =>
        get().users.filter((user) => user.role === 'EXECUTOR'),
    }),
    {
      name: 'construction_users', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        currentUserId: state.currentUserId,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      },
    }
  )
)

