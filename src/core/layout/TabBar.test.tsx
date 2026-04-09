import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { TabBar } from './TabBar'
import { useUiStore } from '../ui/uiStore'

vi.mock('../ui/uiStore', () => ({
  useUiStore: vi.fn(),
}))

vi.mock('../auth/authStore', () => ({
  useAuthStore: vi.fn().mockReturnValue({ isAuthenticated: false }),
}))

describe('TabBar', () => {
  it('renders Explorar and Crear tabs', () => {
    vi.mocked(useUiStore).mockReturnValue({
      activeTab: 'buyer',
      setActiveTab: vi.fn(),
    } as any)

    render(<MemoryRouter><TabBar /></MemoryRouter>)

    expect(screen.getByText('Explorar')).toBeInTheDocument()
    expect(screen.getByText('Crear')).toBeInTheDocument()
  })

  it('calls setActiveTab with "saas" when Crear is clicked', async () => {
    const setActiveTab = vi.fn()
    vi.mocked(useUiStore).mockReturnValue({
      activeTab: 'buyer',
      setActiveTab,
    } as any)

    render(<MemoryRouter><TabBar /></MemoryRouter>)
    await userEvent.click(screen.getByText('Crear'))

    expect(setActiveTab).toHaveBeenCalledWith('saas')
  })
})
