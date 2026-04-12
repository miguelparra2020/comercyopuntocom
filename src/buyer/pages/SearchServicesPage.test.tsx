import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SearchServicesPage } from './SearchServicesPage'

describe('SearchServicesPage', () => {
  it('renders the welcome title', () => {
    render(<MemoryRouter><SearchServicesPage /></MemoryRouter>)
    expect(
      screen.getByRole('heading', { name: /bienvenido al área de búsqueda de servicios/i })
    ).toBeInTheDocument()
  })

  it('renders service cards (10 by default) with Contratar button', () => {
    render(<MemoryRouter><SearchServicesPage /></MemoryRouter>)
    const buttons = screen.getAllByRole('button', { name: /contratar/i })
    expect(buttons.length).toBe(10)
  })

  it('renders two PaginationBar elements', () => {
    render(<MemoryRouter><SearchServicesPage /></MemoryRouter>)
    expect(screen.getAllByTestId('pagination-bar')).toHaveLength(2)
  })

  it('does not show empty state initially', () => {
    render(<MemoryRouter><SearchServicesPage /></MemoryRouter>)
    expect(screen.queryByText(/no encontramos servicios/i)).not.toBeInTheDocument()
  })
})
