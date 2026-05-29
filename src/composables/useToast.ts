export interface ToastItem {
  id: string
  title: string
  description?: string
  variant: "default" | "destructive" | "success" | "warning" | "info"
}

const state = reactive<{ toasts: ToastItem[] }>({ toasts: [] })

let count = 0

const autoDismissVariants: ToastItem["variant"][] = ["default", "success", "warning", "info"]

function add(t: ToastItem) {
  state.toasts.push(t)
  if (autoDismissVariants.includes(t.variant)) {
    setTimeout(() => {
      state.toasts = state.toasts.filter((x) => x.id !== t.id)
    }, 5000)
  }
}

export function useToast() {
  function dismiss(id: string) {
    state.toasts = state.toasts.filter((t) => t.id !== id)
  }

  return {
    toasts: computed(() => state.toasts),
    dismiss,
    success(title: string, description?: string) {
      add({ id: String(++count), title, description, variant: "success" })
    },
    error(title: string, description?: string) {
      add({ id: String(++count), title, description, variant: "destructive" })
    },
    warning(title: string, description?: string) {
      add({ id: String(++count), title, description, variant: "warning" })
    },
    info(title: string, description?: string) {
      add({ id: String(++count), title, description, variant: "info" })
    },
  }
}
