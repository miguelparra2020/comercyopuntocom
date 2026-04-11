import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Drawer } from './Drawer'
import { useUiStore } from '../ui/uiStore'
import { useAuthStore } from '../auth/authStore'

vi.mock('../ui/uiStore', () => ({ useUiStore: vi.fn() }))
vi.mock('../auth/authStore', () => ({ useAuthStore: vi.fn() }))

const mockUser = { id: '1', name: 'Miguel', email: 'miguel@test.com', avatar: '' }

describe('Drawer', () => {
  it('is not visible when isDrawerOpen is false', () => {
    vi.mocked(useUiStore).mockReturnValue({ isDrawerOpen: false, closeDrawer: vi.fn() } as any)
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: vi.fn() } as any)

    render(<MemoryRouter><Drawer /></MemoryRouter>)
    expect(screen.queryByText('Mi perfil')).not.toBeInTheDocument()
  })

  it('shows user name and menu items when open', () => {
    vi.mocked(useUiStore).mockReturnValue({ isDrawerOpen: true, closeDrawer: vi.fn() } as any)
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: vi.fn() } as any)

    render(<MemoryRouter><Drawer /></MemoryRouter>)
    expect(screen.getByText('Miguel')).toBeInTheDocument()
    expect(screen.getByText('Mi perfil')).toBeInTheDocument()
    expect(screen.getByText('Carrito')).toBeInTheDocument()
    expect(screen.getByText('Mis pedidos')).toBeInTheDocument()
    expect(screen.getByText('Mis facturas')).toBeInTheDocument()
  })

  it('calls closeDrawer when backdrop is clicked', async () => {
    const closeDrawer = vi.fn()
    vi.mocked(useUiStore).mockReturnValue({ isDrawerOpen: true, closeDrawer } as any)
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: vi.fn() } as any)

    render(<MemoryRouter><Drawer /></MemoryRouter>)
    await userEvent.click(screen.getByTestId('drawer-backdrop'))

    expect(closeDrawer).toHaveBeenCalled()
  })
})
