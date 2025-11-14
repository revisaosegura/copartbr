# Copart Brasil - Clone

Clone completo do site Copart com sistema de leilões de veículos em tempo real.

## 🚀 Funcionalidades

- **Sistema de Leilões em Tempo Real** - Lances ao vivo com Socket.IO
- **Busca Avançada** - Busca por marca, modelo, chassis/VIN e número do lote
- **Sistema de Notificações** - Notificações personalizadas para novos lances, mudanças de preço e lembretes
- **Painel Administrativo** - Gerenciamento completo de veículos e configurações
- **Sincronização Automática** - Espelhamento direto da Copart Brasil atualizado a cada 4 horas
- **Autenticação OAuth** - Sistema de login seguro
- **Responsivo** - Design totalmente responsivo para mobile e desktop

## 🛠️ Tecnologias

### Frontend
- **React 19** - Framework JavaScript
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Wouter** - Roteamento
- **Socket.IO Client** - Comunicação em tempo real
- **tRPC** - API type-safe

### Backend
- **Node.js 22** - Runtime JavaScript
- **Express** - Framework web
- **tRPC** - API type-safe
- **Socket.IO** - WebSockets
- **Drizzle ORM** - ORM para banco de dados
- **MySQL** - Banco de dados
- **Node-cron** - Agendamento de tarefas

### Integrações
- **Copart Brasil** - Coleta direta dos veículos e leilões oficiais
- **Stripe** - Pagamentos (configurado mas não implementado)
- **OAuth** - Autenticação

## 📋 Pré-requisitos

- Node.js 22.x ou superior
- pnpm 10.x ou superior
- MySQL 8.x ou superior

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/revisaosegura/copartbr.git
cd copartbr
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
# Copie o arquivo .env.example para .env
cp .env.example .env

# Edite o arquivo .env com suas credenciais
```

4. Configure o banco de dados:
```bash
# Execute as migrations
pnpm db:push
```

5. Inicie o servidor de desenvolvimento:
```bash
pnpm dev
```

O site estará disponível em `http://localhost:3000`

## 🌐 Deploy no Render

O projeto está configurado para deploy automático no Render através do arquivo `render.yaml`.

### Variáveis de Ambiente Necessárias:

- `DATABASE_URL` - URL de conexão com MySQL (obrigatório)
- `JWT_SECRET` - Chave secreta para JWT (gerada automaticamente)
- `COPART_SEARCH_URL` - URL da pesquisa pública da Copart (opcional)
- `COPART_SEARCH_FALLBACK_URL` - Endpoint alternativo da Copart usado como fallback (opcional)
- `COPART_PAGE_SIZE` - Quantidade de registros por página na coleta (opcional)
- `COPART_MAX_PAGES` - Número máximo de páginas coletadas por sincronização (opcional)
- `OAUTH_SERVER_URL` - URL do servidor OAuth (opcional)
- `STRIPE_SECRET_KEY` - Chave secreta Stripe (opcional)
- `STRIPE_WEBHOOK_SECRET` - Secret do webhook Stripe (opcional)

### Passos para Deploy:

1. **Crie um banco MySQL** no Render ou use um externo
2. **Crie um novo Web Service** no Render
3. **Conecte ao repositório GitHub** (revisaosegura/copartbr)
4. **Configure o ambiente:**
   - Environment: **Node**
   - Build Command: `bash scripts/build.sh`
   - Start Command: `bash scripts/start.sh`
5. **Adicione as variáveis de ambiente** (especialmente DATABASE_URL)
6. O deploy será feito automaticamente

**Importante:** As migrations do banco são executadas automaticamente no start command.

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Inicia servidor de desenvolvimento

# Build
pnpm build        # Compila o projeto para produção

# Produção
pnpm start        # Inicia servidor de produção

# Banco de Dados
pnpm db:push      # Aplica mudanças no schema do banco
pnpm db:studio    # Abre interface visual do banco

# Testes
pnpm test         # Executa testes
```

## 🗂️ Estrutura do Projeto

```
copartbr/
├── client/              # Frontend React
│   ├── public/         # Arquivos estáticos
│   └── src/
│       ├── components/ # Componentes React
│       ├── pages/      # Páginas da aplicação
│       ├── hooks/      # Custom hooks
│       └── lib/        # Utilitários
├── server/             # Backend Node.js
│   ├── _core/         # Funcionalidades core
│   ├── services/      # Serviços (Copart, sincronização)
│   ├── routers.ts     # Rotas tRPC
│   ├── socket.ts      # Configuração Socket.IO
│   └── db.ts          # Funções do banco de dados
├── drizzle/           # Migrations e schema do banco
├── shared/            # Código compartilhado
└── render.yaml        # Configuração Render
```

## 🔐 Segurança

- Autenticação via OAuth
- JWT para sessões
- Validação de entrada com Zod
- Proteção contra SQL Injection via Drizzle ORM
- CORS configurado

## 📝 Licença

Este projeto é um clone educacional do site Copart.

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📧 Contato

Para dúvidas e suporte, entre em contato através do GitHub.

---

**Nota:** Este é um projeto de demonstração e não tem afiliação oficial com a Copart.
