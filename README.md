# Abbleitura - Platform de Livros e Leitura

Um projeto full-stack moderno construído com **React 19 + Tailwind 4 + Express 4 + tRPC 11 + Drizzle ORM** para criar uma plataforma de distribuição de livros digitais com suporte multilíngue, painel administrativo, sistema de comentários, tradução automática e downloads com presigned URLs do S3.

## 🎯 Objetivo

Abbleitura é uma plataforma completa que permite a autores publicar seus livros digitais, gerenciar conteúdo, moderar comentários, traduzir automaticamente para múltiplos idiomas, e oferecer downloads seguros através de presigned URLs do S3.

## ✨ Funcionalidades Principais

### Para Leitores
- **Catálogo multilíngue** de livros com filtros por gênero, ano e idioma
- **Busca fuzzy** para encontrar livros rapidamente
- **Página individual de livro** com galeria de imagens, metadados e JSON-LD schema
- **Sistema de favoritos e curtidas** (idempotente)
- **Downloads seguros** com presigned URLs que expiram em 5 minutos
- **Blog multilíngue** com comentários traduzíveis
- **Perfil de usuário** com histórico de downloads e preferências
- **Dark mode elegante** com toggle persistente
- **Suporte a 5+ idiomas** (pt-BR, en, es, fr, zh)

### Para Administradores
- **Dashboard com KPIs** (total de livros, downloads, comentários)
- **CRUD completo de livros** com upload de arquivos
- **CRUD de posts de blog** com suporte a tags
- **Moderação de comentários** com fila de revisão
- **Gerenciamento de traduções** (automático + revisão manual)
- **Configuração do site** (hero slides, footer, promoções, cores, tema padrão)
- **Glossário de termos** para preservar consistência nas traduções
- **Logs de auditoria** para deletions e mudanças de preço/metadados

## 🔐 Credenciais de Administrador

**IMPORTANTE:** Altere a senha imediatamente após o primeiro login.

```
Email: admin@abbleitura.com
Senha: Abbleitura@2025!
```

## 🛠️ Stack Técnico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + TypeScript + Tailwind CSS 4 |
| **Backend** | Express 4 + Node.js |
| **API** | tRPC 11 (type-safe RPC) |
| **Banco de Dados** | MySQL (produção) / SQLite (desenvolvimento) |
| **ORM** | Drizzle ORM |
| **Autenticação** | Manus OAuth + JWT |
| **Storage** | AWS S3 (produção) / MinIO (desenvolvimento) |
| **Email** | SendGrid / Mailgun |
| **Tradução** | DeepL / Google Translate API |
| **Cache** | Redis |
| **Testes** | Playwright (E2E) + Jest (unit) |
| **CI/CD** | GitHub Actions |
| **Containerização** | Docker + docker-compose |

## 🚀 Getting Started

### Pré-requisitos

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose (para desenvolvimento local)
- Git

### Instalação Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/vitorx2010-lang/abbleitura.git
   cd abbleitura
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env.local
   # Edite .env.local com suas credenciais
   ```

4. **Inicie o banco de dados e serviços (Docker):**
   ```bash
   docker-compose -f infra/docker-compose.dev.yml up --build
   ```

5. **Execute as migrações do banco de dados:**
   ```bash
   pnpm db:push
   ```

6. **Popule dados de teste (seed):**
   ```bash
   pnpm seed:test
   ```

7. **Inicie o servidor de desenvolvimento:**
   ```bash
   pnpm dev
   ```

   O site estará disponível em `http://localhost:3000`

## 📝 Comandos Disponíveis

```bash
# Desenvolvimento
pnpm dev                 # Inicia servidor de desenvolvimento
pnpm build              # Build para produção
pnpm start              # Inicia servidor de produção

# Banco de Dados
pnpm db:push            # Aplica migrações
pnpm db:studio          # Abre Drizzle Studio (UI do banco)
pnpm seed:test          # Popula dados de teste

# Testes
pnpm test:smoke         # Testes rápidos (smoke tests)
pnpm test:full          # Suite completa de testes
pnpm test:e2e           # Testes E2E com Playwright
pnpm test:unit          # Testes unitários com Jest

# Linting & Formatting
pnpm lint               # Executa ESLint
pnpm format             # Formata com Prettier

# Utilitários
pnpm link-check         # Verifica links quebrados
pnpm ssl-check          # Valida certificado SSL
```

## 📁 Estrutura do Projeto

```
abbleitura/
├── client/                    # Frontend React
│   ├── src/
│   │   ├── pages/            # Componentes de página
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── hooks/            # Custom React hooks
│   │   ├── contexts/         # React contexts
│   │   ├── lib/              # Utilitários e helpers
│   │   ├── App.tsx           # Roteamento principal
│   │   └── index.css         # Estilos globais
│   └── public/               # Assets estáticos
├── server/                    # Backend Express
│   ├── routers.ts            # tRPC procedures
│   ├── db.ts                 # Query helpers
│   └── _core/                # Framework plumbing
├── drizzle/                  # Schema e migrações
│   └── schema.ts             # Definição de tabelas
├── infra/
│   ├── docker-compose.dev.yml
│   └── nginx/                # Configuração Nginx
├── scripts/
│   ├── seed.test.js          # Seed de dados
│   ├── create_repo.sh        # Criar repo GitHub
│   └── link-check-and-ssl.sh # Validação de links
├── tests/
│   ├── e2e/                  # Testes E2E (Playwright)
│   └── unit/                 # Testes unitários (Jest)
├── docs/
│   ├── translation_workflow.md
│   ├── deploy_guide.md
│   └── runbook.md
├── .github/workflows/
│   └── ci.yml                # GitHub Actions CI/CD
├── README.md                 # Este arquivo
├── .env.example              # Variáveis de ambiente
└── todo.md                   # Rastreamento de funcionalidades
```

## 🔑 Variáveis de Ambiente

Veja `.env.example` para a lista completa. As principais são:

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | String de conexão MySQL |
| `JWT_SECRET` | Chave secreta para JWT (mude em produção!) |
| `NEXT_PUBLIC_SITE_URL` | URL pública do site |
| `AWS_ACCESS_KEY_ID` | Credenciais AWS para S3 |
| `AWS_SECRET_ACCESS_KEY` | Credenciais AWS para S3 |
| `S3_BUCKET` | Nome do bucket S3 |
| `DEEP_L_API_KEY` | Chave API DeepL para tradução |
| `SENDGRID_API_KEY` | Chave API SendGrid para email |
| `REDIS_URL` | URL de conexão Redis |

## 🧪 Testes

### Smoke Tests (Rápidos)
```bash
pnpm test:smoke
```

Verifica:
- Página inicial carrega (status 200)
- LCP image carregada
- Title e meta description presentes
- Links internos válidos
- Certificado SSL válido

### Full Test Suite
```bash
pnpm test:full
```

Inclui:
- Testes E2E com Playwright (3 runs)
- Testes unitários com Jest
- Testes de acessibilidade (axe-core)
- Testes de performance (Lighthouse CI)
- Validação de links
- Verificação de tradução

Os resultados são salvos em `reports/` com screenshots, HAR files e logs.

## 🌐 Suporte Multilíngue

O projeto suporta os seguintes idiomas por padrão:

- 🇧🇷 Português (Brasil) - pt-BR
- 🇺🇸 English - en
- 🇪🇸 Español - es
- 🇫🇷 Français - fr
- 🇨🇳 中文 - zh

### Adicionando um novo idioma

1. Edite `ENABLED_LOCALES` em `.env.local`
2. Configure a integração com DeepL/Google Translate
3. Execute `pnpm seed:test` para popular dados de teste
4. Acesse `/admin` → Settings → Translations para revisar

## 📥 Sistema de Downloads

O sistema de downloads utiliza **presigned URLs do S3** que expiram em 5 minutos:

1. Usuário clica em "Baixar"
2. Backend valida direitos de acesso
3. S3 gera presigned URL (5 min de validade)
4. Download é registrado (usuário, IP, user-agent)
5. Limite de 10 downloads/dia por usuário (configurável)

### Fluxo de Segurança

- Rate limiting por IP e por usuário
- Validação de JWT em cada requisição
- Log de auditoria de todos os downloads
- URLs expiram automaticamente

## 🔒 Segurança

### Headers de Segurança

O projeto implementa headers de segurança recomendados:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self' https:; ...
Referrer-Policy: no-referrer-when-downgrade
Permissions-Policy: geolocation=(), microphone=()
```

### Proteção CSRF

Todos os endpoints que modificam dados incluem proteção CSRF via tokens.

### Rate Limiting

- Login: 5 tentativas/5 minutos
- API geral: 100 requisições/minuto
- Downloads: 10/dia por usuário

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Conecte o repositório no Vercel
3. Configure variáveis de ambiente
4. Deploy automático em cada push para `main`

```bash
# Instruções no Vercel Dashboard
1. New Project
2. Import Git Repository
3. Configure Environment Variables
4. Deploy
```

### VPS com Nginx + SSL

Veja `docs/deploy_guide.md` para instruções detalhadas.

```bash
# Build
pnpm build

# Docker
docker build -f Dockerfile -t abbleitura:latest .
docker run -p 3000:3000 abbleitura:latest
```

## 📊 Monitoramento & Logs

O projeto integra-se com:

- **Sentry** para error tracking
- **Prometheus** para métricas
- **Grafana** para visualização
- **ELK Stack** ou **Datadog** para logs centralizados

## 🤝 Contribuindo

Veja `CONTRIBUTING.md` para diretrizes de contribuição.

### Commit Messages

Utilizamos **Conventional Commits**:

```
feat: adicionar novo recurso
fix: corrigir bug
docs: atualizar documentação
test: adicionar testes
refactor: refatorar código
```

Configurado com Husky + commitlint.

## 📚 Documentação Adicional

- **[Translation Workflow](docs/translation_workflow.md)** - Como funciona a tradução automática
- **[Deploy Guide](docs/deploy_guide.md)** - Instruções de deployment
- **[Runbook](docs/runbook.md)** - Operações comuns (backup, restore, migrações)
- **[API Specification](openapi.yaml)** - Endpoints da API
- **[Security Policy](SECURITY.md)** - Política de segurança e vulnerabilidades

## 📋 Checklist de Pré-Produção

Antes de fazer deploy para produção:

- [ ] Alterar `JWT_SECRET` para um valor seguro
- [ ] Configurar variáveis de ambiente (S3, email, tradução)
- [ ] Executar `pnpm test:full` com sucesso
- [ ] Revisar logs de segurança
- [ ] Configurar backups automáticos do banco de dados
- [ ] Testar fluxo de recuperação de senha
- [ ] Validar certificado SSL
- [ ] Configurar monitoramento (Sentry, Prometheus)
- [ ] Documentar credenciais em local seguro

## 🐛 Reportando Bugs

Abra uma issue no GitHub com:

1. Descrição clara do problema
2. Passos para reproduzir
3. Comportamento esperado vs. atual
4. Screenshots/logs se aplicável
5. Ambiente (navegador, SO, versão)

## 📞 Suporte

Para dúvidas ou sugestões:

1. Abra uma issue no GitHub
2. Consulte a documentação em `docs/`
3. Verifique `SECURITY.md` para vulnerabilidades

## 📄 Licença

Este projeto é fornecido como está. Veja LICENSE para detalhes.

## 👨‍💼 Autor

**Abbleitura** foi criado para facilitar a publicação e distribuição de livros digitais com suporte multilíngue completo.

---

**Última atualização:** 2025-01-09

**Versão:** 1.0.0

**Status:** Em desenvolvimento ativo
