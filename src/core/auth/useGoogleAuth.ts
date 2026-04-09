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
