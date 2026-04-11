import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StoreFilterDrawer } from './StoreFilterDrawer'
import type { StoreFilters } from '../hooks/useStoreSearch'

const BASE_FILTERS: StoreFilters = {
  name: '', category: '', region: '', city: '',
}

const BASE_PROPS = {
  isOpen: true,
  onClose: vi.fn(),
  filters: BASE_FILTERS,
  setFilter: vi.fn(),
  clearFilters: vi.fn(),
  availableCategories: ['Belleza', 'Ropa'],
  availableRegions: ['Antioquia', 'Cundinamarca'],
  availableCities: ['Bogotá', 'Medellín'],
}

describe('StoreFilterDrawer', () => {
  it('is hidden when isOpen is false', () => {
    render(<StoreFilterDrawer {...BASE_PROPS} isOpen={false} />)
    expect(screen.getByTestId('store-filter-drawer')).toHaveStyle({ transform: 'translateY(100%)' })
  })

  it('is visible when isOpen is true', () => {
    render(<StoreFilterDrawer {...BASE_PROPS} isOpen={true} />)
    expect(screen.getByTestId('store-filter-drawer')).toHaveStyle({ transform: 'translateY(0)' })
  })

  it('renders Filtros title', () => {
    render(<StoreFilterDrawer {...BASE_PROPS} />)
    expect(screen.getByText('Filtros')).toBeInTheDocument()
  })

  it('renders 3 selects: categoría, región, ciudad', () => {
    render(<StoreFilterDrawer {...BASE_PROPS} />)
    expect(screen.getByRole('combobox', { name: /categoría/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /región/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /ciudad/i })).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<StoreFilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByTestId('store-filter-drawer-backdrop'))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when Aplicar button is clicked', async () => {
    const onClose = vi.fn()
    render(<StoreFilterDrawer {...BASE_PROPS} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /aplicar/i }))
    expect(onClose).toHaveBeenCalled()
  })

  it('calls clearFilters when Limpiar todo is clicked', async () => {
    const clearFilters = vi.fn()
    render(<StoreFilterDrawer {...BASE_PROPS} clearFilters={clearFilters} />)
    await userEvent.click(screen.getByRole('button', { name: /limpiar todo/i }))
    expect(clearFilters).toHaveBeenCalled()
  })
})
