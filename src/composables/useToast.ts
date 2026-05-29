import { STORAGE_KEYS } from "~/constants"

export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: "default" | "destructive"
}

const state = reactive<{ toasts: ToastItem[] }>({ toasts: [] })

let count = 0

function add(t: ToastItem) {
  state.toasts.push(t)
  setTimeout(() => {
    state.toasts = state.toasts.filter((x) => x.id !== t.id)
  }, 5000)
}

export function useToast() {
  function dismiss(id: string) {
    state.toasts = state.toasts.filter((t) => t.id !== id)
  }

  return {
    toasts: computed(() => state.toasts),
    dismiss,
    success(title: string, description?: string) {
      add({ id: String(++count), title, description, variant: "default" })
    },
    error(title: string, description?: string) {
      add({ id: String(++count), title, description, variant: "destructive" })
    },
  }
}
