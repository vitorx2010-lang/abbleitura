import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  BookOpen,
  FileText,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [books, setBooks] = useState([
    {
      id: "1",
      title: "Dom Casmurro",
      author: "Machado de Assis",
      genre: "Romance",
      status: "published",
      downloads: 245,
      likes: 389,
    },
    {
      id: "2",
      title: "Grande Sertão: Veredas",
      author: "Guimarães Rosa",
      genre: "Romance",
      status: "published",
      downloads: 198,
      likes: 312,
    },
  ]);

  const [posts, setPosts] = useState([
    {
      id: "1",
      title: "Literatura Brasileira Clássica",
      author: "Admin",
      status: "published",
      date: "2025-01-08",
      views: 1245,
    },
    {
      id: "2",
      title: "Tradução Automática: Desafios",
      author: "Admin",
      status: "draft",
      date: "2025-01-07",
      views: 0,
    },
  ]);

  const [pendingComments, setPendingComments] = useState([
    {
      id: "1",
      author: "João Silva",
      text: "Excelente livro! Recomendo muito.",
      book: "Dom Casmurro",
      date: "2025-01-08",
    },
    {
      id: "2",
      author: "Maria Santos",
      text: "Uma obra-prima da literatura brasileira.",
      book: "Dom Casmurro",
      date: "2025-01-07",
    },
  ]);

  // Dashboard Stats
  const stats = [
    { label: "Total de Livros", value: books.length, icon: BookOpen, color: "bg-blue-500" },
    { label: "Total de Posts", value: posts.length, icon: FileText, color: "bg-purple-500" },
    { label: "Comentários Pendentes", value: pendingComments.length, icon: MessageSquare, color: "bg-orange-500" },
    { label: "Downloads Totais", value: books.reduce((sum, b) => sum + b.downloads, 0), icon: BarChart3, color: "bg-green-500" },
  ];

  const approveComment = (id: string) => {
    setPendingComments(pendingComments.filter((c) => c.id !== id));
  };

  const rejectComment = (id: string) => {
    setPendingComments(pendingComments.filter((c) => c.id !== id));
  };

  const deleteBook = (id: string) => {
    setBooks(books.filter((b) => b.id !== id));
  };

  const deletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Acesso Negado
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Você não tem permissão para acessar o painel de administração.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Painel de Administração
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Bem-vindo, {user?.name}! Gerencie seu conteúdo aqui.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-slate-200 dark:border-slate-800">
          {[
            { id: "overview", label: "Visão Geral" },
            { id: "books", label: "Livros" },
            { id: "posts", label: "Posts" },
            { id: "comments", label: "Comentários" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Books */}
            <Card>
              <CardHeader>
                <CardTitle>Livros Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {books.slice(0, 3).map((book) => (
                    <div key={book.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{book.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{book.author}</p>
                      </div>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {book.downloads} downloads
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Posts Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts.slice(0, 3).map((post) => (
                    <div key={post.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{post.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{post.date}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        post.status === "published"
                          ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                          : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                      }`}>
                        {post.status === "published" ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "books" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Livros</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Livro
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-900 dark:text-white">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-900 dark:text-white">
                      Autor
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-900 dark:text-white">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-900 dark:text-white">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {books.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">{book.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {book.author}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          Publicado
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                        {book.downloads}
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteBook(book.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gerenciar Posts</h2>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Novo Post
              </Button>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                          {post.title}
                        </h3>
                        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <span>Por {post.author}</span>
                          <span>{post.date}</span>
                          <span>{post.views} visualizações</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deletePost(post.id)}
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

        {activeTab === "comments" && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Comentários Pendentes ({pendingComments.length})
            </h2>

            {pendingComments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    Nenhum comentário pendente de moderação.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-slate-900 dark:text-white">
                            {comment.author}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {comment.date}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          Em: <span className="font-medium">{comment.book}</span>
                        </p>
                        <p className="text-slate-900 dark:text-white">{comment.text}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => approveComment(comment.id)}
                        >
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectComment(comment.id)}
                        >
                          Rejeitar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
