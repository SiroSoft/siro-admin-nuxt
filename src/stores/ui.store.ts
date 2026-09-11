import { defineStore } from "pinia"

const SIDEBAR_KEY = "siro_sidebar_collapsed"

export const useUiStore = defineStore("ui", () => {
  const sidebarCollapsed = ref(
    typeof window !== "undefined" ? localStorage.getItem(SIDEBAR_KEY) === "1" : false,
  )
  const mobileSidebarOpen = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    try {
      localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed.value ? "1" : "0")
    } catch {
      // private mode etc. — collapse simply won't persist
    }
  }

  function setMobileSidebar(open: boolean) {
    mobileSidebarOpen.value = open
  }

  return {
    sidebarCollapsed,
    mobileSidebarOpen,
    toggleSidebar,
    setMobileSidebar,
  }
})
