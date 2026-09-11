import enMessages from "~/locales/en"
import viMessages from "~/locales/vi"
import deMessages from "~/locales/de"
import zhMessages from "~/locales/zh"
import jaMessages from "~/locales/ja"

type SchemaMessages = typeof enMessages

const SCHEMA_MESSAGES: Record<string, SchemaMessages> = {
  en: enMessages,
  vi: viMessages,
  de: deMessages,
  zh: zhMessages,
  ja: jaMessages,
}

function getSchemaLocale(): string {
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

// Translation helper for module-level Zod schemas where the useI18n()
// setup context is unavailable. Mirrors the tApi() pattern in services/api.ts:
// dictionaries are imported directly and the locale is read from localStorage.
export function tSchema(key: string, params?: Record<string, string | number>): string {
  const loc = getSchemaLocale()
  const dict = SCHEMA_MESSAGES[loc] ?? SCHEMA_MESSAGES.en
  const msg = resolvePath(dict, key) ?? resolvePath(SCHEMA_MESSAGES.en, key) ?? key
  if (params && typeof msg === "string") {
    return msg.replace(/\{\{(\w+)\}\}/g, (_, p) => String(params[p] ?? ""))
  }
  return String(msg ?? key)
}
