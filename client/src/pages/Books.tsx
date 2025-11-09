import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Heart, Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

const GENRES = ["Todos", "Romance", "Ficção Científica", "Mistério", "Fantasia", "Poesia"];

export default function Books() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Todos");
  const [page, setPage] = useState(0);
  const limit = 12;

  const booksQuery = trpc.books.list.useQuery({
    limit,
    offset: page * limit,
    genre: genre !== "Todos" ? genre : undefined,
    search: search || undefined,
  });

  const likeBook = trpc.books.like.useMutation();

  const handleLike = async (bookId: number) => {
    try {
      await likeBook.mutateAsync({ bookId });
      booksQuery.refetch();
    } catch (error) {
      console.error("Failed to like book:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Catálogo de Livros</h1>
          <p className="text-lg opacity-90">Explore nossa coleção completa de livros</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Filtros</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Buscar
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Título ou autor..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block">
                  Gênero
                </label>
                <div className="space-y-2">
                  {GENRES.map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setGenre(g);
                        setPage(0);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        genre === g
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Results Info */}
            <div className="mb-8">
              <p className="text-slate-600 dark:text-slate-400">
                {booksQuery.data?.length || 0} livros encontrados
              </p>
            </div>

            {/* Books Grid */}
            {booksQuery.isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="h-96 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : booksQuery.data && booksQuery.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {booksQuery.data.map((book) => (
                    <Link key={book.id} href={`/books/${book.slug}`}>
                      <a>
                        <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group overflow-hidden">
                          <CardContent className="p-0 h-full flex flex-col">
                            {/* Cover */}
                            <div className="relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 h-64 flex items-center justify-center flex-shrink-0">
                              {book.coverUrl ? (
                                <img
                                  src={book.coverUrl}
                                  alt={book.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <BookOpen className="w-16 h-16 text-slate-400" />
                              )}

                              {/* Action Buttons */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleLike(book.id);
                                  }}
                                  className="bg-white text-red-500 p-3 rounded-full hover:scale-110 transition-transform"
                                >
                                  <Heart className="w-5 h-5 fill-current" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                  }}
                                  className="bg-white text-blue-600 p-3 rounded-full hover:scale-110 transition-transform"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                              </div>

                              {/* Like Badge */}
                              <div className="absolute top-3 right-3 bg-white dark:bg-slate-900 px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                <Heart className="w-4 h-4 text-red-500 fill-current" />
                                <span className="text-sm font-medium text-slate-900 dark:text-white">
                                  {book.likes}
                                </span>
                              </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 flex-1 flex flex-col">
                              <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">
                                {book.title}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                                {book.author}
                              </p>

                              <div className="mt-auto space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                                    {book.genre}
                                  </span>
                                  <span className="text-slate-600 dark:text-slate-400">
                                    {book.year}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400">
                                  {book.downloads} downloads
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-4 mt-12">
                  <Button
                    variant="outline"
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2">
                    {[...Array(Math.min(5, Math.ceil((booksQuery.data?.length || 0) / limit) + 1))].map(
                      (_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            page === i
                              ? "bg-blue-600 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-700"
                          }`}
                        >
                          {i + 1}
                        </button>
                      )
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={(booksQuery.data?.length || 0) < limit}
                  >
                    Próximo
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Nenhum livro encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
