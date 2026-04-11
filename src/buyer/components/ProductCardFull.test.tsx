// src/buyer/components/ProductCardFull.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductCardFull } from './ProductCardFull'
import type { ProductFull } from '../data/productsMock'

const BASE_PRODUCT: ProductFull = {
  id: '1',
  name: 'Teclado Mecánico Pro',
  description: 'Descripción del producto de prueba',
  price: 99589000,
  image: 'https://picsum.photos/seed/test/300/400',
  badge: 'NUEVO',
  category: 'Electrónica',
  region: 'Antioquia',
  city: 'Medellín',
  store: { name: 'TechStore', icon: 'https://picsum.photos/seed/ts/40/40' },
  rating: 4.8,
  reviewCount: 124,
}

describe('ProductCardFull', () => {
  it('renders product name', () => {
    render(<ProductCardFull {...BASE_PRODUCT} />)
    expect(screen.getByText('Teclado Mecánico Pro')).toBeInTheDocument()
  })

  it('renders formatted price in COP', () => {
    render(<ProductCardFull {...BASE_PRODUCT} />)
    expect(screen.getByText(/99[.,]589[.,]000/)).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<ProductCardFull {...BASE_PRODUCT} />)
    expect(screen.getByText('Descripción del producto de prueba')).toBeInTheDocument()
  })

  it('renders store name', () => {
    render(<ProductCardFull {...BASE_PRODUCT} />)
    expect(screen.getByText('TechStore')).toBeInTheDocument()
  })

  it('renders city and region', () => {
    render(<ProductCardFull {...BASE_PRODUCT} />)
    expect(screen.getByText(/Medellín/)).toBeInTheDocument()
    expect(screen.getByText(/Antioquia/)).toBeInTheDocument()
  })

  it('renders rating and review count', () => {
    render(<ProductCardFull {...BASE_PRODUCT} />)
    expect(screen.getByText(/4\.8/)).toBeInTheDocument()
    expect(screen.getByText(/124/)).toBeInTheDocument()
  })

  it('renders "Ver producto" button', () => {
    render(<ProductCardFull {...BASE_PRODUCT} />)
    expect(screen.getByRole('button', { name: /ver producto/i })).toBeInTheDocument()
  })

  it('renders NUEVO badge when badge is NUEVO', () => {
    render(<ProductCardFull {...BASE_PRODUCT} badge="NUEVO" />)
    expect(screen.getByText('NUEVO')).toBeInTheDocument()
  })

  it('renders OFERTA badge when badge is OFERTA', () => {
    render(<ProductCardFull {...BASE_PRODUCT} badge="OFERTA" />)
    expect(screen.getByText('OFERTA')).toBeInTheDocument()
  })

  it('does not render badge when badge is null', () => {
    render(<ProductCardFull {...BASE_PRODUCT} badge={null} />)
    expect(screen.queryByText('NUEVO')).not.toBeInTheDocument()
    expect(screen.queryByText('OFERTA')).not.toBeInTheDocument()
  })
})
