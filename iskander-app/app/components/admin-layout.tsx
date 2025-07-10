import type { ReactNode } from "react"
import { BaseLayout } from "~/components/layout/base-layout"
import { adminNavigation } from "~/components/layout/navigation"

interface AdminLayoutProps {
  children: ReactNode;
  title:string;
  userName:string;
    email:string;
  navigation:{
    name:string;
    href:string;
    icon: React.ComponentType<{ className?: string }>
  }[]
}

export function AdminLayout({ children,title, userName,navigation,email}: AdminLayoutProps) {
  return (
    <BaseLayout
      navigation={navigation}
      userType="admin"
      title={title}
      userName={userName}
      userEmail={email}
    >
      {children}
    </BaseLayout>
  )
}
