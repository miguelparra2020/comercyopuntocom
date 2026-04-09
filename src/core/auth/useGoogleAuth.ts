import { apiPublic } from '../../shared/api/client'
import { useAuthStore } from './authStore'
import type { User } from '../../shared/types'

interface GoogleAuthResponse {
  jwt: string
  user: User
}

function decodeJwtPayload(token: string): Record<string, string> {
  const payload = token.split('.')[1]
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
}

export function useGoogleAuth() {
  const { login } = useAuthStore()

  async function handleCredential(credential: string) {
    try {
      const response = await apiPublic.post<GoogleAuthResponse>('/auth/google', {
        credential,
      })
      login(response.data.user, response.data.jwt)
    } catch {
      // Backend no disponible — mock de desarrollo con los datos del token de Google
      if (import.meta.env.DEV) {
        const payload = decodeJwtPayload(credential)
        const user: User = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          avatar: payload.picture ?? '',
        }
        login(user, credential)
      } else {
        throw new Error('Error al iniciar sesión. Intenta de nuevo.')
      }
    }
  }

  return { handleCredential }
}
