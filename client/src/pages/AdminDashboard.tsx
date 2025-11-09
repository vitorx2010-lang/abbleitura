import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  MessageSquare,
  BarChart3,
  FileText,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "books" | "posts" | "comments">(
    "dashboard"
  );
  const [showNewBook, setShowNewBook] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    slug: "",
    description: "",
    genre: "",
    year: 2025,
  });

  const booksQuery = trpc.books.list.useQuery({ limit: 100 });
  const postsQuery = trpc.posts.list.useQuery({ limit: 100 });
  const pendingCommentsQuery = trpc.comments.getPending.useQuery();

  const createBook = trpc.books.create.useMutation();
  const deleteBook = trpc.books.delete.useMutation();
  const createPost = trpc.posts.create.useMutation();
  const deletePost = trpc.posts.delete.useMutation();
  const approveComment = trpc.comments.approve.useMutation();
  const rejectComment = trpc.comments.reject.useMutation();

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Você não tem permissão para acessar esta página
          </p>
          <Button onClick={() => (window.location.href = "/")}>Voltar para Home</Button>
        </div>
      </div>
    );
  }

  const handleCreateBook = async () => {
    try {
      await createBook.mutateAsync({
        ...formData,
        formats: ["PDF", "EPUB"],
        languages: ["pt-BR"],
      });
      setFormData({ title: "", author: "", slug: "", description: "", genre: "", year: 2025 });
      setShowNewBook(false);
      booksQuery.refetch();
    } catch (error) {
      console.error("Failed to create book:", error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este livro?")) {
      try {
        await deleteBook.mutateAsync({ id });
        booksQuery.refetch();
      } catch (error) {
        console.error("Failed to delete book:", error);
      }
    }
  };

  const handleCreatePost = async () => {
    try {
      await createPost.mutateAsync({
        title: formData.title,
        content: formData.description,
        slug: formData.slug,
        excerpt: formData.description?.substring(0, 100),
      });
      setFormData({ title: "", author: "", slug: "", description: "", genre: "", year: 2025 });
      setShowNewPost(false);
      postsQuery.refetch();
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este post?")) {
      try {
        await deletePost.mutateAsync({ id });
        postsQuery.refetch();
      } catch (error) {
        console.error("Failed to delete post:", error);
      }
    }
  };

  const handleApproveComment = async (id: number) => {
    try {
      await approveComment.mutateAsync({ id });
      pendingCommentsQuery.refetch();
    } catch (error) {
      console.error("Failed to approve comment:", error);
    }
  };

  const handleRejectComment = async (id: number) => {
    try {
      await rejectComment.mutateAsync({ id });
      pendingCommentsQuery.refetch();
    } catch (error) {
      console.error("Failed to reject comment:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Painel de Administração</h1>
          <p className="opacity-90">Gerencie conteúdo, livros e comentários</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "books", label: "Livros", icon: BookOpen },
            { id: "posts", label: "Posts", icon: FileText },
            { id: "comments", label: "Comentários", icon: MessageSquare },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === id
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-blue-600">{booksQuery.data?.length || 0}</p>
                <p className="text-slate-600 dark:text-slate-400">Livros</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-purple-600">{postsQuery.data?.length || 0}</p>
                <p className="text-slate-600 dark:text-slate-400">Posts</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-pink-600">
                  {pendingCommentsQuery.data?.length || 0}
                </p>
                <p className="text-slate-600 dark:text-slate-400">Comentários Pendentes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">100K+</p>
                <p className="text-slate-600 dark:text-slate-400">Downloads</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Books Tab */}
        {activeTab === "books" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Livros</h2>
              <Button onClick={() => setShowNewBook(!showNewBook)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Livro
              </Button>
            </div>

            {showNewBook && (
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Novo Livro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Título"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <Input
                    placeholder="Autor"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                  <Input
                    placeholder="Slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <Input
                    placeholder="Gênero"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  />
                  <Textarea
                    placeholder="Descrição"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateBook} disabled={createBook.isPending}>
                      Criar
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewBook(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {booksQuery.data?.map((book) => (
                <Card key={book.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{book.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{book.author}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Posts</h2>
              <Button onClick={() => setShowNewPost(!showNewPost)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Post
              </Button>
            </div>

            {showNewPost && (
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Novo Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Título"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <Input
                    placeholder="Slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <Textarea
                    placeholder="Conteúdo"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="min-h-32"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreatePost} disabled={createPost.isPending}>
                      Criar
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewPost(false)}>
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4">
              {postsQuery.data?.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{post.title}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Comments Tab */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Moderação de Comentários ({pendingCommentsQuery.data?.length || 0})
            </h2>

            <div className="grid gap-4">
              {pendingCommentsQuery.data && pendingCommentsQuery.data.length > 0 ? (
                pendingCommentsQuery.data.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Usuário #{comment.userId}
                        </p>
                        <p className="text-slate-900 dark:text-white">{comment.content}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveComment(comment.id)}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectComment(comment.id)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Rejeitar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-600 dark:text-slate-400">
                    Nenhum comentário pendente
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
