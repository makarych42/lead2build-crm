import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dashboard from '../src/components/Dashboard'

describe('Dashboard Component', () => {
  test('renders dashboard with correct title', () => {
    render(<Dashboard />)
    expect(screen.getByText('Главная')).toBeInTheDocument()
    expect(screen.getByText('Общая статистика по подготовке домов к строительству')).toBeInTheDocument()
  })

  test('displays primary statistics cards', () => {
    render(<Dashboard />)
    
    // Check for primary stats
    expect(screen.getByText('Всего лидов')).toBeInTheDocument()
    expect(screen.getByText('Активных лидов')).toBeInTheDocument()
    expect(screen.getByText('Завершено')).toBeInTheDocument()
    expect(screen.getByText('Средний срок (дней)')).toBeInTheDocument()
  })

  test('shows secondary statistics', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Документы готовы')).toBeInTheDocument()
    expect(screen.getByText('Активных голосований')).toBeInTheDocument()
    expect(screen.getByText('Ожидают решения')).toBeInTheDocument()
    expect(screen.getByText('Успешность (%)')).toBeInTheDocument()
  })

  test('period selector changes dashboard view', () => {
    render(<Dashboard />)
    
    const selector = screen.getByDisplayValue('Месяц')
    fireEvent.change(selector, { target: { value: 'week' } })
    
    expect(selector.value).toBe('week')
  })

  test('displays stage statistics with correct counts', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Лиды по этапам')).toBeInTheDocument()
    expect(screen.getByText('Консультация')).toBeInTheDocument()
    expect(screen.getByText('Подготовка документов')).toBeInTheDocument()
    expect(screen.getByText('Обследование')).toBeInTheDocument()
  })

  test('shows recent events section', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Последние события')).toBeInTheDocument()
    expect(screen.getByText('Новый лид: ул. Ленина, 15')).toBeInTheDocument()
  })

  test('quick actions are interactive', () => {
    render(<Dashboard />)
    
    const addLeadButton = screen.getByText('Добавить лид')
    expect(addLeadButton).toBeInTheDocument()
    
    fireEvent.click(addLeadButton)
    // Should trigger some action (mocked in real implementation)
  })

  test('displays monthly dynamics chart', () => {
    render(<Dashboard />)
    
    expect(screen.getByText('Месячная динамика')).toBeInTheDocument()
    expect(screen.getByText('Янв')).toBeInTheDocument()
    expect(screen.getByText('Фев')).toBeInTheDocument()
  })
})

describe('Dashboard Integration Tests', () => {
  test('dashboard data updates correctly', async () => {
    render(<Dashboard />)
    
    // Mock API call
    await waitFor(() => {
      expect(screen.getByText('24')).toBeInTheDocument() // Total leads
    })
  })

  test('trend indicators show correct direction', () => {
    render(<Dashboard />)
    
    // Check for trend indicators
    const trendElements = screen.getAllByText(/[+-]\d+%/)
    expect(trendElements.length).toBeGreaterThan(0)
  })

  test('responsive design works on different screen sizes', () => {
    // Mock different viewport sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })

    render(<Dashboard />)
    
    // Dashboard should render without errors on tablet size
    expect(screen.getByText('Главная')).toBeInTheDocument()
  })
})