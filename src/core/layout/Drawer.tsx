import { useNavigate } from 'react-router-dom'
import { useUiStore } from '../ui/uiStore'
import { useAuthStore } from '../auth/authStore'

// TODO: replace with real data from stores/API
const cartCount = 2
const ordersCount = 6
const notificationsCount = 3
const chatCount = 1
export const avatarBadgeCount = 5

function Badge({ count }: { count: number }) {
  if (count === 0) return null
  return (
    <span style={{
      marginLeft: 'auto',
      background: '#e05252',
      color: '#fff',
      borderRadius: '999px',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      minWidth: '18px',
      height: '18px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 5px',
    }}>
      {count}
    </span>
  )
}

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

  const menuItems = [
    { label: 'Mi perfil',      icon: '👤', path: '/profile',       badge: 0 },
    { label: 'Carrito',        icon: '🛒', path: '/cart',          badge: cartCount },
    { label: 'Mis pedidos',    icon: '📦', path: '/orders',        badge: ordersCount },
    { label: 'Mis facturas',   icon: '🧾', path: '/invoices',      badge: 0 },
    { label: 'Notificaciones', icon: '🔔', path: '/notifications', badge: notificationsCount },
    { label: 'Chat',           icon: '💬', path: '/chat',          badge: chatCount },
  ]

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
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#646cff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
              {user?.avatar ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} /> : '👤'}
            </div>
            {avatarBadgeCount > 0 && (
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
                border: '2px solid #1e1e1e',
              }}>
                {avatarBadgeCount}
              </span>
            )}
          </div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{user?.name}</div>
            <div style={{ color: '#888', fontSize: '0.75rem' }}>{user?.email}</div>
          </div>
        </div>

        {/* Menu */}
        <div style={{ flex: 1 }}>
          {menuItems.map(({ label, icon, path, badge }) => (
            <button
              key={label}
              onClick={() => handleNavigate(path)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.9rem 1rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: '0.9rem', textAlign: 'left' }}
            >
              <span>{icon}</span>
              <span>{label}</span>
              <Badge count={badge} />
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
