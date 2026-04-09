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
