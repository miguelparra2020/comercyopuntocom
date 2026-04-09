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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Comercyo</h1>
      <p style={{ color: '#888' }}>Inicia sesión para continuar</p>
      <GoogleLogin onSuccess={onSuccess} onError={() => console.error('Google login failed')} />
    </div>
  )
}
