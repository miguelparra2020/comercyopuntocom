import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StoreCardFull } from './StoreCardFull'
import type { StoreFull } from '../data/storesMock'

const BASE_STORE: StoreFull = {
  id: '1',
  name: 'ModaUrbana',
  description: 'Ropa contemporánea para todos los estilos.',
  coverImage: 'https://picsum.photos/seed/test-cover/400/225',
  logo: 'https://picsum.photos/seed/test-logo/40/40',
  badge: 'VERIFICADA',
  category: 'Ropa',
  region: 'Antioquia',
  city: 'Medellín',
  rating: 4.7,
  reviewCount: 312,
}

describe('StoreCardFull', () => {
  it('renders store name', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByText('ModaUrbana')).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByText('Ropa contemporánea para todos los estilos.')).toBeInTheDocument()
  })

  it('renders city and region', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByText(/Medellín/)).toBeInTheDocument()
    expect(screen.getByText(/Antioquia/)).toBeInTheDocument()
  })

  it('renders rating and review count', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByText(/4\.7/)).toBeInTheDocument()
    expect(screen.getByText(/312/)).toBeInTheDocument()
  })

  it('renders "Ver tienda" button', () => {
    render(<StoreCardFull {...BASE_STORE} />)
    expect(screen.getByRole('button', { name: /ver tienda/i })).toBeInTheDocument()
  })

  it('renders VERIFICADA badge when badge is VERIFICADA', () => {
    render(<StoreCardFull {...BASE_STORE} badge="VERIFICADA" />)
    expect(screen.getByText('VERIFICADA')).toBeInTheDocument()
  })

  it('renders NUEVA badge when badge is NUEVA', () => {
    render(<StoreCardFull {...BASE_STORE} badge="NUEVA" />)
    expect(screen.getByText('NUEVA')).toBeInTheDocument()
  })

  it('does not render badge when badge is null', () => {
    render(<StoreCardFull {...BASE_STORE} badge={null} />)
    expect(screen.queryByText('VERIFICADA')).not.toBeInTheDocument()
    expect(screen.queryByText('NUEVA')).not.toBeInTheDocument()
  })
})
