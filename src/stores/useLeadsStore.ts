import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Lead } from '@/types'

interface LeadsState {
  leads: Lead[]
  isInitialized: boolean
  
  // Actions
  setLeads: (leads: Lead[]) => void
  addLead: (lead: Lead) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  deleteLead: (id: string) => void
  
  // Queries
  getLeadById: (id: string) => Lead | undefined
  getLeadsByStatus: (status: string) => Lead[]
  getLeadsByStage: (stage: string) => Lead[]
  searchLeads: (query: string) => Lead[]
}

export const useLeadsStore = create<LeadsState>()(
  persist(
    (set, get) => ({
      leads: [],
      isInitialized: false,

      // Actions
      setLeads: (leads) => set({ leads, isInitialized: true }),

      addLead: (lead) =>
        set((state) => ({
          leads: [...state.leads, lead],
        })),

      updateLead: (id, updates) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id ? { ...lead, ...updates } : lead
          ),
        })),

      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        })),

      // Queries
      getLeadById: (id) => get().leads.find((lead) => lead.id === id),

      getLeadsByStatus: (status) =>
        get().leads.filter((lead) => lead.status === status),

      getLeadsByStage: (stage) =>
        get().leads.filter((lead) => lead.currentStage === stage),

      searchLeads: (query) => {
        const lowerQuery = query.toLowerCase()
        return get().leads.filter(
          (lead) =>
            lead.address.toLowerCase().includes(lowerQuery) ||
            lead.city?.toLowerCase().includes(lowerQuery) ||
            lead.contactPerson.toLowerCase().includes(lowerQuery) ||
            lead.contactPhone.toLowerCase().includes(lowerQuery) ||
            lead.contactEmail?.toLowerCase().includes(lowerQuery)
        )
      },
    }),
    {
      name: 'construction_leads', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        leads: state.leads,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      },
    }
  )
)

