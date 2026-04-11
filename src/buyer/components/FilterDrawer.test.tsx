import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterDrawer } from './FilterDrawer'
import type { ProductFilters } from '../hooks/useProductSearch'

const BASE_FILTERS: ProductFilters = {
  name: '', category: '', region: '', city: '', priceSort: '', store: '',
}

const BASE_PROPS = {
  isOpen: true,
  onClose: vi.fn(),
  filters: BASE_FILTERS,
  setFilter: vi.fn(),
  clearFilters: vi.fn(),
  availableCategories: ['Electrónica', 'Ropa'],
  availableRegions: ['Antioquia', 'Cundinamarca'],
  availableCities: ['Medellín', 'Bogotá'],
  availableStores: ['TechStore', 'ModaUrbana'],
}

describe('FilterDrawer', () => {
  it('is hidden when isOpen is false', () => {
    render(<FilterDrawer {...BASE_PROPS} isOpen={false} />)
    expect(screen.getByTestId('filter-drawer')).toHaveStyle({ transform: 'translateY(100%)' })
  })

  it('is visible when isOpen is true', () => {
    render(<FilterDrawer {...BASE_PROPS} isOpen={true} />)
    expect(screen.getByTestId('filter-drawer')).toHaveStyle({ transform: 'translateY(0)' })
  })

  it('renders Filtros title', () => {
    render(<FilterDrawer {...BASE_PROPS} />)
    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('renders all 5 selects', () => {
    render(<FilterDrawer {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /categoría/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /región/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /precio/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /tienda/i })).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<FilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByTestId('filter-drawer-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Aplicar button is clicked', async () => {
    const onClose = vi.fn()
    render(<FilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /aplicar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls clearFilters when Limpiar todo is clicked', async () => {
    const clearFilters = vi.fn()
    render(<FilterDrawer {...BASE_PROPS} clearFilters={clearFilters} />)
    await userEvent.click(screen.getByRole('button', { name: /limpiar todo/i }))
    expect(clearFilters).toHaveBeenCalled()
  })
})
