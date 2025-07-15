import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Logo } from "~/components/ui/logo"
import { BookOpen, Users } from "lucide-react"
import { login, requireGuest } from "~/services/auth.server"
import type { ActionFunctionArgs, MetaFunction,LoaderFunction } from "@remix-run/node"
import { useFetcher} from "@remix-run/react"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"

export const loader: LoaderFunction = async ({ request }) => {
  await requireGuest({ request });  
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const identifier = formData.get("identifier")
  const password = formData.get("password")
  let logins = null;
  try {
  logins = await login({ request,identifier, password })
  console.log(logins)
    if (logins.redirector) {
      return logins.redirector;
    }
  } catch (error) {
    return {
      errors: { form: "Ocurrió un error durante el inicio de sesión", identifier: null, password: null },
      fields: { identifier, password },
    }
  }
  return logins;
}
export default function LoginPage() {
  const [fetching, setFetching] = useState(false)
  const fetcher = useFetcher()
  useEffect(()=>{
    console.log(fetcher)
    if(fetcher.state==="submitting" || fetcher.state==="loading"){
      setFetching(true)
    }else if(fetcher.state==="idle" && fetcher.data){
      console.log(fetcher.data)
      setFetching(false)
      Swal.fire({
        title: "Credenciales incorrectas",
        icon: "error",
        confirmButtonText: "Aceptar"
      })
    }else{
      setFetching(false)
    }
  },[fetcher.state])
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            <Logo className="h-[150px] w-full" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            La plataforma de aprendizaje del futuro
          </h2>
          <p className="text-xl text-gray-600">
            Más fluida, intuitiva y poderosa que cualquier LMS tradicional. Crea, gestiona y aprende sin límites.
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-8 pt-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Cursos ilimitados</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <span className="text-sm text-gray-600">Gestión avanzada</span>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <fetcher.Form className="space-y-4" method="POST">
              <div className="space-y-2">
                <Label htmlFor="email">Email o usuario</Label>
                <Input
                  id="email"
                  name="identifier"
                  type="text"
                  placeholder="fmoreno.1690@iskander.edu.ve | iskandergod"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  placeholder="danielesmipapa"
                  type="password"
                  required
                />
              </div>
              <Button 
              type="submit" className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={fetching}
              >
                {fetching ? "Iniciando sesión" : "Iniciar Sesión"}
              </Button>
            </fetcher.Form>

            <div className="mt-4 text-center text-sm text-gray-600">
              <p>
                ¿Olvidaste tu contraseña?{" "}
                <a href="#" className="text-purple-600 hover:underline">
                  <strong>
                    Recuperar
                  </strong>
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
