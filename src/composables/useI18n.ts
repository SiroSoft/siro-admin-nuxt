import en from "~/locales/en"
import vi from "~/locales/vi"

type NestedKeyOf<T> = T extends Record<string, unknown>
  ? { [K in keyof T]: K extends string ? `${K}.${NestedKeyOf<T[K]>}` : never }[keyof T]
  : ""

type Messages = typeof en
type TranslationKey = NestedKeyOf<Messages> | (string & {})

const messages: Record<string, Messages> = { en, vi }

export function useI18n() {
  const locale = useState<"en" | "vi">("locale", () => {
    if (import.meta.client) {
      return (localStorage.getItem("siro_locale") as "en" | "vi") || "en"
    }
    return "en"
  })

  function setLocale(loc: "en" | "vi") {
    locale.value = loc
    if (import.meta.client) {
      localStorage.setItem("siro_locale", loc)
    }
  }

  function resolve(obj: any, path: string): any {
    return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj)
  }

  function t(key: TranslationKey, params?: Record<string, string | number>): string {
    const msg = resolve(messages[locale.value], key as string) ?? resolve(messages.en, key as string) ?? key
    if (params && typeof msg === "string") {
      return msg.replace(/\{\{(\w+)\}\}/g, (_, p) => String(params[p] ?? ""))
    }
    return msg as string
  }

  return { locale, setLocale, t }
}
