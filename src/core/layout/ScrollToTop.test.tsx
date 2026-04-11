import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import { ScrollToTop } from './ScrollToTop'

describe('ScrollToTop', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('scrolls to top on initial render', () => {
    render(
      <MemoryRouter>
        <ScrollToTop />
      </MemoryRouter>
    )
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('scrolls to top when the route changes', async () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Link to="/other">Go to other</Link>} />
          <Route path="/other" element={<div>Other page</div>} />
        </Routes>
      </MemoryRouter>
    )

    vi.clearAllMocks()

    await act(async () => {
      getByRole('link', { name: /go to other/i }).click()
    })

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
