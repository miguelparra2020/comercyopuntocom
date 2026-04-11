import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  const defaultProps = {
    image: 'https://picsum.photos/seed/prod1/300/345',
    storeIcon: 'https://picsum.photos/seed/s1/40/40',
  }

  it('renders a link to /search-products', () => {
    render(<MemoryRouter><ProductCard {...defaultProps} /></MemoryRouter>)
    const link = screen.getByRole('link', { name: /ver productos/i })
    expect(link).toHaveAttribute('href', '/search-products')
  })

  it('renders the product image with the correct src', () => {
    const { container } = render(
      <MemoryRouter><ProductCard {...defaultProps} /></MemoryRouter>
    )
    const images = container.querySelectorAll('img')
    const productImg = images[0]
    expect(productImg).toHaveAttribute('src', defaultProps.image)
  })

  it('renders the store icon with the correct src', () => {
    const { container } = render(
      <MemoryRouter><ProductCard {...defaultProps} /></MemoryRouter>
    )
    const images = container.querySelectorAll('img')
    const storeImg = images[1]
    expect(storeImg).toHaveAttribute('src', defaultProps.storeIcon)
  })
})
