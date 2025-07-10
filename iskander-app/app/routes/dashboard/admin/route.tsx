import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Users, BookOpen, FileText, TrendingUp, Plus, Eye } from "lucide-react"
import type { Stats, Activity } from "~/types/common"

export default function AdminDashboard() {
  const [stats] = useState<Stats>({
    totalUsers: 1247,
    totalCourses: 89,
    totalContent: 456,
    activeStudents: 892,
  })

  const [recentActivity] = useState<Activity[]>([
    { id: 1, action: "Nuevo usuario registrado", user: "María García", time: "Hace 5 min" },
    { id: 2, action: "Curso completado", user: "Juan Pérez", course: "React Avanzado", time: "Hace 15 min" },
    { id: 3, action: "Contenido subido", user: "Admin", course: "JavaScript Básico", time: "Hace 1 hora" },
    { id: 4, action: "Usuario inscrito", user: "Ana López", course: "Python para Principiantes", time: "Hace 2 horas" },
  ])

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Gestiona tu plataforma educativa</p>
          </div>
          {/* <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Ver como estudiante
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Acción rápida
            </Button>
          </div> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Activos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5</span> nuevos este mes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contenido Total</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalContent}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+23</span> archivos esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estudiantes Activos</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeStudents}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> de engagement
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Últimas acciones en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-600">
                        {activity.user} {activity.course && `- ${activity.course}`}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.time}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Gestiona tu plataforma eficientemente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">Gestionar Usuarios</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="text-sm">Crear Curso</span>
                </Button>
                {/* <Button variant="outline" className="h-20 flex-col">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">Subir Contenido</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span className="text-sm">Ver Estadísticas</span>
                </Button> */}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
