export interface Activity {
  id: number
  action: string
  user?: string
  course?: string
  item?: string
  time: string
}

export interface Stats {
  totalUsers: number
  totalCourses: number
  totalContent: number
  activeStudents: number
}

export interface StudentStats {
  totalCourses: number
  completedCourses: number
  totalHours: number
  certificates: number
}
