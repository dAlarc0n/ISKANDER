export interface Course {
  id: number
  title: string
  description: string
  instructor: string
  rol:boolean;
  category: string
  enrolledStudents: number
  createdDate: string
  thumbnail: string
}

export interface CreateCourseData {
  title: string
  description: string
  instructor: string
  category: string
}

export interface EnrolledCourse extends Course {
  progress: number
  totalLessons: number
  completedLessons: number
  nextLesson: string
}

export interface ExploreCourse extends Course {
  rating: number
  students: number
  price: number
  level: "beginner" | "intermediate" | "advanced"
}
