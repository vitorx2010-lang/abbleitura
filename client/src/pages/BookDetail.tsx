import { useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Download,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function BookDetail() {
  const [, params] = useRoute("/books/:slug");
  const { user, isAuthenticated } = useAuth();
  const [comment, setComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  const bookQuery = trpc.books.getBySlug.useQuery({ slug: params?.slug || "" });
  const commentsQuery = trpc.comments.getByBookId.useQuery({
    bookId: bookQuery.data?.id || 0,
  });

  const likeBook = trpc.books.like.useMutation();
  const createComment = trpc.comments.create.useMutation();
  const addFavorite = trpc.favorites.add.useMutation();
  const removeFavorite = trpc.favorites.remove.useMutation();
  const downloadBook = trpc.downloads.create.useMutation();

  const book = bookQuery.data;

  const handleLike = async () => {
    if (!isAuthenticated || !book) {
      window.location.href = getLoginUrl();
      return;
    }
    try {
      await likeBook.mutateAsync({ bookId: book.id });
      bookQuery.refetch();
    } catch (error) {
      console.error("Failed to like book:", error);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated || !book) {
      window.location.href = getLoginUrl();
      return;
    }
    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync({ bookId: book.id });
      } else {
        await addFavorite.mutateAsync({ bookId: book.id });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to update favorite:", error);
    }
  };

  const handleComment = async () => {
    if (!isAuthenticated || !book) {
      window.location.href = getLoginUrl();
      return;
    }
    if (!comment.trim()) return;

    try {
      await createComment.mutateAsync({
        bookId: book.id,
        content: comment,
      });
      setComment("");
      commentsQuery.refetch();
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleDownload = async (format: string) => {
    if (!isAuthenticated || !book) {
      window.location.href = getLoginUrl();
      return;
    }
    try {
      const result = await downloadBook.mutateAsync({
        bookId: book.id,
        format,
      });
      console.log("Download initiated:", result);
    } catch (error) {
      console.error("Failed to download:", error);
    }
  };

  if (bookQuery.isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse">
          <BookOpen className="w-16 h-16 text-slate-400" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">Livro não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-lg opacity-90">por {book.author}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Book Info */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Cover */}
                  <div className="md:col-span-1">
                    <div className="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-lg h-80 flex items-center justify-center">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <BookOpen className="w-24 h-24 text-slate-400" />
                      )}
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 mt-6">
                      <Button
                        onClick={handleLike}
                        className="w-full"
                        variant={(book?.likes || 0) > 0 ? "default" : "outline"}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Curtir ({book?.likes || 0})
                      </Button>
                      <Button
                        onClick={handleFavorite}
                        className="w-full"
                        variant={isFavorite ? "default" : "outline"}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {isFavorite ? "Favoritado" : "Favoritar"}
                      </Button>
                      <Button className="w-full" variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="md:col-span-2 space-y-6">
                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Gênero</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {book.genre}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Ano</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{book.year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Páginas</p>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {book.pages}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">ISBN</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{book.isbn}</p>
                      </div>
                    </div>

                    {/* Synopsis */}
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-2">Sinopse</h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {book.synopsis || book.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{book.downloads}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Downloads</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{book.rating}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Avaliação</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-pink-600">{book.reviews}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Avaliações</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Baixar Livro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {book.formats?.map((format: string) => (
                    <Button
                      key={format}
                      onClick={() => handleDownload(format)}
                      disabled={downloadBook.isPending}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {format}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Comentários ({commentsQuery.data?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Comment */}
                {isAuthenticated && (
                  <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <Textarea
                      placeholder="Compartilhe sua opinião sobre este livro..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-24"
                    />
                    <Button
                      onClick={handleComment}
                      disabled={createComment.isPending || !comment.trim()}
                      className="w-full"
                    >
                      Comentar
                    </Button>
                  </div>
                )}

                {/* Comments List */}
                {commentsQuery.isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
                    ))}
                  </div>
                ) : commentsQuery.data && commentsQuery.data.length > 0 ? (
                  <div className="space-y-4">
                    {commentsQuery.data.map((c) => (
                      <div
                        key={c.id}
                        className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            Usuário #{c.userId}
                          </p>
                          <span className="text-xs text-slate-600 dark:text-slate-400">
                            {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{c.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-slate-600 dark:text-slate-400 py-8">
                    Nenhum comentário ainda. Seja o primeiro!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Books */}
            <Card>
              <CardHeader>
                <CardTitle>Livros Relacionados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-3 bg-slate-100 dark:bg-slate-800 rounded">
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">
                        Livro Relacionado {i + 1}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Autor</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
