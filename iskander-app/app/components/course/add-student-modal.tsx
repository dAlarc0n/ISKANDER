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
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Checkbox } from "~/components/ui/checkbox"
import { Search, UserPlus, Mail, Calendar } from "lucide-react"
import type { User } from "~/types/user"
import type { CourseStudent } from "~/types/course-detail"

interface AddStudentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (students: CourseStudent[]) => void
  enrolledStudentIds: number[]
  availableUsers: User[]
}

export function AddStudentModal({ isOpen, onClose, onAdd, enrolledStudentIds,availableUsers }: AddStudentModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<number[]>([])
  // Filtrar usuarios que no están inscritos y que son estudiantes
  const availableStudents = availableUsers.filter(
    (user) =>
      !enrolledStudentIds.includes(user.id) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleStudentToggle = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleSelectAll = () => {
    if (selectedStudents.length === availableStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(availableStudents.map((student) => student.id))
    }
  }

  const handleSubmit = () => {
    const studentsToAdd: CourseStudent[] = availableUsers
      .filter((user) => selectedStudents.includes(user.id))
      .map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        enrolledDate: new Date().toISOString(),
        lastAccess: new Date().toISOString(),
        progress: 0,
        avatar: user.avatar,
      }))

    onAdd(studentsToAdd)
    setSelectedStudents([])
    setSearchTerm("")
    onClose()
  }

  const resetForm = () => {
    setSelectedStudents([])
    setSearchTerm("")
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Agregar Estudiantes al Curso</DialogTitle>
          <DialogDescription>Selecciona los estudiantes que deseas inscribir en este curso</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar estudiantes por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controles de selección */}
          {availableStudents.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedStudents.length === availableStudents.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm font-medium">
                  Seleccionar todos ({availableStudents.length})
                </Label>
              </div>
              <Badge variant="secondary">{selectedStudents.length} seleccionados</Badge>
            </div>
          )}

          {/* Lista de estudiantes */}
          <div className="flex-1 overflow-y-auto space-y-2 max-h-96">
            {availableStudents.length === 0 ? (
              <div className="text-center py-8">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No se encontraron estudiantes" : "No hay estudiantes disponibles"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Todos los estudiantes ya están inscritos en este curso"}
                </p>
              </div>
            ) : (
              availableStudents.map((student) => (
                <div
                  key={student.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                    selectedStudents.includes(student.id) ? "bg-purple-50 border-purple-200" : "bg-white"
                  }`}
                  onClick={() => handleStudentToggle(student.id)}
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleStudentToggle(student.id)}
                  />

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {student.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{student.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {student.status === "Activo" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Desde {student.joinDate}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{student.enrolledCourses} cursos inscritos</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedStudents.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Inscribir {selectedStudents.length} estudiante{selectedStudents.length !== 1 ? "s" : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
