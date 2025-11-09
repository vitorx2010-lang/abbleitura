# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar dependências
RUN pnpm install --frozen-lockfile

# Copiar código
COPY . .

# Build da aplicação
RUN pnpm build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar package files
COPY package.json pnpm-lock.yaml ./

# Instalar apenas dependências de produção
RUN pnpm install --frozen-lockfile --prod

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

USER nodejs

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicialização
CMD ["pnpm", "start"]
