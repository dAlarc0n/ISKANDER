import type React from "react"
import { useState } from "react"
import { Sidebar } from "./sidebar"
import { MobileSidebar } from "./mobile-sidebar"
import { Header } from "./header"
import type { NavigationItem } from "./navigation"

interface BaseLayoutProps {
  children: React.ReactNode
  navigation: NavigationItem[]
  userType: "admin" | "student"
  title?: string
  userName?: string
  userEmail?: string
}

export function BaseLayout({ children, navigation, userType, title, userName, userEmail }: BaseLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <MobileSidebar navigation={navigation} title={title} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Sidebar navigation={navigation} title={title} />
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          userType={userType}
          userName={userName}
          userEmail={userEmail}
        />

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
