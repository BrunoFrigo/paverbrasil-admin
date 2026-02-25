# PaverBrasil Admin

Aplicativo administrativo completo e profissional para gerenciar a empresa PaverBrasil. Sistema desenvolvido com React, Node.js, MySQL, tRPC e Drizzle ORM.

## Características

### 🔐 Autenticação Segura
- Sistema de login com autenticação local usando bcryptjs
- Credenciais padrão: `claudineifrigo` / `paverbrasil2026`
- Sessões seguras com cookies HTTP-only
- Logout com limpeza de sessão

### 🎨 Interface Profissional
- Tema escuro elegante com paleta de cores laranja vibrante
- Menu lateral fixo com navegação intuitiva
- Layout responsivo e acessível
- Componentes shadcn/ui de alta qualidade

### 📊 Dashboard
- Cards KPI com Receita Total (editável), Total de Pedidos, Clientes Ativos e Produtos
- Gráfico de Fluxo de Vendas em barras com cores dinâmicas
- Seções para orçamentos recentes e próximas entregas
- Estatísticas visuais em tempo real

### 👥 Módulo de Clientes
- CRUD completo (criar, editar, deletar)
- Tabela com busca e filtros por nome, email, telefone e status
- Status: Ativo, Inativo, Pendente
- Modal de criação com validação de formulários
- Toast notifications para feedback do usuário

### 📦 Módulo de Produtos
- Grid de cards com visualização intuitiva
- Campos: Nome, Preço, Categoria (Paver/Bloco/Guia/Outro), Unidade (m²/un/m linear), Descrição
- Controle de estoque com botões +/- que salvam automaticamente
- CRUD completo com busca por nome e categoria
- Modal de criação com validação

### 📋 Módulo de Pedidos
- Tabela profissional com colunas: ID, Cliente, Descrição, Data, Área (m²), Valor Total, Valor Entrega, Status
- Status com badges coloridos: Aprovado (azul), Pendente (laranja), Rejeitado (vermelho), Concluído (verde)
- Dropdown para alterar status em tempo real
- Modal de criação com campos separados para área e valores
- Busca por cliente ou descrição
- Botões de Filtros e Exportar

### 📝 Módulo de Anotações
- Sistema de notas com 5 cores personalizáveis: Amarelo, Azul, Verde, Rosa, Roxo
- Funcionalidade de fixar/desafixar notas
- Data e hora de criação em formato legível: "25/02/2026 às 07:05"
- Atualização em tempo real sem recarregar página
- Botões de editar e deletar em cada nota
- Modal para criar/editar anotações

## Stack Tecnológico

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Backend**: Node.js + Express 4
- **API**: tRPC 11 (type-safe RPC)
- **Database**: MySQL + Drizzle ORM
- **Autenticação**: bcryptjs
- **Gráficos**: Recharts
- **Notificações**: Sonner
- **Testes**: Vitest

## Instalação e Configuração

### Pré-requisitos
- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL 8.0+ (ou TiDB)

### Passos

1. **Instalar dependências**
```bash
pnpm install
```

2. **Configurar banco de dados**
```bash
pnpm db:push
```

3. **Iniciar servidor de desenvolvimento**
```bash
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## Uso

### Login
1. Acesse a página de login
2. Digite as credenciais:
   - Usuário: `claudineifrigo`
   - Senha: `paverbrasil2026`
3. Clique em "Entrar"

### Dashboard
- Visualize KPIs em tempo real
- Edite a Receita Total clicando no valor
- Acompanhe o fluxo de vendas com gráficos

### Gerenciar Clientes
1. Clique em "Clientes" no menu lateral
2. Clique em "Novo Cliente" para adicionar
3. Preencha os dados e clique em "Criar Cliente"
4. Use a busca para filtrar clientes
5. Clique no ícone de lixeira para deletar

### Gerenciar Produtos
1. Clique em "Produtos" no menu lateral
2. Clique em "Novo Produto" para adicionar
3. Preencha nome, preço, categoria e unidade
4. Use os botões +/- para controlar estoque
5. Clique em "Excluir" para remover um produto

### Criar Pedidos
1. Clique em "Pedidos" no menu lateral
2. Clique em "Novo Pedido" para criar
3. Selecione um cliente e preencha os dados
4. Altere o status usando o dropdown
5. Use a busca para encontrar pedidos

### Gerenciar Anotações
1. Clique em "Anotações" no menu lateral
2. Clique em "Nova Anotação" para criar
3. Escolha uma cor e digite o conteúdo
4. Clique no ícone de pino para fixar
5. Use editar e deletar conforme necessário

## Estrutura do Projeto

```
paverbrasil-admin/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── pages/         # Páginas (Login, Dashboard, etc)
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── lib/           # Utilitários (tRPC client)
│   │   └── App.tsx        # Roteamento principal
│   └── index.html
├── server/                 # Backend Node.js
│   ├── auth.ts            # Autenticação com bcryptjs
│   ├── db.ts              # Query helpers
│   ├── routers.ts         # tRPC procedures
│   └── _core/             # Framework core
├── drizzle/               # Schema e migrations
│   └── schema.ts          # Definição de tabelas
└── package.json
```

## Banco de Dados

### Tabelas

**users**
- id (PK)
- openId (único, para OAuth)
- username (único, para login local)
- passwordHash (bcryptjs)
- name
- email (único)
- role (admin/user)
- createdAt, updatedAt, lastSignedIn

**clients**
- id (PK)
- name
- email
- phone
- status (active/inactive/pending)
- createdAt, updatedAt

**products**
- id (PK)
- name
- price (decimal)
- category (paver/bloco/guia/outro)
- unit (m2/un/m_linear)
- description
- stock (int)
- createdAt, updatedAt

**quotations** (Pedidos)
- id (PK)
- clientId (FK)
- description
- area (decimal)
- totalValue (decimal)
- deliveryValue (decimal)
- status (approved/pending/rejected/completed)
- createdAt, updatedAt

**notes** (Anotações)
- id (PK)
- title
- content
- color (yellow/blue/green/pink/purple)
- isPinned (boolean)
- createdAt, updatedAt

**galleryWorks**
- id (PK)
- title
- description
- imageUrl
- createdAt, updatedAt

## Testes

Executar todos os testes:
```bash
pnpm test
```

Testes incluem:
- Autenticação com bcryptjs
- Login com credenciais corretas/incorretas
- Logout e limpeza de sessão

## Build para Produção

```bash
pnpm build
pnpm start
```

## Segurança

- Senhas criptografadas com bcryptjs (10 salt rounds)
- Sessões seguras com cookies HTTP-only
- Validação de entrada com Zod
- Procedures protegidas com autenticação obrigatória
- CSRF protection via tRPC

## Variáveis de Ambiente

O aplicativo usa as seguintes variáveis de ambiente (injetadas automaticamente):
- `DATABASE_URL` - Conexão MySQL
- `JWT_SECRET` - Chave de sessão
- `VITE_APP_ID` - ID da aplicação
- `OAUTH_SERVER_URL` - URL do servidor OAuth
- `VITE_OAUTH_PORTAL_URL` - URL do portal de login

## Suporte

Para dúvidas ou problemas:
1. Verifique se o banco de dados está rodando
2. Execute `pnpm db:push` para sincronizar schema
3. Limpe o cache do navegador
4. Reinicie o servidor com `pnpm dev`

## Licença

Propriedade da PaverBrasil. Todos os direitos reservados.

## Changelog

### v1.0.0 - 25/02/2026
- ✅ Autenticação com bcryptjs
- ✅ Dashboard com KPIs
- ✅ CRUD de Clientes
- ✅ CRUD de Produtos com controle de estoque
- ✅ CRUD de Pedidos
- ✅ Sistema de Anotações coloridas
- ✅ Tema escuro profissional
- ✅ Testes unitários
- ✅ Banco de dados MySQL com Drizzle ORM
