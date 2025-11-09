import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Download, Heart, MessageCircle, Zap, Users, Mail, ArrowRight } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const booksQuery = trpc.books.list.useQuery({ limit: 4, offset: 0 });
  const postsQuery = trpc.posts.list.useQuery({ limit: 3, offset: 0 });
  const subscribeNewsletter = trpc.newsletter.subscribe.useMutation();

  const handleSubscribe = async () => {
    if (!email) return;
    try {
      await subscribeNewsletter.mutateAsync({ email });
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    } catch (error) {
      console.error("Failed to subscribe:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-xl text-slate-900 dark:text-white">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/books">
              <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                Livros
              </a>
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link href="/admin">
                <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  Admin
                </a>
              </Link>
            )}
            {isAuthenticated ? (
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Olá, {user?.name || "Usuário"}
              </span>
            ) : (
              <Button onClick={() => (window.location.href = getLoginUrl())} size="sm">
                Login
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
                  Descubra Histórias Incríveis
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400">
                  Acesse uma biblioteca completa de livros digitais em múltiplos idiomas. Leia, compartilhe e explore o mundo através da literatura.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/books">
                  <a>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Explorar Livros
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </Link>
                {!isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => (window.location.href = getLoginUrl())}
                  >
                    Fazer Login
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <p className="text-3xl font-bold text-blue-600">500+</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Livros</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">10K+</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Leitores</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-pink-600">5</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Idiomas</p>
                </div>
              </div>
            </div>

            <div className="relative h-96 lg:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <BookOpen className="w-24 h-24 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-semibold">Sua Jornada de Leitura Começa Aqui</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Destaques</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Conheça os livros mais populares da nossa plataforma
            </p>
          </div>

          {booksQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {booksQuery.data?.map((book) => (
                <Link key={book.id} href={`/books/${book.slug}`}>
                  <a>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer group">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 h-64 flex items-center justify-center">
                          {book.coverUrl ? (
                            <img
                              src={book.coverUrl}
                              alt={book.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <BookOpen className="w-16 h-16 text-slate-400" />
                          )}
                          <button className="absolute top-3 right-3 bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                            <Heart className="w-5 h-5 text-red-500" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2">
                            {book.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                            {book.author}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">{book.genre}</span>
                            <span className="flex items-center gap-1 text-red-500">
                              <Heart className="w-4 h-4 fill-current" />
                              {book.likes}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Últimos Posts</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Leia artigos e notícias sobre literatura e leitura
            </p>
          </div>

          {postsQuery.isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {postsQuery.data?.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>{post.publishedAt?.toString().split("T")[0]}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                      {post.excerpt || post.content?.substring(0, 100)}
                    </p>
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                      Ler mais →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Mail className="w-12 h-12 text-white mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-4">Fique por Dentro</h2>
            <p className="text-lg text-blue-100 mb-8">
              Receba notícias sobre novos livros e artigos direto no seu email
            </p>

            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white dark:bg-slate-900"
                onKeyPress={(e) => e.key === "Enter" && handleSubscribe()}
              />
              <Button
                onClick={handleSubscribe}
                disabled={subscribeNewsletter.isPending}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                {subscribeNewsletter.isPending ? "..." : "Inscrever"}
              </Button>
            </div>

            {subscribed && (
              <p className="text-white mt-4 text-sm">✓ Obrigado por se inscrever!</p>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            Por Que Escolher Abbleitura?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Biblioteca Completa
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Acesso a centenas de livros em múltiplos idiomas e formatos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Zap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Downloads Rápidos
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Baixe seus livros favoritos em segundos e leia offline
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Comunidade Ativa
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Comente, compartilhe e conecte-se com outros leitores
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Pronto para Começar?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Junte-se a milhares de leitores que já descobriram suas histórias favoritas
          </p>
          <Link href="/books">
            <a>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Explorar Agora
              </Button>
            </a>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">Abbleitura</h3>
              <p className="text-sm">Sua plataforma de leitura digital</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Livros
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Termos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Social</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Abbleitura. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
