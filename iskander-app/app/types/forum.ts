export interface ForumPost {
  id: number
  title: string
  content: string
  author: string
  authorAvatar?: string
  authorRole: "student" | "instructor" | "admin"
  createdDate: string
  updatedDate?: string
  replies: ForumReply[]
  isSticky?: boolean
  isLocked?: boolean
  views: number
  likes: number
  isLiked?: boolean
}

export interface ForumReply {
  id: number
  content: string
  author: string
  authorAvatar?: string
  authorRole: "student" | "instructor" | "admin"
  createdDate: string
  updatedDate?: string
  likes: number
  isLiked?: boolean
  parentReplyId?: number // Para respuestas anidadas
}

export interface ForumStats {
  totalPosts: number
  totalReplies: number
  totalParticipants: number
  lastActivity: string
  lastActivityAuthor: string
}

export interface CreatePostData {
  title: string
  content: string
}

export interface CreateReplyData {
  content: string
  parentReplyId?: number
}
