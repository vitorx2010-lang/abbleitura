# Translation Workflow - Abbleitura

## Visão Geral

O Abbleitura implementa um sistema de tradução automático e manual que permite:

1. **Tradução automática** de conteúdo para múltiplos idiomas via DeepL/Google Translate
2. **Revisão manual** de traduções por administradores
3. **Cache de traduções** para reduzir custos e melhorar performance
4. **Glossário de termos** para manter consistência
5. **Detecção de confiança** para identificar traduções que precisam revisão

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Conteúdo Original                        │
│              (Livro, Post, Comentário)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Enqueue Translation Job   │
        │  (para cada idioma)        │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Background Worker         │
        │  (BullMQ/Redis)            │
        └────────────┬───────────────┘
                     │
         ┌───────────┼───────────────┐
         │           │               │
         ▼           ▼               ▼
      DeepL      Google         Glossário
      Translate  Translate      (Termos)
         │           │               │
         └───────────┼───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Salvar Tradução no DB     │
        │  + Confidence Score        │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Verificar Confiança       │
        │  (< 0.65 = Revisão)        │
        └────────────┬───────────────┘
                     │
         ┌───────────┴───────────────┐
         │                           │
    Confiança OK              Precisa Revisão
         │                           │
         ▼                           ▼
    Publicar              Notificar Admin
    Tradução              (Fila de Revisão)
         │                           │
         └───────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Admin Review UI           │
        │  (Editar/Aprovar)          │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Publicar Tradução         │
        │  (Disponível para Leitores)│
        └────────────────────────────┘
```

## Fluxo Detalhado

### 1. Criação de Conteúdo

Quando um administrador cria um novo livro, post ou comentário:

```typescript
// Exemplo: Criar novo livro
POST /api/admin/books
{
  "title": { "pt-BR": "O Cortiço" },
  "synopsis": { "pt-BR": "Romance naturalista..." },
  "languages": ["pt-BR", "en", "es", "fr", "zh"]
}
```

### 2. Enfileiramento de Tradução

O sistema automaticamente enfileira trabalhos de tradução para cada idioma habilitado:

```typescript
// Para cada idioma diferente do original:
await translationQueue.add('translate-book', {
  contentId: bookId,
  contentType: 'book',
  sourceLocale: 'pt-BR',
  targetLocale: 'en',
  text: bookTitle,
  provider: 'deepl', // ou 'google'
})
```

### 3. Processamento em Background

Um worker processa a fila de tradução:

```typescript
translationQueue.process('translate-book', async (job) => {
  const { contentId, sourceLocale, targetLocale, text, provider } = job.data;

  // 1. Verificar cache
  const cached = await getTranslationFromCache(contentId, targetLocale);
  if (cached) return cached;

  // 2. Aplicar glossário
  const glossaryTerms = await getGlossaryTerms(sourceLocale, targetLocale);

  // 3. Chamar API de tradução
  const result = await translateText(text, sourceLocale, targetLocale, {
    provider,
    glossary: glossaryTerms,
  });

  // 4. Salvar resultado
  await saveTranslation({
    contentId,
    contentType: 'book',
    targetLocale,
    translatedText: result.text,
    providerConfidence: result.confidence,
    provider,
    costEstimate: result.cost,
  });

  // 5. Verificar confiança
  if (result.confidence < 0.65) {
    await flagForManualReview(contentId, targetLocale);
    await notifyAdmin(`Tradução de ${contentId} para ${targetLocale} precisa revisão`);
  }

  // 6. Cache por 24h
  await cacheTranslation(contentId, targetLocale, result.text, 86400);

  return result;
});
```

## Configuração de Provedores

### DeepL

**Vantagens:**
- Melhor qualidade de tradução
- Suporte a glossário
- Mais rápido

**Configuração:**

```bash
# .env
DEEP_L_API_KEY=your_api_key_here
TRANSLATION_PROVIDER=deepl
DEEP_L_PLAN=free # ou 'pro'
```

**Custos:**
- Plano Free: 500.000 caracteres/mês grátis
- Plano Pro: $5.99/mês + $25 por 1M caracteres

### Google Translate

**Vantagens:**
- Suporte a mais idiomas
- Integração com Google Cloud

**Configuração:**

```bash
# .env
GOOGLE_TRANSLATE_API_KEY=your_api_key_here
TRANSLATION_PROVIDER=google
```

**Custos:**
- $15 por 1M caracteres

## Glossário de Termos

O glossário permite manter consistência em termos específicos do domínio:

### Adicionar Termo ao Glossário

```typescript
POST /api/admin/glossary
{
  "sourceTerm": "Abbleitura",
  "targetLocale": "en",
  "translation": "Abbleitura",
  "category": "brand"
}
```

### Estrutura do Glossário

```typescript
interface GlossaryEntry {
  id: string;
  sourceTerm: string;
  sourceLocale: string;
  targetLocale: string;
  translation: string;
  category: 'brand' | 'technical' | 'domain' | 'other';
  createdAt: Date;
  updatedAt: Date;
}
```

## Revisão Manual

### UI de Revisão

O painel admin inclui uma seção de revisão de traduções:

```
/admin/translations/review
├── Filtros
│  ├── Status (pending, approved, rejected)
│  ├── Confidence (< 0.65)
│  └── Idioma alvo
├── Lista de Traduções
│  ├── Texto original
│  ├── Tradução proposta
│  ├── Confidence score
│  ├── Botões: Aprovar / Editar / Rejeitar
└── Editor de Tradução
   ├── Textarea para editar
   └── Botões: Salvar / Cancelar
```

### Fluxo de Aprovação

```typescript
// Admin aprova tradução
PUT /api/admin/translations/:id/approve
{
  "status": "approved",
  "notes": "Tradução corrigida manualmente"
}

// Admin rejeita e pede retradução
PUT /api/admin/translations/:id/reject
{
  "status": "rejected",
  "reason": "Qualidade insuficiente",
  "retranslate": true
}
```

## Cálculo de Custos

### Estimativa de Custo

```typescript
interface TranslationCostEstimate {
  sourceLocale: string;
  targetLocales: string[];
  contentType: 'book' | 'post' | 'comment';
  estimatedChars: number;
  provider: 'deepl' | 'google';
  costPerChar: number;
  totalEstimate: number;
}

// Exemplo:
// 100.000 caracteres × 5 idiomas × $0.000025 (DeepL) = $12.50
```

### Admin Dashboard

O painel admin inclui uma calculadora de custos:

```
/admin/settings/translation-costs
├── Configurações
│  ├── Provider (DeepL / Google)
│  ├── Idiomas habilitados
│  └── Limite de custo mensal
├── Calculadora
│  ├── Input: Número de caracteres
│  ├── Output: Custo estimado
│  └── Gráfico: Custo por idioma
└── Histórico
   ├── Custo mensal
   ├── Caracteres traduzidos
   └── Idiomas mais usados
```

## Otimizações

### 1. Batching

O worker agrupa múltiplas traduções em uma única chamada à API:

```typescript
// Ao invés de:
// 10 chamadas × 1 texto = 10 requisições

// Fazer:
// 1 chamada × 10 textos = 1 requisição
const batch = await translationQueue.getBatch(10);
const results = await translateBatch(batch, provider);
```

### 2. Caching

Traduções são cacheadas por 24 horas em Redis:

```typescript
const cacheKey = `translation:${contentId}:${targetLocale}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached); // Retorna do cache
}

// Se não estiver em cache, traduzir e cachear
const result = await translateText(...);
await redis.setex(cacheKey, 86400, JSON.stringify(result));
```

### 3. Throttling

O sistema respeita limites de taxa das APIs:

```typescript
// DeepL: 50 requisições/segundo (free) ou 500 (pro)
// Google: Configurável no Cloud Console

const throttle = new PQueue({
  interval: 1000,
  intervalCap: 50, // 50 req/sec para DeepL free
});

await throttle.add(() => translateText(...));
```

## Monitoramento

### Métricas

```typescript
interface TranslationMetrics {
  totalTranslations: number;
  successRate: number;
  averageConfidence: number;
  averageLatency: number;
  costThisMonth: number;
  charsTranslatedThisMonth: number;
  failedTranslations: number;
  pendingReview: number;
}
```

### Alertas

O sistema envia alertas quando:

- ❌ Taxa de falha > 5%
- ⚠️ Confiança média < 0.70
- 💰 Custo mensal > limite configurado
- ⏱️ Latência média > 5s
- 📋 Fila de revisão > 100 itens

## Fallback & Recuperação

### Se a API de Tradução Falhar

```typescript
try {
  const result = await translateText(...);
} catch (error) {
  // 1. Tentar provider alternativo
  const fallbackResult = await translateText(..., { provider: 'google' });
  
  // 2. Se ambos falharem, usar tradução em cache
  const cachedFallback = await getOldestTranslation(contentId, targetLocale);
  
  // 3. Se nenhum disponível, marcar como pendente
  await flagForManualTranslation(contentId, targetLocale);
  
  // 4. Notificar admin
  await notifyAdmin(`Falha ao traduzir ${contentId} para ${targetLocale}`);
}
```

## Boas Práticas

### 1. Sempre Usar Glossário

Mantenha um glossário atualizado com termos específicos do domínio.

### 2. Revisar Traduções Baixa Confiança

Sempre revise manualmente traduções com confiança < 0.65.

### 3. Testar em Múltiplos Idiomas

Teste o site em todos os idiomas habilitados antes de publicar.

### 4. Monitorar Custos

Revise regularmente os custos de tradução e ajuste os limites conforme necessário.

### 5. Usar Cache Agressivamente

Cache traduções por pelo menos 24 horas para reduzir custos.

## Troubleshooting

### Problema: Traduções Lentas

**Solução:**
- Verificar fila de tradução em Redis
- Aumentar número de workers
- Usar batching maior

### Problema: Qualidade Ruim

**Solução:**
- Revisar glossário
- Aumentar confiança mínima para publicação
- Mudar para provider melhor (DeepL vs Google)

### Problema: Custo Alto

**Solução:**
- Aumentar cache TTL
- Reduzir idiomas habilitados
- Usar batching maior
- Considerar plano pro do provider

### Problema: Traduções Não Aparecem

**Solução:**
- Verificar status em /admin/translations
- Verificar logs do worker
- Verificar credenciais da API
- Verificar limite de quota

## Referências

- [DeepL API Docs](https://www.deepl.com/docs-api)
- [Google Translate API Docs](https://cloud.google.com/translate/docs)
- [i18n Best Practices](https://www.w3.org/International/questions/qa-what-is-i18n)
