import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Task } from '@/types'

interface TasksState {
  tasks: Task[]
  isInitialized: boolean
  
  // Actions
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  // Queries
  getTaskById: (id: string) => Task | undefined
  getTasksByAssignee: (assigneeId: string) => Task[]
  getTasksByStatus: (status: string) => Task[]
  getTasksByPriority: (priority: string) => Task[]
  getTasksByType: (type: string) => Task[]
  getTasksByLeadId: (leadId: string) => Task[]
  getTasksByVotingId: (votingId: string) => Task[]
  getOverdueTasks: () => Task[]
  getTodayTasks: () => Task[]
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set, get) => ({
      tasks: [],
      isInitialized: false,

      // Actions
      setTasks: (tasks) => set({ tasks, isInitialized: true }),

      addTask: (task) =>
        set((state) => ({
          tasks: [...state.tasks, task],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      // Queries
      getTaskById: (id) => get().tasks.find((task) => task.id === id),

      getTasksByAssignee: (assigneeId) =>
        get().tasks.filter((task) => task.assigneeId === assigneeId),

      getTasksByStatus: (status) =>
        get().tasks.filter((task) => task.status === status),

      getTasksByPriority: (priority) =>
        get().tasks.filter((task) => task.priority === priority),

      getTasksByType: (type) =>
        get().tasks.filter((task) => task.type === type),

      getTasksByLeadId: (leadId) =>
        get().tasks.filter((task) => task.leadId === leadId),

      getTasksByVotingId: (votingId) =>
        get().tasks.filter((task) => task.votingId === votingId),

      getOverdueTasks: () => {
        const now = new Date()
        return get().tasks.filter(
          (task) =>
            task.dueDate &&
            new Date(task.dueDate) < now &&
            task.status !== 'COMPLETED' &&
            task.status !== 'CANCELLED'
        )
      },

      getTodayTasks: () => {
        const today = new Date().toISOString().split('T')[0]
        return get().tasks.filter(
          (task) => task.dueDate && task.dueDate.startsWith(today)
        )
      },
    }),
    {
      name: 'construction_tasks', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      },
    }
  )
)

