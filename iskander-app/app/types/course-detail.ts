import type { Course } from "./course"
export interface CourseContent {
  id: number
  title: string
  type: string
  description?: string
  createdDate: string
  author: string
  fileUrl?: string
  fileSize?: string
  fileType?: string
  isVisible: boolean
}
export interface CourseSection {
  id: number
  title: string
  description?: string
  contents: CourseContent[]
  isVisible: boolean
  order: number
}

export interface CourseStudent {
  id: number
  name: string
  email: string
  enrolledDate: string
  lastAccess: string
  progress: number
  avatar?: string
}

export interface CourseGrade {
  id: number
  studentId: number
  studentName: string
  activity: string
  grade: number
  maxGrade: number
  submittedDate: string
  gradedDate?: string
}

export interface CourseAnnouncement {
  id: number
  title: string
  content: string
  author: string
  createdDate: string
  isVisible: boolean
}

export interface CourseForum {
  id: number
  title: string
  description: string
  posts: number
  lastPost: string
  lastPostAuthor: string
}

export interface CourseDetail extends Course {
  sections: CourseSection[]
  students: CourseStudent[]
  grades: CourseGrade[]
  announcements: CourseAnnouncement[]
  forums: CourseForum[]
}
