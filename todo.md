# PaverBrasil Admin - TODO

## Autenticação e Layout Base
- [x] Configurar schema Drizzle com tabelas (products, quotations, notes)
- [x] Implementar autenticação com bcryptjs (usuário: claudineifrigo, senha: paverbrasil2026)
- [x] Criar página de login com formulário seguro
- [x] Implementar DashboardLayout com menu lateral fixo
- [x] Adicionar logo PaverBrasil e navegação principal
- [x] Implementar botão de logout

## Dashboard
- [x] Criar cards KPI com Receita Total, Total de Pedidos, Clientes Ativos, Produtos
- [x] Implementar edição de Receita Total ao clicar
- [x] Criar gráfico de Fluxo de Vendas em barras (laranja)
- [x] Adicionar tabela de orçamentos recentes
- [x] Adicionar seção de próximas entregas
- [x] Implementar estatísticas visuais

## Módulo de Clientes
- [x] Criar página de Clientes com tabela
- [x] Implementar CRUD completo (criar, editar, deletar)
- [x] Adicionar busca e filtros por nome, email, telefone, status
- [x] Criar modal de novo cliente
- [x] Implementar validação de formulários
- [x] Adicionar toast notifications para feedback

## Módulo de Produtos
- [x] Criar página de Produtos com grid de cards
- [x] Implementar CRUD completo
- [x] Adicionar controle de estoque com botões +/-
- [x] Criar modal de novo produto com campos: nome, preço, categoria, unidade, descrição
- [x] Implementar busca por nome, tipo ou cor
- [x] Adicionar botão de excluir em cada card
- [x] Salvar mudanças de estoque no banco de dados

## Módulo de Pedidos
- [x] Criar página de Pedidos com tabela profissional
- [x] Implementar colunas: ID, Cliente, Descrição, Data, Área (m²), Valor Total, Valor Entrega, Status
- [x] Adicionar badges coloridos para status
- [x] Implementar dropdown para alterar status
- [x] Criar modal de novo pedido com campos separados
- [x] Adicionar busca por cliente ou pedido
- [x] Implementar botões Filtros e Exportar
- [x] Adicionar ícone de delete em cada linha

## Módulo de Anotações
- [x] Criar página de Anotações com grid de cards coloridos
- [x] Implementar 5 cores personalizáveis (amarelo, azul, verde, rosa, roxo)
- [x] Adicionar funcionalidade de fixar/desafixar notas
- [x] Exibir data e hora de criação (formato: "25/02/2026 às 07:05")
- [x] Implementar atualização em tempo real sem recarregar página
- [x] Adicionar botões de editar e deletar
- [x] Criar modal para criar/editar notas

## Testes e Ajustes Finais
- [ ] Escrever testes unitários com vitest
- [ ] Validar autenticação e segurança
- [ ] Testar responsividade em diferentes telas
- [ ] Validar invalidação de cache tRPC
- [ ] Verificar toast notifications
- [ ] Testar CRUD em todos os módulos
- [ ] Revisar tema escuro e paleta de cores
- [ ] Corrigir bugs e ajustes finais

## Deploy
- [ ] Criar checkpoint final
- [ ] Preparar instruções de uso
- [ ] Documentar credenciais padrão


## Correções Solicitadas
- [x] Corrigir bugs identificados no aplicativo
- [x] Implementar edição de receita com persistência no banco de dados
- [x] Remover credenciais de demonstração da página de login
- [x] Limpar banco de dados (remover dados de exemplo)
- [x] Validar todas as funcionalidades após correções

## Correção de Autenticação (Segunda Rodada)
- [x] Criar componente ProtectedRoute para proteger rotas
- [x] Implementar verificação de autenticação nas rotas do painel
- [x] Evitar redirecionamento para OAuth quando já autenticado
- [x] Validar fluxo de autenticação com testes
