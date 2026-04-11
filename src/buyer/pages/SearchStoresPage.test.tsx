import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SearchStoresPage } from './SearchStoresPage'

describe('SearchStoresPage', () => {
  it('renders the welcome title', () => {
    render(<MemoryRouter><SearchStoresPage /></MemoryRouter>)
    expect(
      screen.getByRole('heading', { name: /bienvenido al área de búsqueda de tiendas/i })
    ).toBeInTheDocument()
  })

  it('renders store cards (10 by default)', () => {
    render(<MemoryRouter><SearchStoresPage /></MemoryRouter>)
    const buttons = screen.getAllByRole('button', { name: /ver tienda/i })
    expect(buttons.length).toBe(10)
  })

  it('renders two PaginationBar elements', () => {
    render(<MemoryRouter><SearchStoresPage /></MemoryRouter>)
    expect(screen.getAllByTestId('pagination-bar')).toHaveLength(2)
  })

  it('does not show empty state initially', () => {
    render(<MemoryRouter><SearchStoresPage /></MemoryRouter>)
    expect(screen.queryByText(/no encontramos tiendas/i)).not.toBeInTheDocument()
  })
})
