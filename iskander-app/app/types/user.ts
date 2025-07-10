export interface User {
  id: number
  name: string
  email: string
  status: "Activo" | "Inactivo"
  enrolledCourses: number
  joinDate: string
  avatar?: string
}

export interface CreateUserData {
  name: string
  email: string
  password: string
}
