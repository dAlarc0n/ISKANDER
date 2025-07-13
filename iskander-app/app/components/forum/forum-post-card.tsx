// app/components/forum/forum-post-card.tsx
import { useState } from "react"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { MessageSquare, Eye, Heart, Pin, Lock, MoreVertical, Edit, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import type { ForumPost } from "~/types/forum"

type ForumPostCardProps = {
  post: ForumPost
  onPostClick: (post: ForumPost) => void
  onEdit?: (post: ForumPost) => void
  onDelete?: (postId: number) => void
  onToggleLike?: (postId: number) => void
  isAdmin?: boolean
}

export function ForumPostCard({
  post,
  onPostClick,
  onEdit,
  onDelete,
  onToggleLike,
  isAdmin = false,
}: ForumPostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
    onToggleLike?.(post.id)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "instructor":
        return "bg-blue-100 text-blue-800"
      case "admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case "instructor":
        return "Instructor"
      case "admin":
        return "Admin"
      default:
        return "Estudiante"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onPostClick(post)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
              <AvatarFallback>
                {post.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg truncate">{post.title}</h3>
                {post.isSticky && <Pin className="h-4 w-4 text-orange-500" />}
                {post.isLocked && <Lock className="h-4 w-4 text-red-500" />}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{post.author}</span>
                <Badge variant="secondary" className={`text-xs ${getRoleColor(post.authorRole)}`}>
                  {getRoleText(post.authorRole)}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(post.createdDate).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
            </div>
          </div>

          {(isAdmin || post.authorRole === "instructor") && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdit?.(post)
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete?.(post.id)
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              <span>{post.replies.length} respuestas</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{post.views} vistas</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-500"}`}
            onClick={handleLike}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            <span>{likes}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
