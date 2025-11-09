# Contributing to Abbleitura

Obrigado por querer contribuir para o Abbleitura! Este documento fornece diretrizes para contribuir com o projeto.

## Código de Conduta

Este projeto adota um Código de Conduta para garantir um ambiente acolhedor para todos. Ao participar, você concorda em manter este padrão.

## Como Contribuir

### 1. Reportar Bugs

Se você encontrou um bug, abra uma issue com:

- **Título claro:** Descreva o problema brevemente
- **Descrição:** Explique o que esperava vs. o que aconteceu
- **Passos para reproduzir:** Liste os passos exatos
- **Ambiente:** Navegador, SO, versão do Node.js
- **Screenshots:** Se aplicável

**Template:**

```markdown
## Descrição
[Descrição clara do bug]

## Passos para Reproduzir
1. Vá para...
2. Clique em...
3. Observe...

## Comportamento Esperado
[O que deveria acontecer]

## Comportamento Atual
[O que realmente acontece]

## Ambiente
- Navegador: [ex: Chrome 120]
- SO: [ex: macOS 14.2]
- Node.js: [ex: 20.10]
```

### 2. Sugerir Melhorias

Abra uma issue com a tag `enhancement`:

- **Título:** Descreva a melhoria
- **Motivação:** Por que isso seria útil?
- **Solução proposta:** Como você implementaria?
- **Alternativas:** Outras abordagens?

### 3. Submeter Pull Requests

#### Pré-requisitos

- Fork o repositório
- Clone seu fork: `git clone https://github.com/seu-usuario/abbleitura.git`
- Crie uma branch: `git checkout -b feature/sua-feature`
- Instale dependências: `pnpm install`

#### Desenvolvimento

1. **Crie uma branch com nome descritivo:**

```bash
# Feature
git checkout -b feature/adicionar-dark-mode

# Bug fix
git checkout -b fix/corrigir-login

# Documentation
git checkout -b docs/adicionar-api-docs
```

2. **Faça commits com mensagens claras (Conventional Commits):**

```bash
git commit -m "feat: adicionar suporte a dark mode"
git commit -m "fix: corrigir bug de login"
git commit -m "docs: atualizar README"
git commit -m "test: adicionar testes para dark mode"
git commit -m "refactor: reorganizar estrutura de componentes"
```

3. **Siga o estilo de código:**

```bash
# Lint
pnpm lint

# Format
pnpm format
```

4. **Adicione testes:**

```bash
# Testes unitários
pnpm test:unit

# Testes E2E
pnpm test:e2e
```

5. **Atualize a documentação:**

- README.md se necessário
- Adicione comentários no código
- Atualize CHANGELOG.md

#### Submeter PR

1. **Push para seu fork:**

```bash
git push origin feature/sua-feature
```

2. **Abra um Pull Request:**

- Título claro: `feat: adicionar dark mode`
- Descrição detalhada do que foi mudado
- Referencie issues relacionadas: `Fixes #123`
- Adicione screenshots se for UI

3. **Aguarde revisão:**

- Responda aos comentários dos reviewers
- Faça ajustes conforme solicitado
- Rebase se necessário

## Padrões de Código

### TypeScript

```typescript
// ✅ Bom
interface User {
  id: string;
  name: string;
  email: string;
}

const getUser = async (id: string): Promise<User> => {
  return await db.users.findById(id);
};

// ❌ Ruim
const getUser = async (id) => {
  return await db.users.findById(id);
};
```

### React

```typescript
// ✅ Bom
export default function UserCard({ user }: { user: User }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}

// ❌ Ruim
export default function UserCard(props) {
  return (
    <div>
      <h2>{props.user.name}</h2>
      <p>{props.user.email}</p>
    </div>
  );
}
```

### Tailwind CSS

```tsx
// ✅ Bom
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
  Click me
</button>

// ❌ Ruim
<button style={{ padding: '8px 16px', backgroundColor: 'blue', color: 'white' }}>
  Click me
</button>
```

### Nomes

```typescript
// ✅ Bom
const getUserById = (id: string) => {};
const isUserAdmin = (user: User) => {};
const MAX_RETRIES = 3;

// ❌ Ruim
const get = (id) => {};
const check = (user) => {};
const max = 3;
```

## Estrutura de Branches

```
main (produção)
├── staging (pré-produção)
└── dev (desenvolvimento)
    ├── feature/nova-funcionalidade
    ├── fix/corrigir-bug
    └── docs/atualizar-docs
```

## Processo de Review

1. **Verificação automática:**
   - Lint passa
   - Testes passam
   - Build bem-sucedido

2. **Revisão manual:**
   - Código segue padrões
   - Sem duplicação
   - Performance aceitável
   - Documentação completa

3. **Aprovação:**
   - Mínimo 1 aprovação
   - Sem mudanças solicitadas

## Checklist para PR

- [ ] Branch criada a partir de `dev`
- [ ] Commits seguem Conventional Commits
- [ ] Testes adicionados/atualizados
- [ ] Documentação atualizada
- [ ] Lint passa (`pnpm lint`)
- [ ] Testes passam (`pnpm test`)
- [ ] Sem console.log ou debug code
- [ ] Sem dependências desnecessárias

## Conventional Commits

Usamos Conventional Commits para manter histórico limpo:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** Nova funcionalidade
- **fix:** Correção de bug
- **docs:** Documentação
- **style:** Formatação (sem mudança de lógica)
- **refactor:** Refatoração de código
- **test:** Testes
- **chore:** Tarefas (deps, config)
- **perf:** Melhoria de performance

### Exemplos

```
feat(auth): adicionar autenticação com Google

fix(comments): corrigir bug de moderação

docs(api): adicionar documentação de endpoints

refactor(components): reorganizar estrutura
```

## Releases

Seguimos [Semantic Versioning](https://semver.org/):

- **MAJOR:** Mudanças incompatíveis (1.0.0 → 2.0.0)
- **MINOR:** Novas funcionalidades compatíveis (1.0.0 → 1.1.0)
- **PATCH:** Correções de bugs (1.0.0 → 1.0.1)

## Comunicação

- **Issues:** Discussões sobre bugs e features
- **Discussions:** Perguntas e ideias
- **Pull Requests:** Implementações
- **Email:** security@abbleitura.com (apenas segurança)

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

## Dúvidas?

Abra uma issue ou entre em contato!

---

**Obrigado por contribuir! 🎉**
