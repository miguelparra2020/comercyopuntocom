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
