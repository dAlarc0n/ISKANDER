'use client'
import type React from "react"
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
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import { Card, CardContent } from "~/components/ui/card"
import { Upload, FileText, MessageSquare, Megaphone, Video, GraduationCap } from "lucide-react"
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
/*
export function ForumModal({ isOpen, onClose, onAdd, sectionId, sectionTitle }: AddContentModalProps) {
  const [formData, setFormData] = useState<ContentFormData>({
    title: "",
    description: "",
    type: "file",
    isVisible: true,
  })

  const contentTypes =[ {value: "forum", label: "Foro", icon: MessageSquare, description: "Espacio de discusión" }]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

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
    
    }
    console.log(formData.file)
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

  const selectedType = contentTypes.find((type) => type.value)

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
          <DialogTitle>Agregar Nuevo Foro</DialogTitle>
          <DialogDescription>
            Añadir un nuevo tema de conversacion: <strong>{sectionTitle}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          

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
          </div>

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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" 
            disabled={formData.file ? (formData.file.size / 1024 / 1024 >=2 ? true : false):false}
            className="bg-purple-600 hover:bg-purple-700">
              {formData.file ? (formData.file.size / 1024 / 1024 >=2 ? 'Suba un archivo con menor tamaño' : 'Agregar Foro'):'Agregar Foro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}*/