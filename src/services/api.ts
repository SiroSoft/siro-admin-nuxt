import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios"
import { STORAGE_KEYS } from "~/constants"
import enMessages from "~/locales/en"
import viMessages from "~/locales/vi"
import deMessages from "~/locales/de"
import zhMessages from "~/locales/zh"
import jaMessages from "~/locales/ja"

type ApiMessages = typeof enMessages

const API_MESSAGES: Record<string, ApiMessages> = {
  en: enMessages,
  vi: viMessages,
  de: deMessages,
  zh: zhMessages,
  ja: jaMessages,
}

function getApiLocale(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("siro_locale") || "en"
  }
  return "en"
}

function resolvePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj as unknown)
}

export function tApi(key: string, params?: Record<string, string | number>): string {
  const loc = getApiLocale()
  const dict = API_MESSAGES[loc] ?? API_MESSAGES.en
  const msg = resolvePath(dict, key) ?? resolvePath(API_MESSAGES.en, key) ?? key
  if (params && typeof msg === "string") {
    return msg.replace(/\{\{(\w+)\}\}/g, (_, p) => String(params[p] ?? ""))
  }
  return String(msg ?? key)
}

let BASE_URL = "http://localhost:8080"
let FE_TOKEN = ""

export function setApiBaseUrl(url: string) {
  BASE_URL = url
  api.defaults.baseURL = url
}

export function setFeToken(token: string) {
  FE_TOKEN = token
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
    if (typeof window === "undefined") return config
    const locale = localStorage.getItem("siro_locale") || "en"
    if (config.headers) {
      config.headers["X-Locale"] = locale
    }
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (config.headers) {
      config.headers["X-Request-Id"] = generateRequestId()
      if (FE_TOKEN !== "") {
        config.headers["X-Siro-FE"] = FE_TOKEN
      }
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
      console.error(`[API] ${tApi("api.networkError")}`, error.message)
      return Promise.reject(error)
    }

    const { status } = error.response

    if (status === 401 && !originalRequest._retry) {
      if (typeof window === "undefined") return Promise.reject(error)
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
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"
        }
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
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (status === 403) {
      console.error(`[API] ${tApi("api.forbidden")}`)
    }

    if (status === 404) {
      console.error(`[API] ${tApi("api.notFound")}`)
    }

    if (status === 422) {
      const body = error.response.data as { errors?: Record<string, string[]>; meta?: { errors?: Record<string, string[]> }; message?: string }
      const fieldErrors = body?.errors ?? body?.meta?.errors
      if (fieldErrors) {
        const first = Object.values(fieldErrors)[0]?.[0]
        console.error(`[API] ${tApi("api.validationError")}`, first ?? body.message, fieldErrors)
      } else {
        console.error(`[API] ${tApi("api.validationError")}`, body)
      }
    }

    if (status === 429) {
      console.error(`[API] ${tApi("api.rateLimit")}`)
    }

    if (status >= 500) {
      console.error(`[API] ${tApi("api.serverError", { status })}`, error.response.data)
    }

    return Promise.reject(error)
  },
)

export default api
