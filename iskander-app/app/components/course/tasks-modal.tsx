
import { useState, useRef, useEffect } from "react"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Label } from "~/components/ui/label"
import { Input } from "~/components/ui/input"
import { Upload, FileText, MessageSquare, Megaphone, Video, GraduationCap, Trash2 } from "lucide-react"

import type { CourseDetail, CourseContent, CourseGrade, CourseStudent } from "~/types/course-detail"

interface TasksModalProps {
  isOpen: boolean
  onClose: () => void
  sectionId: number
  sectionTitle: string
  course: CourseDetail;
}

interface ContentFormData {
  title: string
  description: string
  type: CourseContent["type"]
  isVisible: boolean
  url?: string
  file?: File
}


export function TasksModal({ isOpen, onClose, sectionId, sectionTitle,course }: TasksModalProps) {
  

  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    description: "",
    type: "file",
    isVisible: true,
  })

const filteredAssignmentOptions = course?.sections
  ?.flatMap((section) =>
    section.contents
      .filter((content) => content.type === "assignment")
      .map((content) => ({
        value: content.id.toString(),
        label: `${section.title} - ${content.title}`,
      }))
  ) ?? [];

  //const [selectedStaticContentId, setSelectedStaticContentId] = useState<string>(""); 

  const contentTypes = [
    { value: "file", label: "Archivo", icon: FileText, description: "Subir documentos, PDFs, imágenes" },
    { value: "video", label: "Video", icon: Video, description: "Enlaces de video o archivos multimedia" },
    { value: "announcement", label: "Anuncio", icon: Megaphone, description: "Comunicados importantes" },
    { value: "forum", label: "Foro", icon: MessageSquare, description: "Espacio de discusión" },
    { value: "assignment", label: "Tarea", icon: FileText, description: "Actividad evaluable" },
    { value: "quiz", label: "Cuestionario", icon: GraduationCap, description: "Evaluación automática" },
  ]

  
  {/* para aumentar el cuestionario*/}
const [seccionCuestionario, setSeccionCuestionario] = useState<Question[]>([])

  type Option = {id:string; text:string;}
  type Question = {
    id:string
    enu:string,
    opcion:Option[]
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newContent: Omit<CourseContent, "id"> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      createdDate: new Date().toISOString(),
      fileUrl: formData.type === "video" ? formData.url : undefined,
      author: "Admin", 
      isVisible: formData.isVisible,
      ...(formData.file && {
        file: formData.file,
        fileSize: `${(formData.file.size / 1024 / 1024).toFixed(1)} MB`,
        fileType: formData.file.type.split("/")[1].toUpperCase(),
      }),
    
    }
    resetForm()
    onClose()
  }

  const clearform = ()=>{
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "file",
      isVisible: true,
    })
  }
  
  
      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          setFormData({ ...formData, file })
        }
      }
      const selectedType = contentTypes.find((type) => type.value === formData.type)
    

  return (

    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm()
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actividad</DialogTitle>
          <DialogDescription>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              
            </div>
          </div>

          {(formData.type === "file" || formData.type === "assignment") && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Adjunte un archivo para la entrega de la actividad</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Arrastra un archivo aquí o haz clic para seleccionar</p>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3"
                    />
                  </div>
                  {formData.file && (
                    <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                      <strong>Tamaño del archivo seleccionado:</strong> 
                      <span className="text-gray-600">Tamaño: {(formData.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className=" grid gap-2 md:flex  grid-cols-[1fr_2fr]  ">
            <Button type="button" variant="outline" onClick={clearform}>
              Cancelar
            </Button>

            <Button type="submit" 
            disabled={formData.file ? (formData.file.size / 1024 / 1024 >=2 ? true : false):true}
            className="bg-purple-600 hover:bg-purple-700">
              {formData.file ? (formData.file.size / 1024 / 1024 >=2 ? 'Suba un archivo con menor tamaño' : 'Agregar Contenido'):'Agregar Contenido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    
  )
}
