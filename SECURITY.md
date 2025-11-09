# Security Policy - Abbleitura

## Relatório de Vulnerabilidades

Se você descobrir uma vulnerabilidade de segurança, **não abra uma issue pública**. Em vez disso:

1. **Envie um email para:** security@abbleitura.com
2. **Inclua:**
   - Descrição detalhada da vulnerabilidade
   - Passos para reproduzir
   - Impacto potencial
   - Sua sugestão de correção (se houver)

3. **Prazo:** Você receberá uma resposta em até 48 horas

## Versões Suportadas

| Versão | Status | Suporte |
|--------|--------|---------|
| 1.x | Atual | ✅ Suportado |
| 0.x | Legado | ⚠️ Suporte limitado |

## Práticas de Segurança

### 1. Autenticação

- ✅ Senhas hasheadas com bcrypt (10+ rounds)
- ✅ JWT com expiração (15 minutos)
- ✅ Refresh tokens armazenados com hash
- ✅ httpOnly cookies (não acessível via JavaScript)
- ✅ CSRF protection em todos os endpoints

### 2. Autorização

- ✅ Role-based access control (admin/user)
- ✅ Validação de permissões em cada endpoint
- ✅ Audit logs para ações sensíveis

### 3. Comunicação

- ✅ HTTPS obrigatório em produção
- ✅ TLS 1.2+ apenas
- ✅ HSTS header (max-age=63072000)
- ✅ Certificate pinning (recomendado)

### 4. Dados

- ✅ Criptografia em repouso (S3 encryption)
- ✅ Criptografia em trânsito (TLS)
- ✅ Backup criptografado
- ✅ Retenção de dados conforme LGPD/GDPR

### 5. API

- ✅ Rate limiting (100 req/min por IP)
- ✅ Input validation e sanitização
- ✅ Output encoding
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS prevention (React + CSP)

### 6. Headers de Segurança

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self' https:; ...
Referrer-Policy: no-referrer-when-downgrade
Permissions-Policy: geolocation=(), microphone=()
```

### 7. Dependências

- ✅ Auditoria regular com `npm audit`
- ✅ Atualizações de segurança automáticas
- ✅ Dependências mínimas (sem bloat)
- ✅ Verificação de integridade (lock file)

### 8. Logging & Monitoramento

- ✅ Logs de autenticação
- ✅ Logs de ações administrativas
- ✅ Alertas de atividade suspeita
- ✅ Monitoramento de performance
- ✅ Integração com Sentry

## Checklist de Segurança

### Desenvolvimento

- [ ] Usar `.env.local` (nunca committar `.env`)
- [ ] Validar todas as entradas do usuário
- [ ] Usar prepared statements (Drizzle ORM)
- [ ] Escapar output HTML
- [ ] Testar com OWASP ZAP
- [ ] Revisar código (code review)
- [ ] Usar secrets management

### Deployment

- [ ] Certificado SSL válido
- [ ] HTTPS forçado (redirect 80 → 443)
- [ ] Headers de segurança configurados
- [ ] Rate limiting ativo
- [ ] Firewall configurado
- [ ] Backup automático
- [ ] Monitoramento ativo
- [ ] Logs centralizados

### Operacional

- [ ] Senhas fortes (mínimo 12 caracteres)
- [ ] 2FA para admin
- [ ] Acesso SSH restrito
- [ ] Sudo sem senha desabilitado
- [ ] Fail2ban configurado
- [ ] Rotação de chaves (API keys, secrets)
- [ ] Testes de penetração regulares

## Conformidade

### LGPD (Lei Geral de Proteção de Dados)

- ✅ Consentimento explícito para coleta de dados
- ✅ Direito de acesso aos dados pessoais
- ✅ Direito de exclusão ("direito ao esquecimento")
- ✅ Portabilidade de dados
- ✅ Notificação de breach em 72h
- ✅ Data Protection Officer (DPO) designado

### GDPR (General Data Protection Regulation)

- ✅ Consentimento para cookies
- ✅ Privacy Policy clara
- ✅ Data Processing Agreement (DPA)
- ✅ Direito de retificação
- ✅ Direito de restrição
- ✅ Direito de objeção

## Endpoints Sensíveis

### Requer Autenticação

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/users/me
PUT    /api/users/me
DELETE /api/users/me
POST   /api/downloads/presigned
GET    /api/comments
POST   /api/comments
```

### Requer Admin

```
POST   /api/admin/books
PUT    /api/admin/books/:id
DELETE /api/admin/books/:id
POST   /api/admin/posts
PUT    /api/admin/posts/:id
DELETE /api/admin/posts/:id
GET    /api/admin/comments/pending
PUT    /api/admin/comments/:id/approve
PUT    /api/admin/comments/:id/reject
GET    /api/admin/translations/review
PUT    /api/admin/translations/:id/approve
GET    /api/admin/settings
PUT    /api/admin/settings
```

## Rate Limiting

| Endpoint | Limite | Janela |
|----------|--------|--------|
| `/api/auth/login` | 5 | 5 min |
| `/api/auth/register` | 3 | 1 hora |
| `/api/downloads/presigned` | 10 | 1 dia |
| `/api/*` | 100 | 1 min |

## Criptografia

### Senhas

```typescript
// Usar bcrypt com 10+ rounds
const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Tokens JWT

```typescript
// Usar HS256 ou RS256
const token = jwt.sign(
  { userId, role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);
```

### Dados Sensíveis

```typescript
// Criptografar dados sensíveis em repouso
const encrypted = crypto.encrypt(sensitiveData, encryptionKey);
const decrypted = crypto.decrypt(encrypted, encryptionKey);
```

## Testes de Segurança

### OWASP Top 10

1. ✅ **Injection** - Prevenido com ORM
2. ✅ **Broken Authentication** - JWT + bcrypt
3. ✅ **Sensitive Data Exposure** - TLS + encryption
4. ✅ **XML External Entities** - Não usa XML
5. ✅ **Broken Access Control** - RBAC implementado
6. ✅ **Security Misconfiguration** - Headers configurados
7. ✅ **XSS** - React + CSP
8. ✅ **Insecure Deserialization** - Validação de entrada
9. ✅ **Using Components with Known Vulnerabilities** - npm audit
10. ✅ **Insufficient Logging & Monitoring** - Sentry + Prometheus

### Ferramentas

```bash
# Auditoria de dependências
npm audit

# Teste de segurança (OWASP ZAP)
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# Teste de SSL
nmap --script ssl-enum-ciphers -p 443 seu-dominio.com

# Teste de headers
curl -I https://seu-dominio.com
```

## Incidente de Segurança

Se você descobrir que o sistema foi comprometido:

1. **Isole o sistema** - Desconecte da internet se possível
2. **Preserve evidências** - Não delete logs
3. **Notifique o time** - security@abbleitura.com
4. **Inicie investigação** - Revise logs de acesso
5. **Notifique usuários** - Se dados foram expostos
6. **Corrija a vulnerabilidade** - Patch e redeploy
7. **Revise o incidente** - Post-mortem

## Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [LGPD](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)
- [GDPR](https://gdpr-info.eu/)

## Contato

- **Email:** security@abbleitura.com
- **PGP Key:** (disponível em request)
- **Resposta esperada:** 48 horas

---

**Última atualização:** 2025-01-09

**Versão:** 1.0.0
