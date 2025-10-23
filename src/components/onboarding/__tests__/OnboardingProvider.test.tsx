import { render, screen } from '@testing-library/react'
import { OnboardingProvider } from '../OnboardingProvider'
import { useOnboardingStore } from '@/stores/useOnboardingStore'

// Mock the stores
jest.mock('@/stores/useOnboardingStore')
jest.mock('@/stores/useUsersStore')

const mockUseOnboardingStore = useOnboardingStore as jest.MockedFunction<typeof useOnboardingStore>

describe('OnboardingProvider', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()
    
    // Default mock implementation
    mockUseOnboardingStore.mockReturnValue({
      getCurrentUser: jest.fn().mockReturnValue({
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'SALES_MANAGER',
        active: true,
        createdAt: '2024-01-01'
      }),
      getUsersByRole: jest.fn(),
      getActiveUsers: jest.fn(),
      getCurrentUser: jest.fn(),
      getManagers: jest.fn(),
      getExecutors: jest.fn(),
      setUsers: jest.fn(),
      addUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
      setCurrentUser: jest.fn()
    })
  })

  it('renders children correctly', () => {
    render(
      <OnboardingProvider>
        <div>Test Content</div>
      </OnboardingProvider>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('provides onboarding context', () => {
    const TestComponent = () => {
      const context = useOnboarding()
      return <div data-testid="context">{context ? 'Context available' : 'No context'}</div>
    }

    render(
      <OnboardingProvider>
        <TestComponent />
      </OnboardingProvider>
    )

    expect(screen.getByTestId('context')).toHaveTextContent('Context available')
  })
})
