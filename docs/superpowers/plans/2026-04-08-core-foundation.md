# Comercyo — Core Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the app shell, authentication, routing, and data layer that both Buyer and SaaS worlds depend on — a working app with Google login, TabBar navigation, Navbar, Drawer, and protected routes.

**Architecture:** Single React app. Footer TabBar switches between Buyer and SaaS worlds. Google OAuth sends `id_token` to Hono backend which returns a custom JWT. Zustand manages UI state only. TanStack Query manages all server state. Two Axios instances: `apiPublic` (no auth) and `apiPrivate` (JWT injected via interceptor).

**Tech Stack:** React 18, TypeScript, Vite, React Router v6, Zustand v5, TanStack Query v5, Axios, @react-oauth/google, Vitest, @testing-library/react

---

## File Map

| File | Responsibility |
|---|---|
| `src/shared/types/index.ts` | Global TypeScript types (User, Business, etc.) |
| `src/shared/api/client.ts` | Axios instances + interceptor setup function |
| `src/shared/api/queryClient.ts` | TanStack QueryClient singleton |
| `src/core/auth/authStore.ts` | Zustand auth store (user, jwt, login, logout) |
| `src/core/auth/authStore.test.ts` | Unit tests for authStore |
| `src/core/auth/AuthGuard.tsx` | Route guard — redirects unauthenticated users |
| `src/core/auth/AuthGuard.test.tsx` | Tests for AuthGuard redirect behavior |
| `src/core/auth/LoginPage.tsx` | Google login screen |
| `src/core/auth/useGoogleAuth.ts` | Hook — handles Google credential → JWT flow |
| `src/core/ui/uiStore.ts` | Zustand UI store (drawer, activeTab) |
| `src/core/ui/uiStore.test.ts` | Unit tests for uiStore |
| `src/core/layout/AppShell.tsx` | Root layout: Navbar + outlet + TabBar |
| `src/core/layout/Navbar.tsx` | Logo + route title + avatar |
| `src/core/layout/Drawer.tsx` | Right slide-in drawer (profile, cart, orders) |
| `src/core/layout/Drawer.test.tsx` | Tests for drawer open/close |
| `src/core/layout/TabBar.tsx` | Footer tabs: Explorar / Crear |
| `src/core/layout/TabBar.test.tsx` | Tests for tab navigation |
| `src/core/router/index.tsx` | Route definitions (buyer + saas + guards) |
| `src/main.tsx` | Entry point — wires providers |
| `src/App.tsx` | Router outlet root |
| `vite.config.ts` | Updated with test config |
| `.env.example` | Environment variable template |

---

## Task 1: Install dependencies and configure test runner

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `vite.config.ts`
- Create: `.env.example`
- Create: `.env.local`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install react-router-dom zustand @tanstack/react-query axios @react-oauth/google
```

Expected: packages added to `dependencies` in package.json.

- [ ] **Step 2: Install dev/test dependencies**

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 3: Update vite.config.ts with test configuration**

Replace the full file content:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    css: false,
  },
})
```

- [ ] **Step 4: Create test setup file**

Create `src/test-setup.ts`:

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 5: Create .env.example**

Create `.env.example`:

```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here
```

- [ ] **Step 6: Create .env.local**

Create `.env.local` (not committed — already in .gitignore via *.local):

```
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id
```

- [ ] **Step 7: Add test script to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest",
"test:run": "vitest run"
```

- [ ] **Step 8: Verify test runner works**

```bash
npm run test:run
```

Expected: "No test files found" — no errors.

- [ ] **Step 9: Commit**

```bash
git add vite.config.ts src/test-setup.ts .env.example package.json package-lock.json
git commit -m "feat: install dependencies and configure vitest"
```

---

## Task 2: Define shared TypeScript types

**Files:**
- Create: `src/shared/types/index.ts`

- [ ] **Step 1: Create types file**

Create `src/shared/types/index.ts`:

```typescript
export interface User {
  id: string
  email: string
  name: string
  avatar: string
}

export interface Business {
  id: string
  name: string
  slug: string
  logo: string | null
  role: 'owner' | 'employee' | 'seller'
}

export interface CartItem {
  id: string
  productId: string
  storeId: string
  storeSlug: string
  storeName: string
  productName: string
  price: number
  quantity: number
  addedAt: string
}

export interface SubProject {
  id: string
  name: string
  slug: string
}

export interface Route {
  id: string
  name: string
  slug: string
  subProjectId: string
}

export interface Module {
  id: string
  name: string
  slug: string
  routeId: string
  permissions: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
}

export interface UserPermissions {
  subProjects: SubProject[]
  routes: Route[]
  modules: Module[]
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/types/index.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 3: Configure Axios instances

**Files:**
- Create: `src/shared/api/client.ts`

- [ ] **Step 1: Write failing test**

Create `src/shared/api/client.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('apiPrivate interceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('injects Authorization header when JWT exists in localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('test-jwt-token')
    const { apiPrivate } = await import('./client')

    const config = await apiPrivate.interceptors.request.handlers[0].fulfilled({
      headers: {} as any,
      url: '/test',
      method: 'get',
    } as any)

    expect(config.headers.Authorization).toBe('Bearer test-jwt-token')
  })

  it('does not inject Authorization header when JWT is absent', async () => {
    localStorageMock.getItem.mockReturnValue(null)
    const { apiPrivate } = await import('./client')

    const config = await apiPrivate.interceptors.request.handlers[0].fulfilled({
      headers: {} as any,
      url: '/test',
      method: 'get',
    } as any)

    expect(config.headers.Authorization).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- src/shared/api/client.test.ts
```

Expected: FAIL — "Cannot find module './client'"

- [ ] **Step 3: Create the Axios client**

Create `src/shared/api/client.ts`:

```typescript
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const apiPublic = axios.create({ baseURL: BASE_URL })

export const apiPrivate = axios.create({ baseURL: BASE_URL })

apiPrivate.interceptors.request.use((config) => {
  const jwt = localStorage.getItem('jwt')
  if (jwt) {
    config.headers.Authorization = `Bearer ${jwt}`
  }
  return config
})

/**
 * Call once at app startup (main.tsx) to attach the 401 → logout handler.
 * Kept separate to avoid circular dependency with authStore.
 */
export function setupUnauthorizedInterceptor(onUnauthorized: () => void) {
  apiPrivate.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        onUnauthorized()
      }
      return Promise.reject(error)
    }
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/shared/api/client.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/shared/api/client.ts src/shared/api/client.test.ts
git commit -m "feat: add Axios instances with JWT interceptor"
```

---

## Task 4: Configure TanStack QueryClient

**Files:**
- Create: `src/shared/api/queryClient.ts`

- [ ] **Step 1: Create queryClient**

Create `src/shared/api/queryClient.ts`:

```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})
```

- [ ] **Step 2: Commit**

```bash
git add src/shared/api/queryClient.ts
git commit -m "feat: add TanStack QueryClient config"
```

---

## Task 5: Build authStore (Zustand)

**Files:**
- Create: `src/core/auth/authStore.ts`
- Create: `src/core/auth/authStore.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/core/auth/authStore.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

describe('authStore', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    const { useAuthStore } = await import('./authStore')
    useAuthStore.getState().logout()
  })

  it('starts unauthenticated', async () => {
    const { useAuthStore } = await import('./authStore')
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.jwt).toBeNull()
  })

  it('login sets user, jwt, and isAuthenticated', async () => {
    const { useAuthStore } = await import('./authStore')
    const user = { id: '1', email: 'a@a.com', name: 'Test', avatar: '' }

    useAuthStore.getState().login(user, 'test-jwt')

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.user).toEqual(user)
    expect(state.jwt).toBe('test-jwt')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('jwt', 'test-jwt')
  })

  it('logout clears user, jwt, and isAuthenticated', async () => {
    const { useAuthStore } = await import('./authStore')
    const user = { id: '1', email: 'a@a.com', name: 'Test', avatar: '' }
    useAuthStore.getState().login(user, 'test-jwt')

    useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.jwt).toBeNull()
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('jwt')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- src/core/auth/authStore.test.ts
```

Expected: FAIL — "Cannot find module './authStore'"

- [ ] **Step 3: Create authStore**

Create `src/core/auth/authStore.ts`:

```typescript
import { create } from 'zustand'
import type { User } from '../../shared/types'

interface AuthStore {
  user: User | null
  jwt: string | null
  isAuthenticated: boolean
  login: (user: User, jwt: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  jwt: localStorage.getItem('jwt'),
  isAuthenticated: !!localStorage.getItem('jwt'),

  login: (user, jwt) => {
    localStorage.setItem('jwt', jwt)
    set({ user, jwt, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('jwt')
    set({ user: null, jwt: null, isAuthenticated: false })
  },
}))
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/core/auth/authStore.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/core/auth/authStore.ts src/core/auth/authStore.test.ts
git commit -m "feat: add authStore with login/logout actions"
```

---

## Task 6: Build uiStore (Zustand)

**Files:**
- Create: `src/core/ui/uiStore.ts`
- Create: `src/core/ui/uiStore.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/core/ui/uiStore.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('uiStore', () => {
  beforeEach(async () => {
    const { useUiStore } = await import('./uiStore')
    useUiStore.setState({ isDrawerOpen: false, activeTab: 'buyer' })
  })

  it('starts with drawer closed and buyer tab active', async () => {
    const { useUiStore } = await import('./uiStore')
    const state = useUiStore.getState()
    expect(state.isDrawerOpen).toBe(false)
    expect(state.activeTab).toBe('buyer')
  })

  it('openDrawer sets isDrawerOpen to true', async () => {
    const { useUiStore } = await import('./uiStore')
    useUiStore.getState().openDrawer()
    expect(useUiStore.getState().isDrawerOpen).toBe(true)
  })

  it('closeDrawer sets isDrawerOpen to false', async () => {
    const { useUiStore } = await import('./uiStore')
    useUiStore.getState().openDrawer()
    useUiStore.getState().closeDrawer()
    expect(useUiStore.getState().isDrawerOpen).toBe(false)
  })

  it('setActiveTab updates the active tab', async () => {
    const { useUiStore } = await import('./uiStore')
    useUiStore.getState().setActiveTab('saas')
    expect(useUiStore.getState().activeTab).toBe('saas')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- src/core/ui/uiStore.test.ts
```

Expected: FAIL — "Cannot find module './uiStore'"

- [ ] **Step 3: Create uiStore**

Create `src/core/ui/uiStore.ts`:

```typescript
import { create } from 'zustand'

type ActiveTab = 'buyer' | 'saas'

interface UiStore {
  isDrawerOpen: boolean
  activeTab: ActiveTab
  openDrawer: () => void
  closeDrawer: () => void
  setActiveTab: (tab: ActiveTab) => void
}

export const useUiStore = create<UiStore>()((set) => ({
  isDrawerOpen: false,
  activeTab: 'buyer',
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}))
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/core/ui/uiStore.test.ts
```

Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
git add src/core/ui/uiStore.ts src/core/ui/uiStore.test.ts
git commit -m "feat: add uiStore with drawer and tab state"
```

---

## Task 7: Build Google Auth hook and LoginPage

**Files:**
- Create: `src/core/auth/useGoogleAuth.ts`
- Create: `src/core/auth/LoginPage.tsx`

- [ ] **Step 1: Create useGoogleAuth hook**

Create `src/core/auth/useGoogleAuth.ts`:

```typescript
import { apiPublic } from '../../shared/api/client'
import { useAuthStore } from './authStore'
import type { User } from '../../shared/types'

interface GoogleAuthResponse {
  jwt: string
  user: User
}

export function useGoogleAuth() {
  const { login } = useAuthStore()

  async function handleCredential(credential: string) {
    const response = await apiPublic.post<GoogleAuthResponse>('/auth/google', {
      credential,
    })
    login(response.data.user, response.data.jwt)
  }

  return { handleCredential }
}
```

- [ ] **Step 2: Create LoginPage**

Create `src/core/auth/LoginPage.tsx`:

```typescript
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGoogleAuth } from './useGoogleAuth'

export function LoginPage() {
  const { handleCredential } = useGoogleAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string })?.from ?? '/saas/projects'

  async function onSuccess(credentialResponse: { credential?: string }) {
    if (!credentialResponse.credential) return
    await handleCredential(credentialResponse.credential)
    navigate(from, { replace: true })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Comercyo</h1>
      <p style={{ color: '#888' }}>Inicia sesión para continuar</p>
      <GoogleLogin onSuccess={onSuccess} onError={() => console.error('Google login failed')} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/core/auth/useGoogleAuth.ts src/core/auth/LoginPage.tsx
git commit -m "feat: add Google auth hook and login page"
```

---

## Task 8: Build AuthGuard

**Files:**
- Create: `src/core/auth/AuthGuard.tsx`
- Create: `src/core/auth/AuthGuard.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/core/auth/AuthGuard.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthGuard } from './AuthGuard'
import { useAuthStore } from './authStore'

vi.mock('./authStore', () => ({
  useAuthStore: vi.fn(),
}))

function renderWithRouter(isAuthenticated: boolean, initialPath = '/saas/projects') {
  vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated } as any)
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<AuthGuard />}>
          <Route path="/saas/projects" element={<div>Protected Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

describe('AuthGuard', () => {
  it('renders protected content when authenticated', () => {
    renderWithRouter(true)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to /login when not authenticated', () => {
    renderWithRouter(false)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- src/core/auth/AuthGuard.test.tsx
```

Expected: FAIL — "Cannot find module './AuthGuard'"

- [ ] **Step 3: Create AuthGuard**

Create `src/core/auth/AuthGuard.tsx`:

```typescript
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from './authStore'

export function AuthGuard() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return <Outlet />
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/core/auth/AuthGuard.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/core/auth/AuthGuard.tsx src/core/auth/AuthGuard.test.tsx
git commit -m "feat: add AuthGuard with redirect to login"
```

---

## Task 9: Build TabBar

**Files:**
- Create: `src/core/layout/TabBar.tsx`
- Create: `src/core/layout/TabBar.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/core/layout/TabBar.test.tsx`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- src/core/layout/TabBar.test.tsx
```

Expected: FAIL — "Cannot find module './TabBar'"

- [ ] **Step 3: Create TabBar**

Create `src/core/layout/TabBar.tsx`:

```typescript
import { useNavigate } from 'react-router-dom'
import { useUiStore } from '../ui/uiStore'
import { useAuthStore } from '../auth/authStore'

export function TabBar() {
  const { activeTab, setActiveTab } = useUiStore()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  function handleBuyerTab() {
    setActiveTab('buyer')
    navigate('/')
  }

  function handleSaasTab() {
    setActiveTab('saas')
    if (isAuthenticated) {
      navigate('/saas/projects')
    } else {
      navigate('/login', { state: { from: '/saas/projects' } })
    }
  }

  const tabStyle = (tab: 'buyer' | 'saas'): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: activeTab === tab ? '#646cff' : '#888',
    fontSize: '0.75rem',
    gap: '0.2rem',
  })

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        borderTop: '1px solid #2a2a2a',
        background: '#1a1a1a',
        height: '60px',
        zIndex: 100,
      }}
    >
      <button style={tabStyle('buyer')} onClick={handleBuyerTab} aria-label="Explorar">
        <span style={{ fontSize: '1.2rem' }}>🔍</span>
        <span>Explorar</span>
      </button>
      <button style={tabStyle('saas')} onClick={handleSaasTab} aria-label="Crear">
        <span style={{ fontSize: '1.2rem' }}>✨</span>
        <span>Crear</span>
      </button>
    </nav>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/core/layout/TabBar.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/core/layout/TabBar.tsx src/core/layout/TabBar.test.tsx
git commit -m "feat: add TabBar with Explorar/Crear navigation"
```

---

## Task 10: Build Drawer

**Files:**
- Create: `src/core/layout/Drawer.tsx`
- Create: `src/core/layout/Drawer.test.tsx`

- [ ] **Step 1: Write failing tests**

Create `src/core/layout/Drawer.test.tsx`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:run -- src/core/layout/Drawer.test.tsx
```

Expected: FAIL — "Cannot find module './Drawer'"

- [ ] **Step 3: Create Drawer**

Create `src/core/layout/Drawer.tsx`:

```typescript
import { useNavigate } from 'react-router-dom'
import { useUiStore } from '../ui/uiStore'
import { useAuthStore } from '../auth/authStore'

export function Drawer() {
  const { isDrawerOpen, closeDrawer } = useUiStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!isDrawerOpen) return null

  function handleNavigate(path: string) {
    closeDrawer()
    navigate(path)
  }

  function handleLogout() {
    logout()
    closeDrawer()
    navigate('/')
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        data-testid="drawer-backdrop"
        onClick={closeDrawer}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: '350px',
          background: '#1e1e1e',
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #2a2a2a',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#646cff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>
            {user?.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : '👤'}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{user?.name}</div>
            <div style={{ color: '#888', fontSize: '0.75rem' }}>{user?.email}</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ flex: 1 }}>
          {[
            { label: 'Mi perfil', icon: '👤', path: '/profile' },
            { label: 'Carrito', icon: '🛒', path: '/cart' },
            { label: 'Mis pedidos', icon: '📦', path: '/orders' },
          ].map(({ label, icon, path }) => (
            <button
              key={label}
              onClick={() => handleNavigate(path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left' }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '1rem', borderTop: '1px solid #2a2a2a' }}>
          <button
            onClick={handleLogout}
            style={{ background: 'none', border: 'none', color: '#e05252', cursor: 'pointer', fontSize: '0.9rem' }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm run test:run -- src/core/layout/Drawer.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/core/layout/Drawer.tsx src/core/layout/Drawer.test.tsx
git commit -m "feat: add slide-in Drawer with profile, cart, orders"
```

---

## Task 11: Build Navbar

**Files:**
- Create: `src/core/layout/Navbar.tsx`

- [ ] **Step 1: Create Navbar**

Create `src/core/layout/Navbar.tsx`:

```typescript
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../auth/authStore'
import { useUiStore } from '../ui/uiStore'

const ROUTE_TITLES: Record<string, string> = {
  '/': 'Explorar',
  '/cart': 'Mi Carrito',
  '/orders': 'Mis Pedidos',
  '/profile': 'Mi Perfil',
  '/login': 'Ingresar',
  '/saas/projects': 'Mis Proyectos',
}

function getRouteTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  if (pathname.startsWith('/store/') && pathname.includes('/product/')) return 'Producto'
  if (pathname.startsWith('/store/')) return 'Tienda'
  if (pathname.includes('/dashboard')) return 'Dashboard'
  if (pathname.includes('/inventory')) return 'Inventario'
  if (pathname.includes('/clients')) return 'Clientes'
  if (pathname.includes('/suppliers')) return 'Proveedores'
  if (pathname.includes('/invoices')) return 'Facturas'
  if (pathname.includes('/orders')) return 'Pedidos'
  if (pathname.includes('/settings')) return 'Ajustes'
  return 'Comercyo'
}

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore()
  const { openDrawer } = useUiStore()
  const location = useLocation()
  const title = getRouteTitle(location.pathname)

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: '#1a1a1a',
        borderBottom: '1px solid #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
        zIndex: 100,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{ background: '#646cff', color: 'white', fontWeight: 'bold', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.9rem' }}>
          C
        </div>
        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{title}</span>
      </div>

      <button
        onClick={isAuthenticated ? openDrawer : () => {}}
        aria-label="Menú de usuario"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: isAuthenticated ? '#646cff' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%' }} />
            : <span style={{ fontSize: '1rem' }}>👤</span>
          }
        </div>
      </button>
    </header>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/layout/Navbar.tsx
git commit -m "feat: add Navbar with logo, route title, and avatar"
```

---

## Task 12: Build AppShell

**Files:**
- Create: `src/core/layout/AppShell.tsx`

- [ ] **Step 1: Create AppShell**

Create `src/core/layout/AppShell.tsx`:

```typescript
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { TabBar } from './TabBar'
import { Drawer } from './Drawer'

export function AppShell() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '56px', paddingBottom: '60px', minHeight: '100vh' }}>
        <Outlet />
      </main>
      <TabBar />
      <Drawer />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/core/layout/AppShell.tsx
git commit -m "feat: add AppShell composing Navbar, Outlet, TabBar, Drawer"
```

---

## Task 13: Configure router

**Files:**
- Create: `src/core/router/index.tsx`
- Create placeholder pages: `src/buyer/pages/HomePage.tsx`, `src/saas/pages/ProjectsPage.tsx`

- [ ] **Step 1: Create placeholder HomePage**

Create `src/buyer/pages/HomePage.tsx`:

```typescript
export function HomePage() {
  return <div style={{ padding: '1rem' }}>Home — Explorar tiendas (próximamente)</div>
}
```

- [ ] **Step 2: Create placeholder ProjectsPage**

Create `src/saas/pages/ProjectsPage.tsx`:

```typescript
export function ProjectsPage() {
  return <div style={{ padding: '1rem' }}>Mis Proyectos (próximamente)</div>
}
```

- [ ] **Step 3: Create router**

Create `src/core/router/index.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../layout/AppShell'
import { AuthGuard } from '../auth/AuthGuard'
import { LoginPage } from '../auth/LoginPage'
import { HomePage } from '../../buyer/pages/HomePage'
import { ProjectsPage } from '../../saas/pages/ProjectsPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      // Public buyer routes
      { index: true, element: <HomePage /> },

      // Auth
      { path: 'login', element: <LoginPage /> },

      // Protected SaaS routes
      {
        element: <AuthGuard />,
        children: [
          { path: 'saas/projects', element: <ProjectsPage /> },
        ],
      },
    ],
  },
])
```

- [ ] **Step 4: Commit**

```bash
git add src/core/router/index.tsx src/buyer/pages/HomePage.tsx src/saas/pages/ProjectsPage.tsx
git commit -m "feat: configure router with buyer routes, auth guard, and SaaS routes"
```

---

## Task 14: Wire entry point

**Files:**
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Update main.tsx**

Replace `src/main.tsx` with:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './shared/api/queryClient'
import { router } from './core/router'
import { setupUnauthorizedInterceptor } from './shared/api/client'
import { useAuthStore } from './core/auth/authStore'
import './index.css'

setupUnauthorizedInterceptor(() => {
  useAuthStore.getState().logout()
})

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
```

- [ ] **Step 2: Clear App.tsx (no longer needed)**

Replace `src/App.tsx` with:

```typescript
// App.tsx is no longer the root — routing is handled by core/router/index.tsx
// This file is kept as a placeholder.
export {}
```

- [ ] **Step 3: Start the dev server and verify**

```bash
npm run dev
```

Expected:
- App loads at `http://localhost:5173`
- Navbar shows at top with logo "C" and "Explorar"
- TabBar shows at bottom with Explorar / Crear tabs
- Clicking Crear redirects to `/login` (not authenticated)
- `/login` shows "Continuar con Google" button from Google Identity Services

- [ ] **Step 4: Run all tests**

```bash
npm run test:run
```

Expected: All tests PASS.

- [ ] **Step 5: Final commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "feat: wire app entry point with all providers and router"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Single App, dos mundos | Task 13 (router structure) |
| TabBar footer (Explorar / Crear) | Task 9 |
| Google OAuth → JWT flow | Task 7 |
| AuthGuard (cart, orders, SaaS) | Task 8 |
| Navbar con logo + ruta + avatar | Task 11 |
| Drawer 90% / max 350px con backdrop | Task 10 |
| Zustand authStore | Task 5 |
| Zustand uiStore | Task 6 |
| Axios apiPublic + apiPrivate + interceptor JWT | Task 3 |
| Interceptor 401 → logout | Task 3 (setupUnauthorizedInterceptor) |
| TanStack QueryClient | Task 4 |
| Proveedores de tipo en TypeScript | Task 2 |
| .env para VITE_GOOGLE_CLIENT_ID | Task 1 |

**Gaps:** Ninguno — todos los requisitos del Core Foundation tienen tarea asignada.
