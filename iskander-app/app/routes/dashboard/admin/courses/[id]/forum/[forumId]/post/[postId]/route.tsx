import { useState } from "react"
import { useNavigate, useParams } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Textarea } from "~/components/ui/textarea"
import {
  ArrowLeft,
  Heart,
  Pin,
  Lock,
  Eye,
  MessageSquare,
  Send,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import type { ForumPost, ForumReply } from "~/types/forum"
import { ForumReplyComponent } from "~/components/forum/forum-reply"

const mockPost: ForumPost = {
  id: 1,
  title: "¿Cómo funciona useEffect con dependencias?",
  content:
    "Tengo dudas sobre cuándo se ejecuta useEffect cuando tiene dependencias. ¿Alguien me puede explicar con un ejemplo práctico?\n\nHe estado leyendo la documentación pero me gustaría entender mejor los casos de uso reales. Por ejemplo:\n\n1. ¿Qué pasa si una dependencia es un objeto?\n2. ¿Cómo optimizar re-renders innecesarios?\n3. ¿Cuándo usar useCallback o useMemo?\n\nGracias de antemano por su ayuda.",
  author: "María García",
  authorAvatar: "/placeholder.svg?height=40&width=40",
  authorRole: "student",
  createdDate: "2024-03-16T10:30:00Z",
  replies: [
    {
      id: 1,
      content:
        "Excelente pregunta María. useEffect se ejecuta después del render cuando alguna de las dependencias cambia. Te explico con ejemplos:\n\n```javascript\n// Se ejecuta solo cuando 'count' cambia\nuseEffect(() => {\n  console.log('El count cambió:', count);\n  document.title = `Count: ${count}`;\n}, [count]);\n```\n\nPara objetos, React compara por referencia, no por contenido:",
      author: "Juan Pérez",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      authorRole: "instructor",
      createdDate: "2024-03-16T11:00:00Z",
      likes: 8,
      isLiked: true,
    },
    {
      id: 2,
      content: "Gracias profesor! Muy clara la explicación. ¿Y qué pasa si no ponemos dependencias en el array?",
      author: "Carlos López",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      authorRole: "student",
      createdDate: "2024-03-16T11:15:00Z",
      likes: 2,
      isLiked: false,
    },
    {
      id: 3,
      content:
        "Si no pones dependencias, useEffect se ejecuta después de cada render. Si pones un array vacío [], se ejecuta solo una vez al montar el componente.",
      author: "Juan Pérez",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      authorRole: "instructor",
      createdDate: "2024-03-16T11:20:00Z",
      likes: 5,
      isLiked: false,
    },
    {
      id: 4,
      content: "Perfecto! Una pregunta más: ¿cómo manejo efectos que dependen de props que son objetos?",
      author: "Ana Martínez",
      authorAvatar: "/placeholder.svg?height=40&width=40",
      authorRole: "student",
      createdDate: "2024-03-16T12:00:00Z",
      likes: 1,
      isLiked: false,
    },
  ],
  isSticky: true,
  isLocked: false,
  views: 45,
  likes: 12,
  isLiked: true,
}

export default function ForumPostPage() {
  const params = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(mockPost)
  const [replyContent, setReplyContent] = useState("")
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [likes, setLikes] = useState(post.likes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const handleReply = () => {
    if (replyContent.trim()) {
      const newReply: ForumReply = {
        id: post.replies.length + 1,
        content: replyContent,
        author: "Admin",
        authorRole: "admin",
        createdDate: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      }

      setPost((prev) => ({
        ...prev,
        replies: [...prev.replies, newReply],
      }))
      setReplyContent("")
    }
  }

  const handleReplyToReply = (parentId: number, content: string) => {
    const newReply: ForumReply = {
      id: post.replies.length + 1,
      content,
      author: "Admin",
      authorRole: "admin",
      createdDate: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      parentReplyId: parentId,
    }

    setPost((prev) => ({
      ...prev,
      replies: [...prev.replies, newReply],
    }))
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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al foro
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {post.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    {post.isSticky && <Pin className="h-5 w-5 text-orange-500" />}
                    {post.isLocked && <Lock className="h-5 w-5 text-red-500" />}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-medium">{post.author}</span>
                    <Badge variant="secondary" className={getRoleColor(post.authorRole)}>
                      {getRoleText(post.authorRole)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent>
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.views} vistas</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.replies.length} respuestas</span>
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

        <Card>
          <CardHeader>
            <CardTitle>Respuestas ({post.replies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {post.replies.map((reply) => (
                <ForumReplyComponent
                  key={reply.id}
                  reply={reply}
                  onReply={handleReplyToReply}
                  isAdmin={true}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agregar respuesta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                rows={6}
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Publicar respuesta
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
