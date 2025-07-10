import type React from "react"
import { Home, Users, BookOpen } from "lucide-react"
import { useEffect } from "react"

export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}
export const adminNavigation: NavigationItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Usuarios", href: "/dashboard/users", icon: Users },
  { name: "Cursos", href: "/dashboard/courses", icon: BookOpen },
]
