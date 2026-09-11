import enMessages from "~/locales/en"

type NestedKeyOf<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? `${K}.${NestedKeyOf<T[K]>}` : never }[keyof T]
  : ""

type Messages = typeof enMessages
type TranslationKey = NestedKeyOf<Messages> | (string & {})

export function useI18n() {
  const locale = useState<"en" | "vi" | "de" | "zh" | "ja">("locale", () => {
    if (import.meta.client) {
      return (localStorage.getItem("siro_locale") as "en" | "vi" | "de" | "zh" | "ja") || "en"
    }
    return "en"
  })

  // Seed English synchronously so t() never renders raw keys on first
  // paint (dynamic locale chunks load async below). Other locales are
  // fetched on demand and reactively replace the strings once loaded.
  const messages = useState<Record<string, Messages>>("messages", () => ({ en: enMessages }))

  if (import.meta.client && !messages.value[locale.value]) {
    void loadLocale(locale.value)
  }

  async function loadLocale(loc: "en" | "vi" | "de" | "zh" | "ja") {
    if (messages.value[loc]) return
    if (import.meta.client) {
      const mod =
        loc === "vi" ? await import("~/locales/vi") :
        loc === "de" ? await import("~/locales/de") :
        loc === "zh" ? await import("~/locales/zh") :
        loc === "ja" ? await import("~/locales/ja") :
        await import("~/locales/en")
      messages.value[loc] = mod.default as Messages
    } else {
      const mod =
        loc === "vi" ? await import("~/locales/vi") :
        loc === "de" ? await import("~/locales/de") :
        loc === "zh" ? await import("~/locales/zh") :
        loc === "ja" ? await import("~/locales/ja") :
        await import("~/locales/en")
      messages.value[loc] = mod.default as Messages
    }
  }

  async function initLocale(loc: "en" | "vi" | "de" | "zh" | "ja") {
    await loadLocale(loc)
  }

  function setLocale(loc: "en" | "vi" | "de" | "zh" | "ja") {
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
