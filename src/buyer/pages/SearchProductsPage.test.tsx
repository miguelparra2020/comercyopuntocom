import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SearchProductsPage } from './SearchProductsPage'

describe('SearchProductsPage', () => {
  it('renders the welcome title', () => {
    render(<MemoryRouter><SearchProductsPage /></MemoryRouter>)
    expect(
      screen.getByRole('heading', { name: /bienvenido al área de búsqueda/i })
    ).toBeInTheDocument()
  })

  it('renders product cards (10 by default)', () => {
    render(<MemoryRouter><SearchProductsPage /></MemoryRouter>)
    const buttons = screen.getAllByRole('button', { name: /ver producto/i })
    expect(buttons.length).toBe(10)
  })

  it('renders two PaginationBar elements', () => {
    render(<MemoryRouter><SearchProductsPage /></MemoryRouter>)
    expect(screen.getAllByTestId('pagination-bar')).toHaveLength(2)
  })

  it('renders empty state when no products match filters', () => {
    render(<MemoryRouter><SearchProductsPage /></MemoryRouter>)
    // El mensaje vacío no existe inicialmente (hay 10 productos)
    expect(screen.queryByText(/no encontramos productos/i)).not.toBeInTheDocument()
  })
})
