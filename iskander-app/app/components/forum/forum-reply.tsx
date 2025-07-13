// app/components/forum/forum-reply-component.tsx
import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Textarea } from "~/components/ui/textarea"
import { Heart, ReplyIcon, MoreVertical, Edit, Trash2, Send } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { ForumReply } from "~/types/forum"

interface ForumReplyProps {
  reply: ForumReply
  onReply?: (parentId: number, content: string) => void
  onEdit?: (reply: ForumReply) => void
  onDelete?: (replyId: number) => void
  onToggleLike?: (replyId: number) => void
  isAdmin?: boolean
  depth?: number
}

export function ForumReplyComponent({
  reply,
  onReply,
  onEdit,
  onDelete,
  onToggleLike,
  isAdmin = false,
  depth = 0,
}: ForumReplyProps) {
  const [isLiked, setIsLiked] = useState(reply.isLiked || false)
  const [likes, setLikes] = useState(reply.likes)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(reply.content)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
    onToggleLike?.(reply.id)
  }

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply?.(reply.id, replyContent)
      setReplyContent("")
      setShowReplyForm(false)
    }
  }

  const handleEdit = () => {
    if (editContent.trim()) {
      onEdit?.({ ...reply, content: editContent })
      setIsEditing(false)
    }
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
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-gray-200 pl-4" : ""}`}>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-8 w-8">
              <AvatarImage src={reply.authorAvatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">
                {reply.author
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-sm">{reply.author}</span>
                <Badge variant="secondary" className={`text-xs ${getRoleColor(reply.authorRole)}`}>
                  {getRoleText(reply.authorRole)}
                </Badge>
                <span className="text-xs text-gray-500">
                  {new Date(reply.createdDate).toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {reply.updatedDate && reply.updatedDate !== reply.createdDate && (
                    <span className="ml-1">(editado)</span>
                  )}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Editar respuesta..."
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleEdit}>
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false)
                        setEditContent(reply.content)
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{reply.content}</p>
              )}
            </div>
          </div>

          {(isAdmin || reply.authorRole === "instructor") && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => onDelete?.(reply.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-1 ${isLiked ? "text-red-500" : "text-gray-500"}`}
                onClick={handleLike}
              >
                <Heart className={`h-3 w-3 ${isLiked ? "fill-current" : ""}`} />
                <span className="text-xs">{likes}</span>
              </Button>

              {depth < 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-gray-500"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                >
                  <ReplyIcon className="h-3 w-3" />
                  <span className="text-xs">Responder</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {showReplyForm && (
          <div className="mt-3 space-y-2">
            <Textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escribe tu respuesta..."
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleReply} disabled={!replyContent.trim()}>
                <Send className="h-3 w-3 mr-1" />
                Responder
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowReplyForm(false)
                  setReplyContent("")
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
