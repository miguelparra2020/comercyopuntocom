import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ServiceFilterDrawer } from './ServiceFilterDrawer'
import type { ServiceFilters } from '../hooks/useServiceSearch'

const BASE_FILTERS: ServiceFilters = {
  name: '', category: '', region: '', city: '', priceSort: '', store: '',
}

const BASE_PROPS = {
  isOpen: true,
  onClose: vi.fn(),
  filters: BASE_FILTERS,
  setFilter: vi.fn(),
  clearFilters: vi.fn(),
  availableCategories: ['Diseño', 'Fotografía'],
  availableRegions: ['Antioquia', 'Cundinamarca'],
  availableCities: ['Bogotá', 'Medellín'],
  availableStores: ['DesignHub', 'PhotoPro'],
}

describe('ServiceFilterDrawer', () => {
  it('is hidden when isOpen is false', () => {
    render(<ServiceFilterDrawer {...BASE_PROPS} isOpen={false} />)
    expect(screen.getByTestId('service-filter-drawer')).toHaveStyle({ transform: 'translateY(100%)' })
  })

  it('is visible when isOpen is true', () => {
    render(<ServiceFilterDrawer {...BASE_PROPS} isOpen={true} />)
    expect(screen.getByTestId('service-filter-drawer')).toHaveStyle({ transform: 'translateY(0)' })
  })

  it('renders Filtros title', () => {
    render(<ServiceFilterDrawer {...BASE_PROPS} />)
    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('renders all 5 selects', () => {
    render(<ServiceFilterDrawer {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /categoría/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /región/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /precio/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /tienda/i })).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<ServiceFilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByTestId('service-filter-drawer-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Aplicar button is clicked', async () => {
    const onClose = vi.fn()
    render(<ServiceFilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /aplicar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls clearFilters when Limpiar todo is clicked', async () => {
    const clearFilters = vi.fn()
    render(<ServiceFilterDrawer {...BASE_PROPS} clearFilters={clearFilters} />)
    await userEvent.click(screen.getByRole('button', { name: /limpiar todo/i }))
    expect(clearFilters).toHaveBeenCalled()
  })
})
