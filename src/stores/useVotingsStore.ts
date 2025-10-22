import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Voting } from '@/types'

interface VotingsState {
  votings: Voting[]
  isInitialized: boolean
  
  // Actions
  setVotings: (votings: Voting[]) => void
  addVoting: (voting: Voting) => void
  updateVoting: (id: string, updates: Partial<Voting>) => void
  deleteVoting: (id: string) => void
  
  // Queries
  getVotingById: (id: string) => Voting | undefined
  getVotingsByLeadId: (leadId: string) => Voting[]
  getVotingsByStatus: (status: string) => Voting[]
  getActiveVotings: () => Voting[]
  getCompletedVotings: () => Voting[]
}

export const useVotingsStore = create<VotingsState>()(
  persist(
    (set, get) => ({
      votings: [],
      isInitialized: false,

      // Actions
      setVotings: (votings) => set({ votings, isInitialized: true }),

      addVoting: (voting) =>
        set((state) => ({
          votings: [...state.votings, voting],
        })),

      updateVoting: (id, updates) =>
        set((state) => ({
          votings: state.votings.map((voting) =>
            voting.id === id ? { ...voting, ...updates } : voting
          ),
        })),

      deleteVoting: (id) =>
        set((state) => ({
          votings: state.votings.filter((voting) => voting.id !== id),
        })),

      // Queries
      getVotingById: (id) => get().votings.find((voting) => voting.id === id),

      getVotingsByLeadId: (leadId) =>
        get().votings.filter((voting) => voting.leadId === leadId),

      getVotingsByStatus: (status) =>
        get().votings.filter((voting) => voting.status === status),

      getActiveVotings: () =>
        get().votings.filter(
          (voting) =>
            voting.status === 'ACTIVE'
        ),

      getCompletedVotings: () =>
        get().votings.filter(
          (voting) =>
            voting.status === 'COMPLETED' ||
            voting.status === 'FAILED'
        ),
    }),
    {
      name: 'construction_votings', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        votings: state.votings,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      },
    }
  )
)

