import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { StoresSection } from './StoresSection'

describe('StoresSection', () => {
  it('renders the section title', () => {
    render(<MemoryRouter><StoresSection /></MemoryRouter>)
    expect(
      screen.getByText('Las tiendas más cerca de lo que buscas')
    ).toBeInTheDocument()
  })

  it('renders the section description', () => {
    render(<MemoryRouter><StoresSection /></MemoryRouter>)
    expect(
      screen.getByText('Las mejores tiendas, verificadas y listas para ti.')
    ).toBeInTheDocument()
  })

  it('renders an "Explorar tiendas" link to /search-stores', () => {
    render(<MemoryRouter><StoresSection /></MemoryRouter>)
    const btn = screen.getByRole('link', { name: /explorar tiendas/i })
    expect(btn).toHaveAttribute('href', '/search-stores')
  })

  it('renders 4 store card links to /search-stores (mobile/desktop — not tablet)', () => {
    render(<MemoryRouter><StoresSection /></MemoryRouter>)
    const storeLinks = screen.getAllByRole('link', { name: /ver tiendas/i })
    expect(storeLinks.length).toBe(4)
    storeLinks.forEach(link => {
      expect(link).toHaveAttribute('href', '/search-stores')
    })
  })

  describe('tablet layout', () => {
    const originalWidth = window.innerWidth

    beforeEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 768 })
    })

    afterEach(() => {
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalWidth })
    })

    it('renders only 3 store card links at tablet width', async () => {
      render(<MemoryRouter><StoresSection /></MemoryRouter>)
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
      })
      const storeLinks = screen.getAllByRole('link', { name: /ver tiendas/i })
      expect(storeLinks.length).toBe(3)
    })
  })
})
