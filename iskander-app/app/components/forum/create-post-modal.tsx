// app/components/forum/create-post-modal.tsx
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
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Switch } from "~/components/ui/switch"
import type { CreatePostData } from "~/types/forum"

type CreatePostModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreatePostData & { isSticky?: boolean }) => void
  isAdmin?: boolean
}

export function CreatePostModal({ isOpen, onClose, onSubmit, isAdmin = false }: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isSticky: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.title.trim() && formData.content.trim()) {
      onSubmit(formData)
      resetForm()
      onClose()
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      isSticky: false,
    })
  }

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
          <DialogTitle>Crear Nueva Publicación</DialogTitle>
          <DialogDescription>Comparte una pregunta, idea o inicia una discusión</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="¿Cuál es tu pregunta o tema?"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">Contenido *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Describe tu pregunta o comparte tu idea en detalle..."
              rows={8}
              required
            />
          </div>

          {isAdmin && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="sticky">Publicación destacada</Label>
                <p className="text-sm text-gray-600">Las publicaciones destacadas aparecen al inicio del foro</p>
              </div>
              <Switch
                id="sticky"
                checked={formData.isSticky}
                onCheckedChange={(checked) => setFormData({ ...formData, isSticky: checked })}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!formData.title.trim() || !formData.content.trim()}
            >
              Publicar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
