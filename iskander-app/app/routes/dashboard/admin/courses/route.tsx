import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Plus, Search, Edit, Trash2, Users, BookOpen, ReceiptText } from "lucide-react"
import type { Course, CreateCourseData } from "~/types/course"

import { Link,useFetcher,useLoaderData } from "@remix-run/react"
import type { LoaderFunction } from "@remix-run/node"
import {users,categories,courses} from "~/services/auth.server"
import { Combobox } from "~/components/ui/combobox"
import Swal from "sweetalert2"
interface FetcherResponse {
  status: number;
  data: {
    title: string;
  };
}
interface LoaderData {
  user: {
    value:string;
    label:string;
  }[];
  category:{
    value:string;
    label:string;
  }[];
  course:Course[]
}
export const loader: LoaderFunction = async ({ request }) => {
  
  const userList = await users({request})
  const categoryList = await categories({request})
  const courseList = await courses({request})
  const data = (userList.data || []).map((item: any) => ({
    value: item.name.toString(),
    label: item.name.toString(),
  }))
  const categoryData = (categoryList.data || []).map((item: any) => ({
    value: item.name.toString(),
    label: item.name.toString(),
  }))
  const elements = {
    user: data,
    category:categoryData,
    course:courseList.data
  };
  return elements;
};

export default function CoursesManagement() {
  const {user,category,course } = useLoaderData<LoaderData>();
  const [courses, setCourses] = useState<Course[]>(course)
  useEffect(()=>{
      setCourses(course)
      },[course])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [newCourse, setNewCourse] = useState<CreateCourseData>({
    title: "",
    description: "",
    instructor: "",
    category: "",
  })

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const fetcher = useFetcher()
  const handleCreateCourse = () => {
    fetcher.submit(
      { 
        title: newCourse.title,
        description: newCourse.description,
        instructor: newCourse.instructor,
        category: newCourse.category,
        thumbnail: "/iskander-logo.png", 
      },
      { method:"POST",action :"/api/course/create"}
    );
    setNewCourse({ title: "", description: "", instructor: "", category: "" })
    setIsCreateDialogOpen(false)
  }
  useEffect(()=>{
      const data = fetcher.data as FetcherResponse;
      if(fetcher.data && fetcher.state==="idle" ){
        Swal.fire({
          icon:data?.status >=400 ? 'warning' : 'success',
          title: data?.data?.title
        })
      }
    },[fetcher.data,fetcher.state])


    const handleEditCourse = (course: Course) => {
      setEditingCourse(course)  
      setNewCourse({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      category: course.category,
    })

    setIsEditDialogOpen(true)
  }
  

  const handleUpdateCourse = () => {
    //if (!editingCourse) return

    /*
    const updatedCourses = courses.map((course) =>
      
      course.id === editingCourse.id
        /*? { 
            ...course,
            title: newCourse.title,
            description: newCourse.description,
            instructor: newCourse.instructor,
            category: newCourse.category,
          }
        : course,
        )
        */
       
        
        fetcher.submit(
          {
            id:editingCourse?.id||'',
            title: newCourse.title,
            description: newCourse.description,
            instructor: newCourse.instructor,
            category: newCourse.category,
            thumbnail: "/iskander-logo.png",    
          },
          
          {method:"POST",action :"/api/course/edit"  }
        );
        
        
    //setCourses(updatedCourses)
    setEditingCourse(null)
    setNewCourse({ title: "", description: "", instructor: "", category: "" })
    setIsEditDialogOpen(false)
  }
  

  const handleDeleteCourse = (courseId: number) => {
    setCourses(courses.filter((course) => course.id !== courseId))
  }

  const resetForm = () => {
    setNewCourse({ title: "", description: "", instructor: "", category: "" })
    setEditingCourse(null)
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
            <p className="text-gray-600">Crea y administra el contenido educativo</p>
          </div>
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (!open) resetForm()
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Crear Curso
              </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl mx-4">
              <DialogHeader>
                <DialogTitle>Crear nuevo curso</DialogTitle>
                <DialogDescription>Configura los detalles básicos del curso</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="create-title">Título del curso</Label>
                  <Input
                    id="create-title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="Ej: React Avanzado"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="create-description">Descripción</Label>
                  <Textarea
                    id="create-description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    placeholder="Describe el contenido y objetivos del curso"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="create-instructor">Profesor</Label>
                    <Combobox
                      options={user}
                      value={newCourse.instructor}
                      onValueChange={(value:any) => setNewCourse({ ...newCourse, instructor: value })}
                      placeholder="Seleccionar profesor"
                      searchPlaceholder="Buscar profesor..."
                      emptyText="No se encontró el profesor."
                      className="truncate"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="create-category">Categoría</Label>
                    <Combobox
                      options={category}
                      value={newCourse.category}
                      onValueChange={(value:any) => setNewCourse({ ...newCourse, category: value })}
                      placeholder="Seleccionar categoría"
                      searchPlaceholder="Buscar categoría..."
                      emptyText="No se encontró la categoría."
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCourse} className="bg-purple-600 hover:bg-purple-700">
                  Crear Curso
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Buscar Cursos</CardTitle>
            <CardDescription>Encuentra cursos por título, profesor o categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-3/12">

              </div>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base sm:text-lg truncate">{course.title}</CardTitle>
                    <CardDescription className="mt-1 truncate">Por {course.instructor}</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="w-fit text-xs">
                  {course.category}
                </Badge>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span className="text-xs sm:text-sm">{course.enrolledStudents} estudiantes</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/dashboard/courses/${course.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <ReceiptText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      Ver
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs sm:text-sm"
                    onClick={() => handleEditCourse(course)}
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 px-2"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogContent className="w-full max-w-2xl mx-4">
            <DialogHeader>

              {/*editar curso*/}
              <DialogTitle>Editar Curso</DialogTitle>
              <DialogDescription>Modifica los detalles del curso</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Título del curso</Label>
                <Input
                  id="edit-title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  placeholder="Ej: React Avanzado"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Describe el contenido y objetivos del curso"
                  rows={3}
                />
              </div>

              {/*<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">*/}
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-instructor">Instructor</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="create-instructor">Profesor</Label>
                    <Combobox
                      options={user}
                      value={newCourse.instructor}
                      onValueChange={(value:any) => setNewCourse({ ...newCourse, instructor: value })}
                      placeholder="Seleccionar profesor"
                      searchPlaceholder="Buscar profesor..."
                      emptyText="No se encontró el profesor."
                      className="truncate"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="create-category">Categoría</Label>
                    <Combobox
                      options={category}
                      value={newCourse.category}
                      onValueChange={(value:any) => setNewCourse({ ...newCourse, category: value })}
                      placeholder="Seleccionar categoría"
                      searchPlaceholder="Buscar categoría..."
                      emptyText="No se encontró la categoría."
                    />
                  </div>
                {/*</div>*/}

                {/*
                  <Select
                    value={newCourse.instructor}
                    onValueChange={(value) => setNewCourse({ ...newCourse, instructor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar instructor" />
                    </SelectTrigger>
                    <SelectContent>
                      
                      <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                      <SelectItem value="María García">María García</SelectItem>
                      <SelectItem value="Ana López">Ana López</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Select
                    value={newCourse.category}
                    onValueChange={(value) => setNewCourse({ ...newCourse, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desarrollo Web">Desarrollo Web</SelectItem>
                      <SelectItem value="Programación">Programación</SelectItem>
                      <SelectItem value="Diseño">Diseño</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Negocios">Negocios</SelectItem>
                    </SelectContent>
                  </Select>

                  */}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateCourse} className="bg-purple-600 hover:bg-purple-700">
                Actualizar Curso
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {filteredCourses.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cursos</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primer curso"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Curso
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
  )
}
