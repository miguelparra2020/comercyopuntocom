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
