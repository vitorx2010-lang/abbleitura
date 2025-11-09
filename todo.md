# Projeto TODO - Abbleitura

## Funcionalidades Principais

### GitHub & Repositório
- [x] Criar repositório público no GitHub com nome `abbleitura`
- [ ] Fazer push de todo o código para o repositório (em progresso)
- [ ] Configurar branches (dev, staging, main)
- [ ] Configurar protection rules no GitHub
- [ ] Configurar Husky + commitlint

### Home Page
- [x] Hero section com imagem full bleed, nome do autor, tagline e CTAs
- [x] Seção Destaques com slider de livros
- [x] Seção Últimos posts
- [x] Newsletter opt-in
- [x] Microinterações (ProductCard hover lift, heart animation)

### Header & Footer
- [ ] Header com logo, navegação, seletor de idioma, theme toggle, login, cart/favorites
- [ ] Header shrink on scroll
- [ ] Footer com links, social, newsletter, copyright

### Catálogo de Livros
- [x] Página de listagem de livros com paginação (12 por página)
- [x] Filtros por gênero, ano, idioma
- [x] Busca fuzzy
- [x] Página individual de livro com galeria, metadados, botões de compra/download
- [ ] JSON-LD Book schema
- [x] Modal de login para download não autenticado

### Autenticação & Perfil de Usuário
- [ ] Registro (nome, email, senha)
- [ ] Verificação de email
- [ ] Login com httpOnly cookies
- [ ] Página de perfil com favoritos, histórico de downloads, preferências
- [ ] API routes: auth/register, auth/login, auth/refresh, auth/forgot, auth/reset, users/me

### Painel Admin
- [x] Login admin (seed com credenciais)
- [x] Dashboard com KPIs
- [x] CRUD de livros com upload de arquivos
- [x] CRUD de posts de blog
- [x] Moderação de comentários
- [ ] Gerenciamento de traduções (auto + manual)
- [ ] Conteúdo do site (hero slides, footer, promoções)
- [ ] Configurações (cores, tema padrão, idiomas habilitados, chaves de tradução)

### Blog & Comentários
- [ ] Listagem de posts do blog
- [ ] Página individual de post
- [ ] Tags e busca
- [ ] Sistema de comentários com autenticação
- [ ] Detecção de idioma e tradução automática de comentários
- [ ] Moderação de comentários
- [ ] Respostas (profundidade 2)
- [ ] Botão de denúncia
- [ ] Verificação anti-spam

### Traduções & i18n
- [ ] Configuração i18n do Next.js (pt-BR, en, es, fr, zh)
- [ ] Roteamento multilíngue (/pt-BR/, /en/, etc.)
- [ ] Integração com API de tradução (DeepL/Google)
- [ ] UI de admin para revisão/edição de traduções
- [ ] Cache de traduções em banco de dados
- [ ] Glossário para preservar termos
- [ ] Badge (original) para conteúdo não traduzido

### Downloads & Segurança
- [ ] Presigned S3 URLs (expiram em 5 minutos)
- [ ] Validação de direitos de acesso
- [ ] Log de downloads (usuário, IP, UA)
- [ ] Limite de downloads/dia por usuário (padrão 10)
- [ ] Rate limiting
- [ ] CSRF protection
- [ ] CSP headers

### Sistema de Curtidas & Favoritos
- [ ] Like button (idempotente, qualquer usuário)
- [ ] Favoritos (apenas autenticado)
- [ ] Animação SVG fill para coração

### Testes
- [ ] npm run test:smoke (testes rápidos)
- [ ] npm run test:full (suite completa)
- [ ] Playwright E2E tests
- [ ] Jest + React Testing Library unit tests
- [ ] Link checker script
- [ ] SSL checker script
- [ ] Accessibility tests (axe)
- [ ] Performance tests (Lighthouse CI)

### CI/CD & DevOps
- [ ] .github/workflows/ci.yml com lint, testes, build, E2E
- [ ] docker-compose.dev.yml (frontend, mongo, redis, minio, maildev)
- [ ] Dockerfile para produção (multi-stage)
- [ ] Instruções de deploy para Vercel
- [ ] Nginx config exemplo (reverse proxy + caching)

### Documentação
- [ ] README.md completo
- [ ] .env.example com todas as variáveis
- [ ] docs/translation_workflow.md
- [ ] docs/deploy_guide.md
- [ ] SECURITY.md
- [ ] CONTRIBUTING.md
- [ ] docs/runbook.md
- [ ] openapi.yaml com endpoints

### Scripts & Utilitários
- [ ] scripts/seed.test.js (fixture data + admin seed)
- [ ] scripts/create_repo.sh (para criar repo no GitHub)
- [ ] scripts/link-check-and-ssl.sh
- [ ] scripts/create_presigned_test.js
- [ ] Husky + commitlint para Conventional Commits

### Relatórios & Testes
- [ ] reports/FINAL_DELIVERY_REPORT.md
- [ ] reports/smoke_<ts>/ (artifacts de smoke tests)
- [ ] reports/full_<ts>/ (screenshots, HAR, logs, accessibility, translation flags)
- [ ] reports/link-audit-<ts>.zip

## Bugs & Problemas Conhecidos

### Pendente de Implementação
- [ ] Criar repositório GitHub
- [ ] Fazer push do código
- [ ] Implementar funcionalidades principais
- [ ] Executar testes
- [ ] Gerar relatório final

## Notas

- Credenciais Admin: Email: `admin@abbleitura.com`, Senha: `Abbleitura@2025!`
- Instruir usuário a trocar a senha no primeiro login
- Stack: React 19 + Tailwind 4 + Express 4 + tRPC 11 + Drizzle ORM + MySQL
- Autenticação: Manus OAuth integrado
- Storage: S3 (produção), MinIO (dev)
- Banco de dados: MongoDB Atlas (recomendado), fallback JSON/lowdb para sandbox
