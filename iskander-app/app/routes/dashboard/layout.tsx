import {
  Links,
  Meta,
  useLoaderData,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction,LoaderFunction } from "@remix-run/node";
import "~/tailwind.css";
import { options, requireAuth, user } from "~/services/auth.server"
import { AdminLayout } from "~/components/admin-layout"
import { Home, Users, BookOpen } from "lucide-react"
export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}
const iconMap: Record<string, NavigationItem["icon"]> = {
  Home,
  Users,
  BookOpen,
}
export const loader: LoaderFunction = async ({ request }) => {
  await requireAuth({ request });
  const userData = await user({ request });
  const optionsData = await options({ request });

  const elements = {
    user: userData,
    options: optionsData,
  };

  return elements;
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
    </html>
  );
}

export default function App() {
  const { user,options } = useLoaderData<typeof loader>()
  const navigation = options.map((item:any) => ({
    ...item,
    icon: iconMap[item.icon] || Home,
  }));
  return (<AdminLayout title="Admin" userName={user?.name} navigation={navigation} email={user.email}><Outlet /></AdminLayout>);
}
