import { describe, it, expect, beforeEach } from 'vitest'
import { useLeadsStore } from '../useLeadsStore'

describe('Leads Store', () => {
  beforeEach(() => {
    // Очищаем store перед каждым тестом
    useLeadsStore.setState({ leads: [], isInitialized: true })
    localStorage.clear()
  })

  it('should initialize with empty leads', () => {
    const { leads } = useLeadsStore.getState()
    expect(leads).toEqual([])
  })

  it('should add a lead', () => {
    const newLead = {
      id: 'lead-1',
      address: 'Test Address',
      city: 'Moscow',
      contactPerson: 'John Doe',
      contactPhone: '+79991234567',
      contactEmail: 'john@example.com',
      source: 'ОЗ',
      status: 'NEW' as const,
      currentStage: 'INITIAL_CONSULTATION',
      createdAt: new Date().toISOString()
    }

    useLeadsStore.getState().addLead(newLead)

    const { leads } = useLeadsStore.getState()
    expect(leads).toHaveLength(1)
    expect(leads[0]).toEqual(newLead)
  })

  it('should update a lead', () => {
    const lead = {
      id: 'lead-1',
      address: 'Old Address',
      city: 'Moscow',
      contactPerson: 'John Doe',
      contactPhone: '+79991234567',
      source: 'ОЗ',
      status: 'NEW' as const,
      currentStage: 'INITIAL_CONSULTATION',
      createdAt: new Date().toISOString()
    }

    useLeadsStore.getState().addLead(lead)
    useLeadsStore.getState().updateLead('lead-1', { 
      address: 'New Address',
      status: 'IN_PROGRESS' as const
    })

    const { leads } = useLeadsStore.getState()
    expect(leads[0].address).toBe('New Address')
    expect(leads[0].status).toBe('IN_PROGRESS')
  })

  it('should delete a lead', () => {
    const lead1 = {
      id: 'lead-1',
      address: 'Address 1',
      city: 'Moscow',
      contactPerson: 'John',
      contactPhone: '+79991234567',
      source: 'ОЗ',
      status: 'NEW' as const,
      currentStage: 'INITIAL_CONSULTATION',
      createdAt: new Date().toISOString()
    }

    const lead2 = {
      id: 'lead-2',
      address: 'Address 2',
      city: 'Moscow',
      contactPerson: 'Jane',
      contactPhone: '+79991234568',
      source: 'Сарафанная радио',
      status: 'NEW' as const,
      currentStage: 'INITIAL_CONSULTATION',
      createdAt: new Date().toISOString()
    }

    useLeadsStore.getState().addLead(lead1)
    useLeadsStore.getState().addLead(lead2)

    expect(useLeadsStore.getState().leads).toHaveLength(2)

    useLeadsStore.getState().deleteLead('lead-1')

    const { leads } = useLeadsStore.getState()
    expect(leads).toHaveLength(1)
    expect(leads[0].id).toBe('lead-2')
  })

  it('should persist to localStorage', () => {
    const lead = {
      id: 'lead-1',
      address: 'Test Address',
      city: 'Moscow',
      contactPerson: 'John Doe',
      contactPhone: '+79991234567',
      source: 'ОЗ',
      status: 'NEW' as const,
      currentStage: 'INITIAL_CONSULTATION',
      createdAt: new Date().toISOString()
    }

    useLeadsStore.getState().addLead(lead)

    const stored = localStorage.getItem('construction_leads')
    expect(stored).toBeTruthy()
    
    const parsed = JSON.parse(stored!)
    expect(parsed.state.leads).toHaveLength(1)
    expect(parsed.state.leads[0].id).toBe('lead-1')
  })

  it('should setLeads replace all leads', () => {
    const lead1 = {
      id: 'lead-1',
      address: 'Address 1',
      city: 'Moscow',
      contactPerson: 'John',
      contactPhone: '+79991234567',
      source: 'ОЗ',
      status: 'NEW' as const,
      currentStage: 'INITIAL_CONSULTATION',
      createdAt: new Date().toISOString()
    }

    useLeadsStore.getState().addLead(lead1)

    const newLeads = [
      {
        id: 'lead-2',
        address: 'Address 2',
        city: 'Moscow',
        contactPerson: 'Jane',
        contactPhone: '+79991234568',
        source: 'Фронты',
        status: 'IN_PROGRESS' as const,
        currentStage: 'DOCUMENTS_COLLECTION',
        createdAt: new Date().toISOString()
      }
    ]

    useLeadsStore.getState().setLeads(newLeads)

    const { leads } = useLeadsStore.getState()
    expect(leads).toHaveLength(1)
    expect(leads[0].id).toBe('lead-2')
  })

  it('should handle updating non-existent lead gracefully', () => {
    useLeadsStore.getState().updateLead('non-existent', { address: 'Test' })

    const { leads } = useLeadsStore.getState()
    expect(leads).toHaveLength(0)
  })

  it('should handle deleting non-existent lead gracefully', () => {
    useLeadsStore.getState().deleteLead('non-existent')

    const { leads } = useLeadsStore.getState()
    expect(leads).toHaveLength(0)
  })
})

