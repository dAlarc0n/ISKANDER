// app/routes/admin/courses/$id/forum/$forumId.tsx
import { useState, useMemo } from "react"
import { useParams, useNavigate } from "@remix-run/react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import {
  ArrowLeft, Search, Plus, MessageSquare, Users, TrendingUp, Filter, SortDesc
} from "lucide-react"
import { ForumPostCard } from "~/components/forum/forum-post-card"
import { CreatePostModal } from "~/components/forum/create-post-modal"
import type { ForumPost, ForumStats } from "~/types/forum"

const getForumData = (forumId: string) => {
  const forumData = {       
    "1": {
      id: 1,
      title: "Foro: Dudas sobre React Hooks",
      description: "Espacio para resolver dudas sobre hooks en React",
      courseTitle: "React Avanzado",
    },
    "6": {
      id: 6,
      title: "Foro: Dudas sobre React Hooks",
      description: "Espacio para resolver dudas sobre hooks en React",
      courseTitle: "React Avanzado",
    },
  }

  return forumData[forumId as keyof typeof forumData] || forumData["1"]
}

const mockStats: ForumStats = {
  totalPosts: 15,
  totalReplies: 47,
  totalParticipants: 12,
  lastActivity: "2024-03-16T10:30:00Z",
  lastActivityAuthor: "María García",
}

const mockPosts: ForumPost[] = [
  {
    id: 1,
    title: "¿Cómo funciona useEffect con dependencias?",
    content:
      "Tengo dudas sobre cuándo se ejecuta useEffect cuando tiene dependencias. ¿Alguien me puede explicar con un ejemplo práctico?",
    author: "María García",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    authorRole: "student",
    createdDate: "2024-03-16T10:30:00Z",
    replies: [
      {
        id: 1,
        content:
          "useEffect se ejecuta después del render cuando alguna de las dependencias cambia. Te doy un ejemplo:\n\nuseEffect(() => {\n  console.log('El count cambió');\n}, [count]);",
        author: "Juan Pérez",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        authorRole: "instructor",
        createdDate: "2024-03-16T11:00:00Z",
        likes: 5,
        isLiked: false,
      },
      {
        id: 2,
        content: "Excelente explicación profesor. ¿Y qué pasa si no ponemos dependencias?",
        author: "Carlos López",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        authorRole: "student",
        createdDate: "2024-03-16T11:15:00Z",
        likes: 2,
        isLiked: true,
      },
    ],
    isSticky: true,
    isLocked: false,
    views: 45,
    likes: 8,
    isLiked: true,
  },
  {
    id: 2,
    title: "Error al usar useState con objetos",
    content: "Cuando trato de actualizar un objeto con useState, no se actualiza la interfaz. ¿Qué estoy haciendo mal?",
    author: "Ana Martínez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    authorRole: "student",
    createdDate: "2024-03-15T14:20:00Z",
    replies: [
      {
        id: 3,
        content:
          "Probablemente estés mutando el objeto directamente. Recuerda que debes crear un nuevo objeto:\n\nsetUser({...user, name: 'Nuevo nombre'});",
        author: "Juan Pérez",
        authorAvatar: "/placeholder.svg?height=40&width=40",
        authorRole: "instructor",
        createdDate: "2024-03-15T15:00:00Z",
        likes: 3,
        isLiked: false,
      },
    ],
    isSticky: false,
    isLocked: false,
    views: 32,
    likes: 4,
    isLiked: false,
  },
  {
    id: 3,
    title: "Recursos adicionales para practicar",
    content:
      "¿Alguien conoce buenos recursos o ejercicios para practicar React hooks? Quiero reforzar lo que hemos visto en clase.",
    author: "Pedro Rodríguez",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    authorRole: "student",
    createdDate: "2024-03-14T09:45:00Z",
    replies: [],
    isSticky: false,
    isLocked: false,
    views: 28,
    likes: 6,
    isLiked: false,
  },
]

export default function ForumPage() {
  const { id, forumId } = useParams()
  const navigate = useNavigate()

  const forumData = getForumData(forumId!)
  const [posts, setPosts] = useState(mockPosts)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [filterBy, setFilterBy] = useState("all")
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false)

  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter((post) => {
        const matchesSearch =
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesFilter =
          filterBy === "all" ||
          (filterBy === "sticky" && post.isSticky) ||
          (filterBy === "unanswered" && post.replies.length === 0) ||
          (filterBy === "popular" && post.likes > 5)

        return matchesSearch && matchesFilter
      })
      .sort((a, b) => {
        if (a.isSticky && !b.isSticky) return -1
        if (!a.isSticky && b.isSticky) return 1

        switch (sortBy) {
          case "recent":
            return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
          case "popular":
            return b.likes - a.likes
          case "replies":
            return b.replies.length - a.replies.length
          case "views":
            return b.views - a.views
          default:
            return 0
        }
      })
  }, [posts, searchTerm, filterBy, sortBy])

  const handleCreatePost = (data: any) => {
    const newPost: ForumPost = {
      id: posts.length + 1,
      title: data.title,
      content: data.content,
      author: "Admin",
      authorRole: "admin",
      createdDate: new Date().toISOString(),
      replies: [],
      isSticky: data.isSticky || false,
      isLocked: false,
      views: 0,
      likes: 0,
      isLiked: false,
    }
    setPosts([newPost, ...posts])
  }

  const handlePostClick = (post: ForumPost) => {
    navigate(`/dashboard/courses/${id}/forum/${forumId}/post/${post.id}`)
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/courses/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al curso
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{forumData.title}</h1>
            <p className="text-gray-600">{forumData.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{mockStats.totalPosts}</p>
                  <p className="text-sm text-gray-600">Publicaciones</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{mockStats.totalReplies}</p>
                  <p className="text-sm text-gray-600">Respuestas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{mockStats.totalParticipants}</p>
                  <p className="text-sm text-gray-600">Participantes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm font-medium">Última actividad</p>
                <p className="text-xs text-gray-600">{new Date(mockStats.lastActivity).toLocaleDateString("es-ES")}</p>
                <p className="text-xs text-gray-500">por {mockStats.lastActivityAuthor}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Publicaciones del foro</CardTitle>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsCreatePostModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva publicación
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar en el foro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SortDesc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="popular">Más populares</SelectItem>
                  <SelectItem value="replies">Más respuestas</SelectItem>
                  <SelectItem value="views">Más vistas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="sticky">Destacadas</SelectItem>
                  <SelectItem value="unanswered">Sin responder</SelectItem>
                  <SelectItem value="popular">Populares</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredAndSortedPosts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? "No se encontraron publicaciones" : "No hay publicaciones aún"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Intenta con otros términos de búsqueda" : "Sé el primero en iniciar una discusión"}
                </p>
                {!searchTerm && (
                  <Button onClick={() => setIsCreatePostModalOpen(true)} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear primera publicación
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredAndSortedPosts.map((post) => (
              <ForumPostCard key={post.id} post={post} onPostClick={handlePostClick} isAdmin={true} />
            ))
          )}
        </div>

        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          onSubmit={handleCreatePost}
          isAdmin={true}
        />
      </div>
  )
}
