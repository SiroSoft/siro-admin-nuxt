import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { STORAGE_KEYS } from "~/constants"

let BASE_URL = "http://localhost:8080"

export function setApiBaseUrl(url: string) {
  BASE_URL = url
  api.defaults.baseURL = url
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
})

interface QueueItem {
  resolve: (value: unknown) => void
  reject: (reason: unknown) => void
}

let failedQueue: QueueItem[] = []
let isRefreshing = false

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(undefined)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.headers) {
      config.headers["X-Request-Id"] = generateRequestId()
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (!error.response) {
      console.error("[API] Network Error:", error.message)
      return Promise.reject(error)
    }

    const { status } = error.response

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => api(originalRequest))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)

      if (!refreshToken) {
        processQueue(error)
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        window.location.href = "/login"
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL || BASE_URL}/api/auth/refresh`,
          { refresh_token: refreshToken },
        )
        const tokens = data.data || data
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.token)
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token)
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        window.location.href = "/login"
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (status === 403) {
      console.error("[API] Forbidden: You do not have permission to access this resource.")
    }

    if (status === 404) {
      console.error("[API] Resource not found.")
    }

    if (status === 422) {
      console.error("[API] Validation error:", error.response.data)
    }

    if (status === 429) {
      console.error("[API] Rate limit exceeded. Please try again later.")
    }

    if (status >= 500) {
      console.error(`[API] Server error (${status}):`, error.response.data)
    }

    return Promise.reject(error)
  },
)

export default api
