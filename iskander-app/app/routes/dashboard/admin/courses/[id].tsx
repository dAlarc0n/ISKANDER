import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Progress } from "~/components/ui/progress"
import {
  ArrowLeft,
  Users,
  FileText,
  MessageSquare,
  Megaphone,
  GraduationCap,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Download,
  Calendar,
} from "lucide-react"
import type { CourseDetail, CourseContent, CourseGrade, CourseStudent } from "~/types/course-detail"
import { AddContentModal } from "~/components/course/add-content-modal"
import { AddStudentModal } from "~/components/course/add-student-modal"
import { GradeModal } from "~/components/course/grade-modal"
//import { ForumModal } from "~/components/course/add-forum-modal"
import type {LoaderFunctionArgs} from "@remix-run/node";
import  {useFetcher, useLoaderData, useParams} from "@remix-run/react";
import {courseDetail,courseUser} from '~/services/auth.server'
import { User } from "~/types/user"
import Swal from "sweetalert2"
interface FetcherResponse {
  status: number;
  data: {
    title: string;
  };
}
interface LoaderData {
  courseDetails:CourseDetail,
  users:User[]
}
// const mockCourseDetail: CourseDetail = {
//   id: 1,
//   title: "React Avanzado",
//   description: "Aprende React con hooks, context y patrones avanzados para crear aplicaciones web modernas",
//   instructor: "Juan Pérez",
//   category: "Desarrollo Web",
//   enrolledStudents: 45,
//   createdDate: "2024-01-15",
//   thumbnail: "/iskander-logo.png",
//   sections: [
//     {
//       id: 1,
//       title: "Introducción a React",
//       description: "Conceptos básicos y configuración del entorno",
//       order: 1,
//       isVisible: true,
//       contents: [
//         {
//           id: 1,
//           title: "Bienvenida al curso",
//           type: "announcement",
//           description: "Información importante sobre el curso",
//           createdDate: "2024-01-15",
//           author: "Juan Pérez",
//           isVisible: true,
//         },
//         {
//           id: 2,
//           title: "Configuración del entorno",
//           type: "file",
//           description: "Guía paso a paso para configurar React",
//           createdDate: "2024-01-16",
//           author: "Juan Pérez",
//           fileUrl: "/files/setup-guide.pdf",
//           fileSize: "2.5 MB",
//           fileType: "PDF",
//           isVisible: true,
//         },
//         {
//           id: 3,
//           title: "Video: Introducción a JSX",
//           type: "video",
//           description: "Conceptos básicos de JSX",
//           createdDate: "2024-01-17",
//           author: "Juan Pérez",
//           isVisible: true,
//         },
//       ],
//     },
//     {
//       id: 2,
//       title: "Hooks y Estado",
//       description: "Manejo de estado con hooks",
//       order: 2,
//       isVisible: true,
//       contents: [
//         {
//           id: 4,
//           title: "Foro: Dudas sobre useState",
//           type: "forum",
//           description: "Comparte tus dudas sobre el hook useState",
//           createdDate: "2024-01-20",
//           author: "Juan Pérez",
//           isVisible: true,
//         },
//         {
//           id: 5,
//           title: "Tarea: Contador con useState",
//           type: "assignment",
//           description: "Crea un contador usando useState",
//           createdDate: "2024-01-22",
//           author: "Juan Pérez",
//           isVisible: true,
//         },
//       ],
//     },
//   ],
//   students: [
//     // {
//     //   id: 1,
//     //   name: "María García",
//     //   email: "maria@ejemplo.com",
//     //   enrolledDate: "2024-01-20",
//     //   lastAccess: "2024-03-15",
//     //   progress: 75,
//     //   avatar: "/placeholder.svg?height=40&width=40",
//     // },
//     // {
//     //   id: 2,
//     //   name: "Carlos López",
//     //   email: "carlos@ejemplo.com",
//     //   enrolledDate: "2024-01-22",
//     //   lastAccess: "2024-03-14",
//     //   progress: 60,
//     //   avatar: "/placeholder.svg?height=40&width=40",
//     // },
//     // {
//     //   id: 3,
//     //   name: "Ana Martínez",
//     //   email: "ana@ejemplo.com",
//     //   enrolledDate: "2024-01-25",
//     //   lastAccess: "2024-03-16",
//     //   progress: 90,
//     //   avatar: "/placeholder.svg?height=40&width=40",
//     // },
//   ],
//   grades: [
//     // {
//     //   id: 1,
//     //   studentId: 1,
//     //   studentName: "María García",
//     //   activity: "Tarea: Contador con useState",
//     //   grade: 85,
//     //   maxGrade: 100,
//     //   submittedDate: "2024-02-01",
//     //   gradedDate: "2024-02-03",
//     // },
//     // {
//     //   id: 2,
//     //   studentId: 2,
//     //   studentName: "Carlos López",
//     //   activity: "Tarea: Contador con useState",
//     //   grade: 78,
//     //   maxGrade: 100,
//     //   submittedDate: "2024-02-02",
//     //   gradedDate: "2024-02-04",
//     // },
//   ],
//   announcements: [
//     {
//       id: 1,
//       title: "Bienvenidos al curso",
//       content:
//         "¡Hola a todos! Bienvenidos al curso de React Avanzado. Estoy emocionado de acompañarlos en este viaje de aprendizaje.",
//       author: "Juan Pérez",
//       createdDate: "2024-01-15",
//       isVisible: true,
//     },
//     {
//       id: 2,
//       title: "Recordatorio: Entrega de tarea",
//       content: "Recuerden que la tarea del contador con useState debe ser entregada antes del viernes.",
//       author: "Juan Pérez",
//       createdDate: "2024-01-28",
//       isVisible: true,
//     },
//   ],
//   forums: [
//     // {
//     //   id: 1,
//     //   title: "Dudas generales",
//     //   description: "Espacio para resolver dudas generales del curso",
//     //   posts: 23,
//     //   lastPost: "2024-03-15",
//     //   lastPostAuthor: "María García",
//     // },
//     // {
//     //   id: 2,
//     //   title: "Proyectos y ejemplos",
//     //   description: "Comparte tus proyectos y ejemplos de código",
//     //   posts: 15,
//     //   lastPost: "2024-03-14",
//     //   lastPostAuthor: "Carlos López",
//     // },
//   ],
// }
export const loader = async ({ request, params }: LoaderFunctionArgs) => {

  const id = params.id;
  const data = await courseDetail({ request, id });
  const element = await courseUser({ request, id });
  const elements = {
    courseDetails: data.data,
    users:element.data,
  };
  return elements;
};
export default function CourseDetailPage() {
  const fetcher = useFetcher();
  const { id } = useParams();
  const {courseDetails,users} = useLoaderData<LoaderData>();
  const [course,setCourse] = useState<CourseDetail>(courseDetails)
  const [activeTab, setActiveTab] = useState("content")
  const [isAddContentModalOpen, setIsAddContentModalOpen] = useState(false)
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false)
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false)
  // const [isForumModalOpen, setIsForumModalOpen] = useState(false)
  const [selectedSectionId, setSelectedSectionId] = useState<number>(0)
  const [editingGrade, setEditingGrade] = useState<CourseGrade | null>(null)
  useEffect(()=>{
    setCourse(courseDetails)
  },[courseDetails])
  const getContentIcon = (type: CourseContent["type"]) => {
    switch (type) {
      case "file":
        return <FileText className="h-4 w-4" />
      case "forum":
        return <MessageSquare className="h-4 w-4" />
      case "announcement":
        return <Megaphone className="h-4 w-4" />
      case "video":
        return <FileText className="h-4 w-4" />
      case "quiz":
        return <GraduationCap className="h-4 w-4" />
      case "assignment":
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getContentTypeText = (type: CourseContent["type"]) => {
    switch (type) {
      case "file":
        return "Archivo"
      case "forum":
        return "Foro"
      case "announcement":
        return "Anuncio"
      case "video":
        return "Video"
      case "quiz":
        return "Cuestionario"
      case "assignment":
        return "Tarea"
      default:
        return "Contenido"
    }
  }
  

  const getGradeColor = (grade: number, maxGrade: number) => {
    const percentage = (grade / maxGrade) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const handleAddContent = (sectionId: number) => {
    setSelectedSectionId(sectionId)
    setIsAddContentModalOpen(true)
  }

  const handleContentAdded = (content: Omit<CourseContent, "id">&{file?:File}) => {
     const formData = new FormData()
      formData.append("title", content.title)
      formData.append("description", content.description ||'')
      formData.append("type", content.type)
      formData.append("isVisible", String(content.isVisible))
      formData.append('id',id || '')
      if (content.file) {
        formData.append("file", content.file)
      }

    fetcher.submit(formData, {
      method: "POST",
      action: `/api/course/content`,
      encType: "multipart/form-data" 
    });
    console.log("Contenido agregado:", content)
  }

/* datos del foro

 const handleForumAdded = (content: Omit<CourseContent, "id">&{file?:File}) => {
     const formData = new FormData()
      formData.append("title", content.title)
      formData.append("description", content.description ||'')
      formData.append("type", content.type)
      formData.append("isVisible", String(content.isVisible))
      formData.append('id',id || '')
      if (content.file) {
        formData.append("file", content.file)
        
      }
        fetcher.submit(formData, {
          method: "POST",
          action: `/api/course/content`,
          encType: "multipart/form-data" 
        });
        console.log("Contenido agregado:", content)
    }
  */


  const handleStudentsAdded = (students: CourseStudent[]) => {
    const formData = new FormData();
    formData.append("students", JSON.stringify(students));
    formData.append("id",id || '')
    fetcher.submit(formData, {
    method: "POST",
    action: `/api/course/enrollment`, 
  });
    console.log("Estudiantes agregados:", students)
  }

  const handleGradeSaved = (grade: Omit<CourseGrade, "id">) => {
    console.log("Calificación guardada:", grade)
  }

  const handleEditGrade = (grade: CourseGrade) => {
    setEditingGrade(grade)
    setIsGradeModalOpen(true)
  }
  
  const availableActivities = course.sections.flatMap((section) =>
    section.contents
      .filter((content) => content.type === "assignment" || content.type === "quiz")
      .map((content) => content.title),
  )
  const downloadFile = (url: string, filename?: string) => {
    const a = document.createElement("a")
    a.href = url
    a.setAttribute("download", filename || url.split("/").pop() || "archivo")
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    a.remove()
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
  return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => {}}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600">
              Por {course.instructor} • {course.enrolledStudents} estudiantes
            </p>
          </div>
          <Badge variant="secondary">{course.category}</Badge>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-lg font-semibold mb-2">Descripción del curso</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Creado el: {course.createdDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledStudents} estudiantes inscritos</span>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/*Barra de secciones de un curso*/}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="grades">Calificaciones</TabsTrigger>
            {/* Seccion de Foros  <TabsTrigger value="forums">Foros</TabsTrigger> */}
          </TabsList>
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Contenido del curso</h3>
              
            {course.rol &&(
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => handleAddContent(1)} 
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar contenido
              </Button>
            )}
            </div>

            {course.sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                      {section.description && <CardDescription>{section.description}</CardDescription>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {section.contents.map((content) => (
                      <div
                        key={content.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex-shrink-0">{getContentIcon(content.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium truncate w-[100px] sm:w-[150px]   md:w-[300px]">{content.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {getContentTypeText(content.type)}
                              </Badge>
                            </div>
                            {content.description && (
                              <p className="text-sm text-gray-600 truncate w-[0px] sm:w-[250px] md:w-[320px] lg:w-[420px]">{content.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span>Por {content.author}</span>
                              <span>{content.createdDate}</span>
                              {content.fileSize && <span>{content.fileSize}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {content.type === "file" && (
                            <Button variant="ghost" size="sm" onClick={() => downloadFile(`http://localhost:8000/${content.fileUrl}`)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          {course.rol && (<Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>)}
                          {course.rol && (<Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="students" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Estudiantes inscritos ({course.students.length})</h3>

             {course.rol &&( 
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsAddStudentModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar estudiante
              </Button>
             )}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {course.students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {student.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{student.name}</h4>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            <span>Inscrito: {student.enrolledDate}</span>
                            <span>Último acceso: {student.lastAccess}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium">Progreso: {student.progress}%</span>
                        </div>
                        <Progress value={student.progress} className="w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="grades" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Calificaciones</h3>
             
             {course.rol &&(
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsGradeModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva calificación
              </Button>
             )}
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {course.grades.map((grade) => (
                    <div
                      key={grade.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => handleEditGrade(grade)}
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{grade.studentName}</h4>
                        <p className="text-sm text-gray-600">{grade.activity}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span>Entregado: {new Date(grade.submittedDate).toLocaleDateString("es-ES")}</span>
                          {grade.gradedDate && (
                            <span>Calificado: {new Date(grade.gradedDate).toLocaleDateString("es-ES")}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getGradeColor(grade.grade, grade.maxGrade)}`}>
                          {grade.grade}/{grade.maxGrade}
                        </div>
                        <div className="text-sm text-gray-500">{Math.round((grade.grade / grade.maxGrade) * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


           {/* Lista de foros y boton de agragar

          <TabsContent value="forums" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Foros de discusión</h3>
              
              {isAcess &&(
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsForumModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Crear foro
              </Button>
              )}

            </div>

            <div className="grid gap-4">
              {course.forums.map((forum) => (
                <Card key={forum.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{forum.title}</h4>
                        <p className="text-gray-600 mb-4">{forum.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{forum.posts} publicaciones</span>
                          <span>Último post: {new Date(forum.lastPost).toLocaleDateString("es-ES")}</span>
                          <span>Por: {forum.lastPostAuthor}</span>
                        </div>
                      </div>
                      <MessageSquare className="h-6 w-6 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
            </div>
          </TabsContent>
           
           */}


        </Tabs>

        
        <AddContentModal
          isOpen={isAddContentModalOpen}
          onClose={() => setIsAddContentModalOpen(false)}
          onAdd={handleContentAdded}
          sectionId={selectedSectionId}
          sectionTitle={course.sections.find((s) => s.id === selectedSectionId)?.title || ""}
        />

        <AddStudentModal
          isOpen={isAddStudentModalOpen}
          onClose={() => setIsAddStudentModalOpen(false)}
          onAdd={handleStudentsAdded}
          enrolledStudentIds={course.students.map((s) => s.id)}
          availableUsers={users}        
          />

        <GradeModal
          isOpen={isGradeModalOpen}
          onClose={() => {
            setIsGradeModalOpen(false)
            setEditingGrade(null)
          }}
          onSave={handleGradeSaved}
          students={course.students}
          activities={availableActivities}
          editingGrade={editingGrade}
        />

      </div>


      /* Abrir modal del Foro


        <ForumModal
            isOpen={isForumModalOpen}
            onClose={() => setIsForumModalOpen(false)}
            onAdd={handleForumAdded}
            sectionId={selectedSectionId}
            sectionTitle={course.sections.find((s) => s.id === selectedSectionId)?.title || ""}
        /> 
        */
  )
}
