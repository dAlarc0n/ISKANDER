"use client"

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
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { FileText } from "lucide-react"
import type { CourseGrade, CourseStudent } from "~/types/course-detail"

interface GradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (grade: Omit<CourseGrade, "id">) => void
  students: CourseStudent[]
  activities: string[]
  editingGrade?: CourseGrade | null
}

interface GradeFormData {
  studentId: number
  activity: string
  grade: number
  maxGrade: number
  feedback: string
  submittedDate: string
}

export function GradeModal({ isOpen, onClose, onSave, students, activities, editingGrade }: GradeModalProps) {
  const [formData, setFormData] = useState<GradeFormData>({
    studentId: 0,
    activity: "",
    grade: 0,
    maxGrade: 100,
    feedback: "",
    submittedDate: new Date().toISOString().split("T")[0],
  })

  // Inicializar formulario cuando se abre para editar
  useState(() => {
    if (editingGrade && isOpen) {
      const student = students.find((s) => s.name === editingGrade.studentName)
      setFormData({
        studentId: student?.id || 0,
        activity: editingGrade.activity,
        grade: editingGrade.grade,
        maxGrade: editingGrade.maxGrade,
        feedback: "",
        submittedDate: editingGrade.submittedDate,
      })
    }
  })

  const selectedStudent = students.find((s) => s.id === formData.studentId)
  const gradePercentage = formData.maxGrade > 0 ? (formData.grade / formData.maxGrade) * 100 : 0

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return "Excelente"
    if (percentage >= 70) return "Bueno"
    if (percentage >= 60) return "Regular"
    return "Necesita mejorar"
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStudent) return

    const newGrade: Omit<CourseGrade, "id"> = {
      studentId: formData.studentId,
      studentName: selectedStudent.name,
      activity: formData.activity,
      grade: formData.grade,
      maxGrade: formData.maxGrade,
      submittedDate: formData.submittedDate,
      gradedDate: new Date().toISOString(),
    }

    onSave(newGrade)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setFormData({
      studentId: 0,
      activity: "",
      grade: 0,
      maxGrade: 100,
      feedback: "",
      submittedDate: new Date().toISOString().split("T")[0],
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
          <DialogTitle>{editingGrade ? "Editar Calificación" : "Nueva Calificación"}</DialogTitle>
          <DialogDescription>
            {editingGrade ? "Modifica la calificación existente" : "Asigna una calificación a un estudiante"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Estudiante */}
          <div className="grid gap-2">
            <Label htmlFor="student">Estudiante *</Label>
            <Select
              value={formData.studentId.toString()}
              onValueChange={(value) => setFormData({ ...formData, studentId: Number.parseInt(value) })}
              disabled={!!editingGrade}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estudiante" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id.toString()}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={student.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {student.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{student.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información del Estudiante Seleccionado */}
          {selectedStudent && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {selectedStudent.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{selectedStudent.name}</h4>
                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>Progreso del curso: {selectedStudent.progress}%</span>
                    <span>Último acceso: {new Date(selectedStudent.lastAccess).toLocaleDateString("es-ES")}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Progress value={selectedStudent.progress} className="w-20 mb-1" />
                  <span className="text-xs text-gray-500">{selectedStudent.progress}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Actividad */}
          <div className="grid gap-2">
            <Label htmlFor="activity">Actividad *</Label>
            <Select
              value={formData.activity}
              onValueChange={(value) => setFormData({ ...formData, activity: value })}
              disabled={!!editingGrade}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar actividad" />
              </SelectTrigger>
              <SelectContent>
                {activities.map((activity) => (
                  <SelectItem key={activity} value={activity}>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span>{activity}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calificación */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="grade">Calificación obtenida *</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max={formData.maxGrade}
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxGrade">Calificación máxima *</Label>
              <Input
                id="maxGrade"
                type="number"
                min="1"
                value={formData.maxGrade}
                onChange={(e) => setFormData({ ...formData, maxGrade: Number.parseFloat(e.target.value) || 100 })}
                required
              />
            </div>
          </div>

          {/* Vista previa de la calificación */}
          {formData.grade > 0 && formData.maxGrade > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Vista previa de la calificación</h4>
                  <p className="text-sm text-gray-600">
                    {formData.grade} de {formData.maxGrade} puntos
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getGradeColor(gradePercentage)}`}>
                    {Math.round(gradePercentage)}%
                  </div>
                  <Badge variant="secondary" className={`${getGradeColor(gradePercentage)} bg-transparent`}>
                    {getGradeLabel(gradePercentage)}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* Fecha de entrega */}
          <div className="grid gap-2">
            <Label htmlFor="submittedDate">Fecha de entrega</Label>
            <Input
              id="submittedDate"
              type="date"
              value={formData.submittedDate}
              onChange={(e) => setFormData({ ...formData, submittedDate: e.target.value })}
            />
          </div>

          {/* Comentarios/Feedback */}
          <div className="grid gap-2">
            <Label htmlFor="feedback">Comentarios para el estudiante</Label>
            <Textarea
              id="feedback"
              value={formData.feedback}
              onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              placeholder="Comentarios opcionales sobre el desempeño del estudiante..."
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!formData.studentId || !formData.activity || formData.grade < 0}
            >
              {editingGrade ? "Actualizar Calificación" : "Guardar Calificación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
