
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
import { Textarea } from "~/components/ui/textarea"
import { Combobox } from "~/components/ui/combobox"
import { Switch } from "~/components/ui/switch"
import { Card, CardContent } from "~/components/ui/card"
import { Upload, FileText, MessageSquare, Megaphone, Video, GraduationCap, Trash2 } from "lucide-react"

import type { CourseDetail, CourseContent, CourseGrade, CourseStudent } from "~/types/course-detail"

interface AddContentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (content: Omit<CourseContent, "id">) => void
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


export function AddContentModal({ isOpen, onClose, onAdd, sectionId, sectionTitle,course }: AddContentModalProps) {
  

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

  const [selectedStaticContentId, setSelectedStaticContentId] = useState<string>(""); 

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
  

  const contadorRef = useRef(0)
  const generId = () => `id-${++contadorRef.current}`


    {/* para aumentar las preguntas*/}
  const addQuestion = () =>{
    const newquestion: Question = {
      id:generId(),
      enu:'',
      opcion:[],
    }
     setSeccionCuestionario(prev => [...prev, newquestion])
  }

const addOpcion = (idQuestion: string) => {
  setSeccionCuestionario(prev =>
    prev.map((p: Question) =>
      p.id === idQuestion
        ? {
            ...p,
            opcion: [...p.opcion, { id: generId(), text: '' }],
          }
        : p
    )
  )
}

useEffect(() => {
  if (seccionCuestionario.length === 0) {
    addQuestion()
  }
}, [])


const deleteQuestion = (id: string) => {
  setSeccionCuestionario(prev => prev.filter(p => p.id !== id))
}

const deleteOpcion = (idQuestion: string, idOpcion: string) => {
  setSeccionCuestionario(prev =>
    prev.map(p =>
      p.id === idQuestion
        ? {
            ...p,
            opcion: p.opcion.filter(o => o.id !== idOpcion),
          }
        : p
    )
  )
}





  {/* la informacion es de contenido del curso (ajustar parametro)*/}
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
    onAdd(newContent)
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
          <DialogTitle>Agregar Contenido</DialogTitle>
          <DialogDescription>
            Añadir nuevo contenido a la sección: <strong>{sectionTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label>Tipo de contenido</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contentTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    formData.type === type.value ? "ring-2 ring-purple-500 bg-purple-50" : ""
                  }`}
                  onClick={() => setFormData({ ...formData, type: type.value })}
                >
                  <CardContent className="p-4 text-center">
                    <type.icon className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                    <h4 className="font-medium text-sm">{type.label}</h4>
                    <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={`Título del ${selectedType?.label.toLowerCase()}`}
                required
              />
            </div>
            {formData.type !== "announcement" && (
            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción opcional del contenido"
                rows={3}
              />
            </div>
          )}
          </div>

          {(formData.type === "file" || formData.type === "assignment") && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Archivo</Label>
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
                    <div className="mt-3 p-2 bg-gray-100 rounded text-sm mx-auto w-64">
                      <strong className="">Tamño del archivo seleccionado: </strong> 
                      <br />
                      <span className="text-gray-600">Tamaño: {(formData.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.type === "video" && (
            <div className="grid gap-2">
              <Label htmlFor="video-url">URL del video</Label>
              <Textarea
                id="video-url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... o URL del archivo"
                rows={1}
              />
            </div>
          )}

          {formData.type === "announcement" && (
            <div className="grid gap-2">
              <Label>Contenido del anuncio</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Escribe el contenido del anuncio..."
                rows={5}
                required
              />
            </div>
          )}

          {(formData.type === "assignment" || formData.type === "quiz") && (
            <div className="space-y-4">
              <div className=" grid grid-col md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="due-date">Fecha límite</Label>
                  <Input id="due-date" type="datetime-local" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max-grade">Calificación máxima</Label>
                  <Input id="max-grade" type="number" placeholder="100" min="0" />
                </div>
              </div>
            </div>
          )}

          {( formData.type === "quiz") && (

          <div className="space-y-2 border p-4 rounded-md shadow-md">     
          {/* preguntas del cuestionario */}
          {seccionCuestionario.map((question, index) => (
            <div key={question.id} className="grid grid-cols-2 gap-4 border p-4 rounded-md shadow">
              <div className="col-span-2">
              <div className="grid gap-3">
                <Label htmlFor={`cuestion-${question.id}`}>Pregunta {index + 1}</Label>
                <Input
                  id={`cuestion-${question.id}`}
                  value={question.enu}
                  onChange={(e) => {
                    const newT = e.target.value
                    setSeccionCuestionario(prev =>
                      prev.map(p =>
                        p.id === question.id ? { ...p, enu: newT } : p
                      )
                    )
                  }}
                  placeholder={`Pregunta del ${selectedType?.label.toLowerCase()}`}
                  required
                />
              </div>
              </div>

              {/* Opciones */}
              <div className="col-span-2">
                <div className="grid gap-3">
                {question.opcion.map((op, i) => (
                  <div key={op.id} className="flex gap-2 items-center">
                    <Input
                      id={`opcion-${op.id}`}
                      value={op.text}
                      onChange={(e) => {
                        const newT = e.target.value
                        setSeccionCuestionario(prev =>
                          prev.map(p =>
                            p.id === question.id
                              ? {
                                  ...p,
                                  opcion: p.opcion.map(o =>
                                    o.id === op.id ? { ...o, text: newT } : o
                                  ),
                                }
                              : p
                          )
                        )
                      }}
                      placeholder={`Opción ${i + 1}`}
                      required
                    />
                    <Button
                      type="button"
                      onClick={() => deleteOpcion(question.id, op.id)}
                      className="bg-white border border-red-600 text-red-600  hover:bg-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                    </div>
                  </div>

                  {/*Boton Eliminar pregunta*/}
                  <Button
                    type="button"
                    onClick={() => deleteQuestion(question.id)}
                    className="bg-white border border-red-600 hover:bg-red-500 text-red-600 hover:text-white"
                  >
                    Eliminar pregunta
                  </Button>

                    {/* Agregar opción */}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addOpcion(question.id)}
                      className="border-purple-600 text-purple-600 bg-purple-100 hover:bg-purple-500 hover:text-white transition-transform duration-500"
                    >
                      + Opción
                    </Button>



            </div>
          ))}

          {/* Agregar nueva pregunta */}
          <div className="grid gap-2 text-white">
            <Button
              type="button"
              variant="outline"
              onClick={addQuestion}
              className="mt-4 bg-purple-600 hover:bg-purple-700 hover:text-white transition-transform duration-500"
            >
              Agregar pregunta +
            </Button>
          </div>
        </div>

              

          )}

          {formData.type === "assignment" && filteredAssignmentOptions.length > 0  &&(
            <div className="grid gap-2">
              <div className="grid grid-cols-1">
                   <div className="grid gap-2">
                     <Label htmlFor="tarea">Actvidades del Curso</Label>
                     <Combobox
 
                      options={filteredAssignmentOptions} 
                      value={selectedStaticContentId || ""}                                  
                      onValueChange={(value: string) => {setSelectedStaticContentId(value);}}
                       placeholder="Seleccionar la actividad"
                       searchPlaceholder="Buscar Actividad ..."
                       emptyText="No se encontró la actividad."
                       className="truncate"
                     
                     />
                   </div>
                 </div>
               </div>
          )}


          {formData.type !== "assignment" && (

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="space-y-1">
              <Label htmlFor="visibility">Visible para estudiantes</Label>
              <p className="text-sm text-gray-600">Los estudiantes podrán ver este contenido inmediatamente</p>
            </div>
            <Switch
              id="visibility"
              checked={formData.isVisible}
              onCheckedChange={(checked:any) => setFormData({ ...formData, isVisible: checked })}
            />
          </div>
          )}

          <DialogFooter className=" grid gap-2 md:flex  grid-cols-[1fr_2fr]  ">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" 
            disabled={formData.file ? (formData.file.size / 1024 / 1024 >=2 ? true : false):false}
            className="bg-purple-600 hover:bg-purple-700">
              {formData.file ? (formData.file.size / 1024 / 1024 >=2 ? 'Suba un archivo con menor tamaño' : 'Agregar Contenido'):'Agregar Contenido'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
