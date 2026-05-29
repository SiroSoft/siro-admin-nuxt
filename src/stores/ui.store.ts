import { defineStore } from "pinia"

export const useUiStore = defineStore("ui", () => {
  const sidebarCollapsed = ref(false)
  const mobileSidebarOpen = ref(false)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
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
