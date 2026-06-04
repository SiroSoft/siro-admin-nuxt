import type en from "~/locales/en"

type NestedKeyOf<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? `${K}.${NestedKeyOf<T[K]>}` : never }[keyof T]
  : ""

type Messages = typeof en
type TranslationKey = NestedKeyOf<Messages> | (string & {})

export function useI18n() {
  const locale = useState<"en" | "vi">("locale", () => {
    if (import.meta.client) {
      return (localStorage.getItem("siro_locale") as "en" | "vi") || "en"
    }
    return "en"
  })

  const messages = useState<Record<string, Messages>>("messages", () => ({}))

  async function loadLocale(loc: "en" | "vi") {
    if (messages.value[loc]) return
    if (import.meta.client) {
      const mod = loc === "vi" ? await import("~/locales/vi") : await import("~/locales/en")
      messages.value[loc] = mod.default as Messages
    } else {
      const mod = loc === "vi" ? await import("~/locales/vi") : await import("~/locales/en")
      messages.value[loc] = mod.default as Messages
    }
  }

  async function initLocale(loc: "en" | "vi") {
    await loadLocale(loc)
  }

  function setLocale(loc: "en" | "vi") {
    locale.value = loc
    if (import.meta.client) {
      localStorage.setItem("siro_locale", loc)
    }
  }

  function resolve<T>(obj: T, path: string): unknown {
    return path.split(".").reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === "object" && part in acc) {
        return (acc as Record<string, unknown>)[part]
      }
      return undefined
    }, obj as unknown)
  }

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    const msgs = messages.value
    const msg = resolve(msgs[locale.value], key as string) ?? resolve(msgs.en, key as string) ?? key
    if (params && typeof msg === "string") {
      return msg.replace(/\{\{(\w+)\}\}/g, (_, p) => String(params[p] ?? ""))
    }
    return String(msg ?? key)
  }

  return { locale, setLocale, t, initLocale }
}
