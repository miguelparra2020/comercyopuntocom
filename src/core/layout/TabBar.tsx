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
