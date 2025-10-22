import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadedAt: string
  status: 'pending' | 'verified' | 'rejected'
  leadId: string
  category: string
  fileData?: string
}

interface DocumentsState {
  documents: Document[]
  isInitialized: boolean
  
  // Actions
  addDocument: (document: Document) => void
  updateDocument: (id: string, updates: Partial<Document>) => void
  deleteDocument: (id: string) => void
  setDocuments: (documents: Document[]) => void
}

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set) => ({
      documents: [],
      isInitialized: false,

      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, document],
          isInitialized: true,
        })),

      updateDocument: (id, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id ? { ...doc, ...updates } : doc
          ),
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((doc) => doc.id !== id),
        })),

      setDocuments: (documents) =>
        set({ documents, isInitialized: true }),
    }),
    {
      name: 'construction_documents',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isInitialized = true
        }
      },
    }
  )
)

