import { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Download, Share2, MessageCircle, Star } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function BookDetail() {
  const [, params] = useRoute("/books/:slug");
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    {
      id: "1",
      author: "João Silva",
      text: "Excelente livro! Recomendo muito.",
      date: "2025-01-08",
      likes: 12,
    },
    {
      id: "2",
      author: "Maria Santos",
      text: "Uma obra-prima da literatura brasileira.",
      date: "2025-01-07",
      likes: 8,
    },
  ]);

  // Mock book data
  const book = {
    id: "1",
    slug: "dom-casmurro",
    title: "Dom Casmurro",
    author: "Machado de Assis",
    year: 1899,
    isbn: "978-8535902778",
    genre: "Romance",
    pages: 256,
    language: "Português (Brasil)",
    cover: "https://via.placeholder.com/300x450?text=Dom+Casmurro",
    synopsis:
      "Dom Casmurro é um romance de Machado de Assis publicado em 1899. A história é narrada em primeira pessoa por Bentinho, um homem que, já na velhice, decide contar sua vida a partir de suas memórias.",
    fullDescription:
      "Dom Casmurro é considerado uma das obras-primas da literatura brasileira. O romance retrata a história de amor entre Bentinho e Capitu, desde a infância até a idade adulta, explorando temas como ciúmes, traição e a subjetividade da memória. A narrativa é marcada pela ambiguidade, deixando em aberto a questão central: Capitu traiu Bentinho?",
    likes: 389,
    downloads: 1245,
    rating: 4.5,
    reviews: 234,
    formats: ["PDF", "EPUB", "MOBI"],
    languages: ["Português (Brasil)", "English", "Español"],
    relatedBooks: [
      {
        id: "2",
        title: "Quincas Borba",
        author: "Machado de Assis",
        cover: "https://via.placeholder.com/150x200?text=Quincas",
      },
      {
        id: "3",
        title: "Memórias Póstumas de Brás Cubas",
        author: "Machado de Assis",
        cover: "https://via.placeholder.com/150x200?text=Memórias",
      },
      {
        id: "4",
        title: "Iracema",
        author: "José de Alencar",
        cover: "https://via.placeholder.com/150x200?text=Iracema",
      },
    ],
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: String(comments.length + 1),
      author: "Você",
      text: newComment,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
    };

    setComments([comment, ...comments]);
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-slate-600 dark:text-slate-400">
          <a href="/books" className="hover:text-slate-900 dark:hover:text-white">
            Livros
          </a>
          {" / "}
          <span>{book.title}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Book Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="rounded-lg overflow-hidden shadow-lg mb-6">
                <img src={book.cover} alt={book.title} className="w-full h-auto" />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => {
                    if (!isAuthenticated) {
                      window.location.href = getLoginUrl();
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Livro
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`w-4 h-4 mr-2 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                  />
                  {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                </Button>

                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              {/* Stats */}
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Curtidas</span>
                      <span className="font-bold">{book.likes}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Downloads</span>
                      <span className="font-bold">{book.downloads}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Avaliação</span>
                      <div className="flex items-center gap-1">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(book.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-300"
                              }`}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Book Info */}
          <div className="lg:col-span-2">
            {/* Title and Author */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {book.title}
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-4">{book.author}</p>

              {/* Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-200 dark:border-slate-800">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ano</p>
                  <p className="font-bold text-slate-900 dark:text-white">{book.year}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Páginas</p>
                  <p className="font-bold text-slate-900 dark:text-white">{book.pages}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gênero</p>
                  <p className="font-bold text-slate-900 dark:text-white">{book.genre}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">ISBN</p>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{book.isbn}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Sinopse</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {book.synopsis}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {book.fullDescription}
              </p>
            </div>

            {/* Formats and Languages */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Formatos Disponíveis</h3>
                <div className="flex flex-wrap gap-2">
                  {book.formats.map((format) => (
                    <span
                      key={format}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {format}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">Idiomas</h3>
                <div className="flex flex-wrap gap-2">
                  {book.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Comentários ({comments.length})
            </h2>

            {/* Add Comment */}
            {isAuthenticated ? (
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <textarea
                    placeholder="Compartilhe sua opinião sobre este livro..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white mb-3 resize-none"
                    rows={4}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Postar Comentário
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    Faça login para comentar neste livro
                  </p>
                  <Button
                    onClick={() => (window.location.href = getLoginUrl())}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Fazer Login
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{comment.author}</CardTitle>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {comment.date}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">{comment.text}</p>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4 mr-2" />
                      {comment.likes}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Related Books */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Livros Relacionados
            </h2>
            <div className="space-y-4">
              {book.relatedBooks.map((relatedBook) => (
                <Card key={relatedBook.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex gap-4">
                      <img
                        src={relatedBook.cover}
                        alt={relatedBook.title}
                        className="w-20 h-32 object-cover rounded-l-lg"
                      />
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">
                            {relatedBook.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {relatedBook.author}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          Ver
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
