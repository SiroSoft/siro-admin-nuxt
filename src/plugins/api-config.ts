import { setApiBaseUrl } from "~/services/api"

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  setApiBaseUrl(config.public.apiUrl as string)
})
