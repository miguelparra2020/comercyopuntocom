import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ServiceSearchBar } from './ServiceSearchBar'
import type { ServiceFilters } from '../hooks/useServiceSearch'

const BASE_FILTERS: ServiceFilters = {
  name: '', category: '', region: '', city: '', priceSort: '', store: '',
}

const BASE_PROPS = {
  filters: BASE_FILTERS,
  setFilter: vi.fn(),
  activeFilterCount: 0,
  onOpenFilterDrawer: vi.fn(),
  clearFilters: vi.fn(),
  availableCategories: ['Diseño', 'Fotografía'],
  availableRegions: ['Antioquia', 'Cundinamarca'],
  availableCities: ['Bogotá', 'Medellín'],
  availableStores: ['DesignHub', 'PhotoPro'],
}

describe('ServiceSearchBar - desktop', () => {
  const originalWidth = window.innerWidth

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    vi.clearAllMocks()
  })

  it('renders name input on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByPlaceholderText(/buscar por nombre/i)).toBeInTheDocument()
  })

  it('renders category select on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /categoría/i })).toBeInTheDocument()
  })

  it('renders region select on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /región/i })).toBeInTheDocument()
  })

  it('renders city select on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeInTheDocument()
  })

  it('city select is disabled when no region is selected', () => {
    render(<ServiceSearchBar {...BASE_PROPS} filters={{ ...BASE_FILTERS, region: '' }} />)
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeDisabled()
  })

  it('city select is enabled when a region is selected', () => {
    render(<ServiceSearchBar {...BASE_PROPS} filters={{ ...BASE_FILTERS, region: 'Antioquia' }} />)
    expect(screen.getByRole('combobox', { name: /ciudad/i })).not.toBeDisabled()
  })

  it('does not render Filtros button on desktop', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.queryByRole('button', { name: /filtros/i })).not.toBeInTheDocument()
  })

  it('calls setFilter with name value on input change', async () => {
    const setFilter = vi.fn()
    render(<ServiceSearchBar {...BASE_PROPS} setFilter={setFilter} />)
    await userEvent.type(screen.getByPlaceholderText(/buscar por nombre/i), 'dis')
    expect(setFilter).toHaveBeenCalledWith('name', expect.stringContaining('d'))
  })

  it('shows Limpiar button when activeFilterCount > 0', () => {
    render(<ServiceSearchBar {...BASE_PROPS} activeFilterCount={2} />)
    expect(screen.getByRole('button', { name: /limpiar/i })).toBeInTheDocument()
  })

  it('hides Limpiar button when no active filters and name is empty', () => {
    render(<ServiceSearchBar {...BASE_PROPS} activeFilterCount={0} filters={{ ...BASE_FILTERS, name: '' }} />)
    expect(screen.queryByRole('button', { name: /limpiar/i })).not.toBeInTheDocument()
  })
})

describe('ServiceSearchBar - mobile', () => {
  const originalWidth = window.innerWidth

  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 })
  })

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    vi.clearAllMocks()
  })

  it('renders Filtros button on mobile', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.getByRole('button', { name: /filtros/i })).toBeInTheDocument()
  })

  it('does not render category select on mobile', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.queryByRole('combobox', { name: /categoría/i })).not.toBeInTheDocument()
  })

  it('does not render region select on mobile', () => {
    render(<ServiceSearchBar {...BASE_PROPS} />)
    expect(screen.queryByRole('combobox', { name: /región/i })).not.toBeInTheDocument()
  })

  it('calls onOpenFilterDrawer when Filtros button clicked', async () => {
    const onOpenFilterDrawer = vi.fn()
    render(<ServiceSearchBar {...BASE_PROPS} onOpenFilterDrawer={onOpenFilterDrawer} />)
    await userEvent.click(screen.getByRole('button', { name: /filtros/i }))
    expect(onOpenFilterDrawer).toHaveBeenCalled()
  })

  it('shows badge count on Filtros button when activeFilterCount > 0', () => {
    render(<ServiceSearchBar {...BASE_PROPS} activeFilterCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
