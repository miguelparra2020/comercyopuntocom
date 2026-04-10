import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../auth/authStore'
import { useUiStore } from '../ui/uiStore'
import { avatarBadgeCount } from './Drawer'

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
  const navigate = useNavigate()
  const title = getRouteTitle(location.pathname)

  function handleAvatarClick() {
    if (isAuthenticated) {
      openDrawer()
    } else {
      navigate('/login', { state: { from: location.pathname } })
    }
  }

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
        onClick={handleAvatarClick}
        aria-label="Menú de usuario"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, position: 'relative' }}
      >
        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: isAuthenticated ? '#646cff' : '#444', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {user?.avatar
            ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%' }} />
            : <span style={{ fontSize: '1rem' }}>👤</span>
          }
        </div>
        {isAuthenticated && avatarBadgeCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#e05252',
            color: '#fff',
            borderRadius: '999px',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            minWidth: '16px',
            height: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            border: '2px solid #1a1a1a',
          }}>
            {avatarBadgeCount}
          </span>
        )}
      </button>
    </header>
  )
}
