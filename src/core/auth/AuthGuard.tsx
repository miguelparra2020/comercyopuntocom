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
