
import { useState, useEffect } from "react"
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

interface BannerModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (data: { id: number; file?: File }) => void
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

export function BannerModal({ isOpen, onClose, onAdd, sectionId, sectionTitle }: BannerModalProps) {
   const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  useEffect(() => {
  if (selectedFile) {
    const objectUrl = URL.createObjectURL(selectedFile)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl) // 🔄 limpia el recurso al desmontar o cambiar
  } else {
    setPreviewUrl("")
  }
}, [selectedFile])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (previewUrl) {
      onAdd({ id: sectionId, file: selectedFile ?? undefined })
      handleCancel()
    }
  }

    const handleCancel = () => {
    setSelectedFile(null)
    setPreviewUrl("")
    onClose()
  }


  {/* const selectedType = contentTypes.find((type) => type.value)*/}

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel()
          onClose()
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Imagen</DialogTitle>
          <DialogDescription>
            Añade un nueva nueva imagen que refleje tu curso y personalidad
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file">Archivo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    
                    {previewUrl && (
                      

                  <div className="mt-3 text-sm text-gray-610  content-center">
                      <div className="grid my-3 gap-1">
                          <img
                            src={previewUrl}
                            alt="Vista previa"
                            className="max-h-80 mx-auto rounded-lg"
                          />
                           <strong>{selectedFile?.name}</strong>
                             <p> Tamaño: {((selectedFile?.size ?? 0) / 1024 / 1024)?.toFixed(2)} MB </p>
                        </div>
                </div>

  
                      )}

                  {!previewUrl && (
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  )}

                  <div className="space-y-2">
                  
                  {!previewUrl && (
                    <p className="text-sm text-gray-600">Arrastra un archivo aquí o haz clic para seleccionar</p>
                  )}

                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      className="max-w-xs mx-auto"
                      accept=".jpg,.jpeg,.png,.gif"
                    />
                  
                  </div>
                </div>
              </div>
            </div>    

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button  type="submit"
              className="bg-purple-600 hover:bg-purple-700"

             
            >
              {selectedFile && selectedFile.size / 1024 / 1024 > 2
                ? "Archivo demasiado grande"
                : "Actualizar imagen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}