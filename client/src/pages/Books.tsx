import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Download, Share2, Search } from "lucide-react";

export default function Books() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Mock data - in real app, this would come from API
  const allBooks = [
    {
      id: "1",
      slug: "o-cortico",
      title: "O Cortiço",
      author: "Aluísio Azevedo",
      cover: "https://via.placeholder.com/200x300?text=O+Cortiço",
      genre: "Romance",
      year: 1890,
      likes: 245,
      synopsis: "Um romance naturalista que retrata a vida em um cortiço do Rio de Janeiro.",
    },
    {
      id: "2",
      slug: "dom-casmurro",
      title: "Dom Casmurro",
      author: "Machado de Assis",
      cover: "https://via.placeholder.com/200x300?text=Dom+Casmurro",
      genre: "Romance",
      year: 1899,
      likes: 389,
      synopsis: "Uma história de amor, ciúmes e traição narrada pelo próprio protagonista.",
    },
    {
      id: "3",
      slug: "grande-sertao-veredas",
      title: "Grande Sertão: Veredas",
      author: "Guimarães Rosa",
      cover: "https://via.placeholder.com/200x300?text=Grande+Sertão",
      genre: "Romance",
      year: 1956,
      likes: 312,
      synopsis: "Uma epopeia do sertão mineiro com linguagem inovadora e personagens memoráveis.",
    },
    {
      id: "4",
      slug: "vidas-secas",
      title: "Vidas Secas",
      author: "Graciliano Ramos",
      cover: "https://via.placeholder.com/200x300?text=Vidas+Secas",
      genre: "Romance",
      year: 1938,
      likes: 198,
      synopsis: "A história de uma família retirante fugindo pela seca do sertão.",
    },
    {
      id: "5",
      slug: "iracema",
      title: "Iracema",
      author: "José de Alencar",
      cover: "https://via.placeholder.com/200x300?text=Iracema",
      genre: "Romance",
      year: 1865,
      likes: 267,
      synopsis: "Uma lenda indígena sobre o amor entre uma índia e um colonizador português.",
    },
    {
      id: "6",
      slug: "memórias-póstumas-brás-cubas",
      title: "Memórias Póstumas de Brás Cubas",
      author: "Machado de Assis",
      cover: "https://via.placeholder.com/200x300?text=Memórias",
      genre: "Romance",
      year: 1881,
      likes: 421,
      synopsis: "Uma obra revolucionária narrada por um defunto que conta sua vida.",
    },
    {
      id: "7",
      slug: "capitaes-da-areia",
      title: "Capitães da Areia",
      author: "Jorge Amado",
      cover: "https://via.placeholder.com/200x300?text=Capitães",
      genre: "Romance",
      year: 1937,
      likes: 334,
      synopsis: "A história de meninos de rua que vivem em um trapiche em Salvador.",
    },
    {
      id: "8",
      slug: "gabriela-cravo-canela",
      title: "Gabriela, Cravo e Canela",
      author: "Jorge Amado",
      cover: "https://via.placeholder.com/200x300?text=Gabriela",
      genre: "Romance",
      year: 1958,
      likes: 298,
      synopsis: "Um romance de amor e paixão ambientado em Ilhéus, Bahia.",
    },
  ];

  const genres = ["all", "Romance", "Poesia", "Drama", "Ficção Científica"];
  const itemsPerPage = 12;

  // Filter books
  const filteredBooks = allBooks.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Paginate
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + itemsPerPage);

  const toggleFavorite = (bookId: string) => {
    setFavorites((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Catálogo de Livros</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore nossa biblioteca completa de livros digitais
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar por título ou autor..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedGenre(genre);
                    setCurrentPage(1);
                  }}
                >
                  {genre === "all" ? "Todos" : genre}
                </Button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            {filteredBooks.length} livro{filteredBooks.length !== 1 ? "s" : ""} encontrado{filteredBooks.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Books Grid */}
        {paginatedBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {paginatedBooks.map((book) => (
                <Card
                  key={book.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden h-64 bg-slate-200 dark:bg-slate-800">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => toggleFavorite(book.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              favorites.includes(book.id) ? "fill-red-500 text-red-500" : ""
                            }`}
                          />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription>{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                      {book.synopsis}
                    </p>
                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{book.genre}</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" /> {book.likes}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    size="sm"
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Nenhum livro encontrado. Tente uma busca diferente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
