import { Link, useLocation } from "@remix-run/react"
import { Sheet, SheetContent } from "~/components/ui/sheet"
import { Logo } from "~/components/ui/logo"
import type { NavigationItem } from "./navigation"

interface MobileSidebarProps {
  navigation: NavigationItem[]
  title?: string
  isOpen: boolean
  onClose: () => void
}

export function MobileSidebar({ navigation, title, isOpen, onClose }: MobileSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Logo />
            {title && <span className="text-sm text-gray-500">{title}</span>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-purple-100 text-purple-900" : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={onClose}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
