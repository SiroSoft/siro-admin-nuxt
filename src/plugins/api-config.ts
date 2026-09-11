import { setApiBaseUrl, setFeToken } from "~/services/api"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  setApiBaseUrl(config.public.apiUrl as string)
  setFeToken((config.public.feToken as string) || "")
})
