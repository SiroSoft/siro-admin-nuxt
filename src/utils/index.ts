import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date?: string | Date | null): string {
  if (!date) return ""
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return ""
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d)
  } catch {
    return ""
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num)
}

export function formatRelativeTime(date?: string | Date | null): string {
  if (!date) return ""
  const now = Date.now()
  const d = new Date(date).getTime()
  if (isNaN(d)) return ""
  const diff = now - d
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (seconds < 60) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return formatDate(date)
}
