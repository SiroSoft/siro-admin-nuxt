export function useDebounce<T>(value: Ref<T>, delayMs = 300): Ref<T> {
  const debounced = ref<T>(unref(value)) as Ref<T>

  let timer: ReturnType<typeof setTimeout> | null = null

  watch(
    () => unref(value),
    (newVal) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        debounced.value = newVal as T
      }, delayMs)
    },
  )

  return debounced
}
