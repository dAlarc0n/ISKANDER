
import { useState } from "react"
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
import { Upload, FileText,  } from "lucide-react"
import type { CourseContent } from "~/types/course-detail"

interface AddContentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (content: Omit<CourseContent, "id">) => void
  sectionId: number
  sectionTitle: string
}

interface ContentFormData {
  title: string
  description: string
  type: CourseContent["type"]
  isVisible: boolean
  file?: File
}

export function BannerModal({ isOpen, onClose, onAdd, sectionId, sectionTitle }: AddContentModalProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    description: "",
    type: "file",
    isVisible: true,
  })

  const contentTypes =[ { value: "file", label: "Archivo", icon: FileText, description: "Subir documentos, PDFs, imágenes" }]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    {/*
      const newContent: Omit<CourseContent, "id"> = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      createdDate: new Date().toISOString(),
      author: "Admin", 
      isVisible: formData.isVisible,
      ...(formData.file && {
        file: formData.file,
        fileSize: `${(formData.file.size / 1024 / 1024).toFixed(1)} MB`,
        fileType: formData.file.type.split("/")[1].toUpperCase(),
      }),
    
    */}
    console.log(formData.file)
    {/* onAdd(newContent)*/}
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

  {/* para limpiar la info cuando cierres el modal con el boton  */}
  const handelCancelButton = () =>{
    resetForm();
    onClose();
  }

  {/* const selectedType = contentTypes.find((type) => type.value)*/}

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
          <DialogTitle>Agregar Nuevo Banner</DialogTitle>
          <DialogDescription>
            Añade un nueva nueva imagen !!!estatico <strong>{sectionTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
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
                      accept=".jpg,.jpeg,.png,.gif"
                    />
                  </div>
                  {formData.file && (
                    <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                      <strong>Archivo seleccionado:</strong> {formData.file.name}
                      <br />
                      <span className="text-gray-600">Tamaño: {(formData.file.size / 1024 / 1024).toFixed(1)} MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>    

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handelCancelButton}>
              Cancelar
            </Button>
            <Button type="submit" 
            disabled={formData.file ? (formData.file.size / 1024 / 1024 >=2 ? true : false):false}
            className="bg-purple-600 hover:bg-purple-700">
              {formData.file ? (formData.file.size / 1024 / 1024 >=2 ? 'Suba un archivo con menor tamaño' : 'Agregar Imagen'):'Agregar Imagen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}