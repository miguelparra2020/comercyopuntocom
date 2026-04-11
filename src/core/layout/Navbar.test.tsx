import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { Navbar } from './Navbar'
import { useAuthStore } from '../auth/authStore'
import { useUiStore } from '../ui/uiStore'

vi.mock('../auth/authStore', () => ({ useAuthStore: vi.fn() }))
vi.mock('../ui/uiStore', () => ({ useUiStore: vi.fn() }))

function renderNavbar(initialPath = '/') {
  vi.mocked(useAuthStore).mockReturnValue({ user: null, isAuthenticated: false, logout: vi.fn() } as any)
  vi.mocked(useUiStore).mockReturnValue({ isDrawerOpen: false, openDrawer: vi.fn(), closeDrawer: vi.fn() } as any)

  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<Navbar />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('Navbar', () => {
  it('logo link navigates to home when clicked', async () => {
    renderNavbar('/cart')
    await userEvent.click(screen.getByRole('link', { name: /comercyo/i }))
    expect(window.location.pathname).toBe('/')
  })
})
