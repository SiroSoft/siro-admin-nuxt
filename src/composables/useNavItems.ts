import { useI18n } from "~/composables/useI18n"
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  FileText,
  FolderTree,
  Tags,
  User,
  Settings,
} from "lucide-vue-next"

/**
 * Single source of truth for sidebar navigation (desktop + mobile).
 * Labels are translated; missing categories/tags/profile previously made
 * the mobile menu stale and English-only.
 */
export function useNavItems() {
  const { t } = useI18n()

  const navItems = computed(() => [
    { href: "/", label: t("common.dashboard"), icon: LayoutDashboard },
    { href: "/users", label: t("common.users"), icon: Users },
    { href: "/orders", label: t("common.orders"), icon: ShoppingCart },
    { href: "/products", label: t("common.products"), icon: Package },
    { href: "/posts", label: t("common.posts"), icon: FileText },
    { href: "/categories", label: t("common.categories"), icon: FolderTree },
    { href: "/tags", label: t("common.tags"), icon: Tags },
    { href: "/profile", label: t("common.profile"), icon: User },
    { href: "/settings", label: t("common.settings"), icon: Settings },
  ])

  return { navItems }
}
