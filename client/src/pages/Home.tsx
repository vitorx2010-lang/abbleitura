import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, BookOpen, Users, Zap } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useState } from "react";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  // Featured books data
  const featuredBooks = [
    {
      id: "1",
      slug: "o-cortico",
      title: "O Cortiço",
      author: "Aluísio Azevedo",
      cover: "https://via.placeholder.com/200x300?text=O+Cortiço",
      likes: 245,
      genre: "Romance",
    },
    {
      id: "2",
      slug: "dom-casmurro",
      title: "Dom Casmurro",
      author: "Machado de Assis",
      cover: "https://via.placeholder.com/200x300?text=Dom+Casmurro",
      likes: 389,
      genre: "Romance",
    },
    {
      id: "3",
      slug: "grande-sertao-veredas",
      title: "Grande Sertão: Veredas",
      author: "Guimarães Rosa",
      cover: "https://via.placeholder.com/200x300?text=Grande+Sertão",
      likes: 312,
      genre: "Romance",
    },
    {
      id: "4",
      slug: "vidas-secas",
      title: "Vidas Secas",
      author: "Graciliano Ramos",
      cover: "https://via.placeholder.com/200x300?text=Vidas+Secas",
      likes: 198,
      genre: "Romance",
    },
  ];

  // Recent posts data
  const recentPosts = [
    {
      id: "1",
      slug: "literatura-brasileira-classica",
      title: "Literatura Brasileira Clássica",
      excerpt: "Explore os grandes clássicos da literatura brasileira...",
      date: "2025-01-08",
      author: "Admin",
    },
    {
      id: "2",
      slug: "traducao-automatica-desafios",
      title: "Tradução Automática: Desafios e Oportunidades",
      excerpt: "Como a tradução automática está transformando a publicação...",
      date: "2025-01-07",
      author: "Admin",
    },
    {
      id: "3",
      slug: "dicas-leitura-2025",
      title: "Dicas de Leitura para 2025",
      excerpt: "Descubra os melhores livros para ler este ano...",
      date: "2025-01-06",
      author: "Admin",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                  Descubra Histórias Incríveis
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Acesse uma biblioteca completa de livros digitais em múltiplos idiomas. Leia, compartilhe e explore o mundo através da literatura.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                  Ver Livros
                </Button>
                {!isAuthenticated && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => (window.location.href = getLoginUrl())}
                  >
                    Entrar
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Livros</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Leitores</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Idiomas</div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden lg:block">
              <div className="relative h-96 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-2xl overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-40 h-40 text-white/30" />
                </div>
                <div className="absolute top-8 right-8 w-24 h-32 bg-white/20 rounded-lg backdrop-blur-sm"></div>
                <div className="absolute bottom-8 left-8 w-32 h-24 bg-white/20 rounded-lg backdrop-blur-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Destaques</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Conheça os livros mais populares da nossa plataforma
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <Card
                key={book.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg h-64 bg-slate-200 dark:bg-slate-800">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-white dark:bg-slate-900 rounded-full p-2 shadow-lg group-hover:scale-110 transition-transform">
                      <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
                    </div>
                  </div>
                </CardContent>
                <CardHeader>
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <CardDescription>{book.author}</CardDescription>
                </CardHeader>
                <CardContent>
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
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Últimos Posts</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Leia artigos e notícias sobre literatura e leitura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <Card
                key={post.id}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">{post.excerpt}</p>
                  <Button variant="link" className="p-0">
                    Ler mais →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Fique por Dentro</h2>
          <p className="text-lg text-blue-100 mb-8">
            Receba notícias sobre novos livros e artigos direto no seu email
          </p>

          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            />
            <Button type="submit" className="bg-white text-blue-600 hover:bg-blue-50">
              Inscrever
            </Button>
          </form>

          {subscribed && (
            <p className="text-white mt-4 text-sm">✓ Obrigado por se inscrever!</p>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Por Que Escolher Abbleitura?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Biblioteca Completa",
                description: "Acesso a centenas de livros em múltiplos idiomas",
              },
              {
                icon: Zap,
                title: "Downloads Rápidos",
                description: "Baixe seus livros favoritos em segundos",
              },
              {
                icon: Users,
                title: "Comunidade Ativa",
                description: "Comente, compartilhe e conecte-se com outros leitores",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Pronto para Começar?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Junte-se a milhares de leitores que já descobriram suas histórias favoritas
          </p>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            onClick={() => (window.location.href = getLoginUrl())}
          >
            Comece Agora
          </Button>
        </div>
      </section>
    </div>
  );
}
