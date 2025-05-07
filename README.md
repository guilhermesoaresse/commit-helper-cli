# 🧙‍♂️ commit-helper-cli

Uma CLI simples e poderosa para padronizar mensagens de commit com tipos, escopos e integração com ferramentas de tarefas como ClickUp, Trello e outras.

---

## 🚀 Instalação

### 📦 Global (via NPM)

```bash
npm install -g commit-helper-cli
```

### ⚡️ Uso instantâneo com `npx`

Você também pode usar sem instalar:

```bash
npx commit-helper-cli
```

---

## 🛠️ Como usar

No terminal, dentro do seu repositório Git:

```bash
commit-helper
```

Ou com `npx`:

```bash
npx commit-helper
```

A CLI fará perguntas como:

- Tipo do commit (ex: `feat`, `fix`, `docs`, etc.)
- Escopo (ex: `auth`, `cliente`, `infra`)
- Título do commit
- Corpo técnico (opcional)
- ID da tarefa (ex: `CU-1A2B3C`, `TRELLO-123`, etc.)

---

## 🧩 Configuração

Você pode criar um arquivo `.commit-helperrc.json` na raiz do projeto para personalizar os tipos, escopos e integração com sua ferramenta de tarefas.

### Exemplo de `.commit-helperrc.json`:

```json
{
  "types": [
    { "value": "feat", "emoji": "✨", "label": "Nova funcionalidade" },
    { "value": "fix", "emoji": "🐛", "label": "Correção de bug" },
    { "value": "docs", "emoji": "📝", "label": "Documentação" },
    { "value": "infra", "emoji": "🛠️", "label": "Infraestrutura" }
  ],
  "scopes": ["auth", "cliente", "pedido", "infraestrutura"],
  "taskPrefix": "CU-",
  "taskUrl": "https://app.clickup.com/t/{id}"
}
```

> 🔁 Caso não haja `.commit-helperrc.json`, o script tentará ler do `package.json` no campo `commit-helper`. Se nenhum for encontrado, uma configuração padrão será usada.

---

## 📋 Exemplo de saída

```bash
fix(auth): 🐛 corrige token expirado na verificação de 2FA

Ajusta o fluxo de autenticação para lidar com tokens expirados corretamente.
Refs: CU-1A2B3C (https://app.clickup.com/t/CU-1A2B3C)
```

---

## 🧠 Sugestões futuras

- Suporte a emojis opcionais
- Suporte a múltiplas ferramentas de tarefas (GitHub Issues, Linear, Trello)
- Geração automática de changelogs
- Suporte a lint-commit via hook (`husky`)

---

## 📄 Licença

MIT © [Guilherme Soares]
