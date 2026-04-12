import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ServiceCardFull } from './ServiceCardFull'
import type { ServiceFull } from '../data/servicesMock'

const BASE_SERVICE: ServiceFull = {
  id: '1',
  name: 'Diseño de Logo Profesional',
  description: 'Creación de logotipo vectorial con manual de marca.',
  price: 450000,
  image: 'https://picsum.photos/seed/test/300/300',
  badge: 'NUEVO',
  category: 'Diseño',
  region: 'Antioquia',
  city: 'Medellín',
  store: { name: 'DesignHub', icon: 'https://picsum.photos/seed/dh/40/40' },
  rating: 4.8,
  reviewCount: 94,
}

describe('ServiceCardFull', () => {
  it('renders service name', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText('Diseño de Logo Profesional')).toBeInTheDocument()
  })

  it('renders formatted price in COP', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText(/450.000/)).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText('Creación de logotipo vectorial con manual de marca.')).toBeInTheDocument()
  })

  it('renders store name', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText('DesignHub')).toBeInTheDocument()
  })

  it('renders city and region', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText(/Medellín/)).toBeInTheDocument()
    expect(screen.getByText(/Antioquia/)).toBeInTheDocument()
  })

  it('renders rating and review count', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByText(/4\.8/)).toBeInTheDocument()
    expect(screen.getByText(/94/)).toBeInTheDocument()
  })

  it('renders "Contratar" button', () => {
    render(<ServiceCardFull {...BASE_SERVICE} />)
    expect(screen.getByRole('button', { name: /contratar/i })).toBeInTheDocument()
  })

  it('renders NUEVO badge when badge is NUEVO', () => {
    render(<ServiceCardFull {...BASE_SERVICE} badge="NUEVO" />)
    expect(screen.getByText('NUEVO')).toBeInTheDocument()
  })

  it('renders OFERTA badge when badge is OFERTA', () => {
    render(<ServiceCardFull {...BASE_SERVICE} badge="OFERTA" />)
    expect(screen.getByText('OFERTA')).toBeInTheDocument()
  })

  it('does not render badge when badge is null', () => {
    render(<ServiceCardFull {...BASE_SERVICE} badge={null} />)
    expect(screen.queryByText('NUEVO')).not.toBeInTheDocument()
    expect(screen.queryByText('OFERTA')).not.toBeInTheDocument()
  })
})
