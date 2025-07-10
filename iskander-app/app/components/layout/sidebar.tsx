import { Link, useLocation } from "@remix-run/react"
import { Logo } from "~/components/ui/logo"
import type { NavigationItem } from "./navigation"

interface SidebarProps {
  navigation: NavigationItem[]
  title?: string
}

export function Sidebar({ navigation, title }: SidebarProps) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <Logo className=" w-[150px] mt-8 ml-4"/>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col border-t border-purple-600">
        <ul role="list" className="flex flex-1 flex-col gap-y-7 mt-2">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                        isActive
                          ? "bg-purple-50 text-purple-600"
                          : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                      }`}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  )
}
