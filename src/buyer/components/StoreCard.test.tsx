import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StoreCard } from './StoreCard'

const defaultProps = {
  image: 'https://picsum.photos/seed/store1/400/225',
  storeIcon: 'https://picsum.photos/seed/si1/40/40',
  storeName: 'Tienda Uno',
}

describe('StoreCard', () => {
  it('renders a link with aria-label "Ver tiendas" pointing to /search-stores', () => {
    render(<MemoryRouter><StoreCard {...defaultProps} /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /ver tiendas/i })
    expect(link).toHaveAttribute('href', '/search-stores')
  })

  it('renders the store name', () => {
    render(<MemoryRouter><StoreCard {...defaultProps} /></MemoryRouter>)
    expect(screen.getByText('Tienda Uno')).toBeInTheDocument()
  })

  it('renders two images (cover and store icon)', () => {
    render(<MemoryRouter><StoreCard {...defaultProps} /></MemoryRouter>)
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(2)
  })
})
