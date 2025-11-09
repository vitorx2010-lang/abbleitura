# Deployment Guide - Abbleitura

## Opções de Deployment

O Abbleitura pode ser deployado em várias plataformas:

1. **Vercel** (Recomendado) - Serverless, fácil, gratuito até certo ponto
2. **AWS** - Escalável, completo, mais complexo
3. **DigitalOcean** - Simples, acessível
4. **VPS com Nginx** - Total controle, mais trabalho

## 1. Vercel (Recomendado)

### Pré-requisitos

- Conta no Vercel (https://vercel.com)
- Repositório no GitHub
- Variáveis de ambiente configuradas

### Passo 1: Conectar Repositório

1. Acesse https://vercel.com/dashboard
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Selecione o repositório `abbleitura`
5. Clique em "Import"

### Passo 2: Configurar Variáveis de Ambiente

No Vercel Dashboard:

1. Vá para "Settings" → "Environment Variables"
2. Adicione as seguintes variáveis:

```
DATABASE_URL=mysql://user:password@host:3306/abbleitura
JWT_SECRET=seu_jwt_secret_seguro_aqui
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
AWS_ACCESS_KEY_ID=sua_chave_aws
AWS_SECRET_ACCESS_KEY=sua_chave_secreta_aws
S3_BUCKET=seu_bucket_s3
DEEP_L_API_KEY=sua_chave_deepl
SENDGRID_API_KEY=sua_chave_sendgrid
REDIS_URL=redis://seu_redis_host:6379
```

### Passo 3: Deploy

1. Clique em "Deploy"
2. Aguarde o build completar
3. Acesse a URL gerada (ex: https://abbleitura.vercel.app)

### Passo 4: Configurar Domínio Customizado (Opcional)

1. Vá para "Settings" → "Domains"
2. Clique em "Add Domain"
3. Digite seu domínio (ex: abbleitura.com)
4. Configure os registros DNS conforme instruído

### Atualizações Automáticas

Toda vez que você fazer push para `main`:

```bash
git push origin main
```

Vercel automaticamente:
1. Detecta o push
2. Executa build
3. Roda testes
4. Faz deploy

## 2. AWS (EC2 + RDS + S3)

### Arquitetura

```
┌─────────────────────────────────────────┐
│         CloudFront (CDN)                │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│      Application Load Balancer          │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┼────────────────┐
    │            │                │
┌───▼──┐    ┌───▼──┐         ┌───▼──┐
│ EC2  │    │ EC2  │         │ EC2  │
│ App  │    │ App  │         │ App  │
└──────┘    └──────┘         └──────┘
    │            │                │
    └────────────┼────────────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼────┐    ┌─────▼────┐
    │ RDS DB  │    │ ElastiCache
    │ (MySQL) │    │ (Redis)
    └─────────┘    └──────────┘
         │
    ┌────▼────┐
    │ S3      │
    │ Bucket  │
    └─────────┘
```

### Passo 1: Criar Instância EC2

```bash
# 1. Acesse AWS Console
# 2. EC2 → Instances → Launch Instance
# 3. Selecione Ubuntu 22.04 LTS
# 4. Tipo: t3.medium (ou maior)
# 5. Configure security group:
#    - Port 80 (HTTP)
#    - Port 443 (HTTPS)
#    - Port 22 (SSH)
# 6. Crie key pair e salve (.pem)
```

### Passo 2: Conectar e Instalar Dependências

```bash
# Conectar via SSH
ssh -i seu-key.pem ubuntu@seu-ip-ec2

# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar pnpm
npm install -g pnpm

# Instalar Nginx
sudo apt install -y nginx

# Instalar Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx

# Instalar Git
sudo apt install -y git
```

### Passo 3: Clonar e Configurar Aplicação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/abbleitura.git
cd abbleitura

# Instalar dependências
pnpm install

# Criar .env.production
cp .env.example .env.production
# Edite .env.production com suas credenciais

# Build
pnpm build
```

### Passo 4: Configurar Nginx

```bash
# Criar arquivo de configuração
sudo nano /etc/nginx/sites-available/abbleitura
```

Adicione:

```nginx
upstream app {
    server localhost:3000;
}

server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://app;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Habilite:

```bash
sudo ln -s /etc/nginx/sites-available/abbleitura /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Passo 5: Configurar SSL com Certbot

```bash
sudo certbot --nginx -d seu-dominio.com
```

### Passo 6: Configurar PM2 para Manter App Rodando

```bash
# Instalar PM2
sudo npm install -g pm2

# Criar arquivo ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'abbleitura',
    script: 'pnpm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
EOF

# Iniciar com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Passo 7: Configurar RDS (Banco de Dados)

```bash
# 1. AWS Console → RDS → Create Database
# 2. Engine: MySQL 8.0
# 3. Instance: db.t3.micro (ou maior)
# 4. Storage: 20GB
# 5. Multi-AZ: Sim (para produção)
# 6. Backup retention: 7 dias
# 7. Salve credenciais

# 8. Atualizar .env.production
DATABASE_URL=mysql://user:password@seu-rds-endpoint:3306/abbleitura

# 9. Executar migrações
pnpm db:push
```

### Passo 8: Configurar S3

```bash
# 1. AWS Console → S3 → Create Bucket
# 2. Nome: abbleitura-files
# 3. Region: sa-east-1
# 4. Desabilitar "Block all public access"
# 5. Criar access key e secret key
# 6. Atualizar .env.production
AWS_ACCESS_KEY_ID=sua_chave
AWS_SECRET_ACCESS_KEY=sua_chave_secreta
S3_BUCKET=abbleitura-files
```

## 3. DigitalOcean App Platform

### Passo 1: Conectar Repositório

1. Acesse https://cloud.digitalocean.com
2. Clique em "Create" → "Apps"
3. Selecione seu repositório GitHub
4. Selecione branch `main`

### Passo 2: Configurar Aplicação

1. Selecione "Node.js" como runtime
2. Configure variáveis de ambiente
3. Configure banco de dados (Managed MySQL)
4. Configure storage (Spaces)

### Passo 3: Deploy

Clique em "Deploy" e aguarde.

## 4. VPS com Nginx (Controle Total)

### Pré-requisitos

- VPS com Ubuntu 22.04
- Domínio próprio
- Acesso SSH

### Instalação Completa

```bash
# 1. Conectar via SSH
ssh root@seu-vps-ip

# 2. Criar usuário não-root
adduser abbleitura
usermod -aG sudo abbleitura
su - abbleitura

# 3. Instalar dependências (conforme AWS acima)

# 4. Clonar aplicação
git clone https://github.com/seu-usuario/abbleitura.git
cd abbleitura

# 5. Instalar e build
pnpm install
pnpm build

# 6. Configurar Nginx (conforme AWS acima)

# 7. Configurar SSL (conforme AWS acima)

# 8. Iniciar aplicação com PM2 (conforme AWS acima)

# 9. Configurar backup automático
crontab -e
# Adicione:
# 0 2 * * * mysqldump -u user -p password abbleitura > /backups/db-$(date +\%Y\%m\%d).sql
```

## Monitoramento em Produção

### 1. Configurar Sentry (Error Tracking)

```bash
# 1. Criar conta em https://sentry.io
# 2. Criar projeto
# 3. Adicionar SENTRY_DSN ao .env.production
```

### 2. Configurar Prometheus (Métricas)

```bash
# Instalar Prometheus
sudo apt install -y prometheus

# Configurar prometheus.yml
sudo nano /etc/prometheus/prometheus.yml
```

### 3. Configurar Grafana (Visualização)

```bash
# Instalar Grafana
sudo apt install -y grafana-server
sudo systemctl start grafana-server

# Acessar em http://seu-vps:3000
# Usuário: admin
# Senha: admin
```

## Checklist de Pré-Produção

- [ ] Variáveis de ambiente configuradas
- [ ] Banco de dados migrado
- [ ] S3 bucket criado e testado
- [ ] Email service configurado
- [ ] SSL certificate válido
- [ ] Backup automático configurado
- [ ] Monitoramento ativo (Sentry, Prometheus)
- [ ] Testes E2E passando
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Segurança validada (OWASP)
- [ ] Plano de disaster recovery

## Troubleshooting

### Aplicação não inicia

```bash
# Verificar logs
pm2 logs abbleitura

# Verificar porta 3000
lsof -i :3000

# Verificar variáveis de ambiente
env | grep DATABASE_URL
```

### Banco de dados não conecta

```bash
# Testar conexão
mysql -h seu-rds-endpoint -u user -p

# Verificar security group
# Porta 3306 deve estar aberta
```

### SSL não funciona

```bash
# Renovar certificado
sudo certbot renew

# Verificar certificado
openssl x509 -in /etc/letsencrypt/live/seu-dominio/cert.pem -text -noout
```

## Referências

- [Vercel Docs](https://vercel.com/docs)
- [AWS EC2 Docs](https://docs.aws.amazon.com/ec2/)
- [DigitalOcean Docs](https://docs.digitalocean.com/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Certbot Docs](https://certbot.eff.org/docs/)
