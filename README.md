# 🚀 VenderGas - Sistema de Gestão Comercial

Sistema completo de gestão comercial com backend em Node.js/Express, Prisma (MongoDB) e frontend em Next.js com shadcn/ui.

## 📋 Funcionalidades

- **Autenticação**: Sistema de login seguro com Better Auth
- **Empresas**: CRUD completo para gerenciar empresas
- **Clientes**: Cadastro e gestão de clientes por empresa
- **Produtos**: Controle de produtos com preços e descrições
- **Pedidos**: Criação de pedidos com produtos e quantidades
- **Produtos do Pedido**: Gerenciamento flexível de produtos nos pedidos
- **Segurança**: Acesso restrito por usuário e empresa

## 🛠️ Tecnologias

### Backend
- **Node.js** + **Express**
- **Prisma** (ORM)
- **MongoDB** (Banco de dados)
- **Better Auth** (Autenticação)
- **TypeScript**

### Frontend
- **Next.js 14** (App Router)
- **React** + **TypeScript**
- **shadcn/ui** (Componentes)
- **Tailwind CSS** (Estilização)
- **Zod** (Validação)
- **Sonner** (Notificações)

## 📦 Pré-requisitos

- Node.js 18+ 
- MongoDB (local ou Atlas)
- npm ou yarn
- Docker e Docker Compose (para execução via Docker)

## 🚀 Instalação

### Instalação Local

#### 1. Clone o repositório
```bash
git clone <https://github.com/orsanor/vendergas-teste>
cd teste-vendergas
```
#### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

#### 3. Execute com Docker Compose

```bash
# Construa e inicie todos os serviços
docker-compose up --build

# Para executar em background
docker-compose up -d --build

# Para parar os serviços
docker-compose down
```

#### 4. Acesse a aplicação

- **Frontend**: http://localhost:4000
- **Backend API**: http://localhost:3000
- **MongoDB**: localhost:27017

#### 5. Comandos Docker úteis

```bash
# Ver logs dos serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Executar comandos dentro dos containers
docker-compose exec backend npm run prisma:generate
docker-compose exec backend npm run prisma:push

# Parar e remover containers
docker-compose down -v

# Reconstruir imagens
docker-compose build --no-cache
```

## 📁 Estrutura do Projeto

```
teste-vendergas/
├── vendergas_api/                 # Backend
│   ├── src/
│   │   ├── controllers/          # Controllers da API
│   │   ├── routes/               # Rotas da API
│   │   ├── middlewares/          # Middlewares
│   │   └── app.ts               # Configuração do Express
│   ├── prisma/
│   │   └── schema.prisma        # Schema do banco de dados
│   └── package.json
│
├── vendergas_frontend/           # Frontend
│   ├── app/
│   │   ├── (auth)/              # Páginas de autenticação
│   │   ├── (private)/           # Páginas privadas
│   │   └── dashboard/           # Dashboard principal
│   ├── components/              # Componentes React
│   └── package.json
│
├── docker-compose.yml           # Configuração Docker
├── .env                        # Variáveis de ambiente
└── README.md
```

## 🔐 Autenticação

O sistema usa Better Auth para autenticação. Para criar um usuário inicial:

1. Acesse `http://localhost:3000/register`
2. Crie sua conta
3. Faça login em `http://localhost:3000/login`

## 🏢 Fluxo de Uso

### 1. Primeiro Acesso
1. **Cadastre uma empresa** em `/companies`
2. **Cadastre clientes** em `/clients`
3. **Cadastre produtos** em `/products`

### 2. Criando Pedidos
1. **Crie um pedido** em `/order` (empresa, cliente, observação)
2. **Adicione produtos** ao pedido em `/orderProducts`
3. **Gerencie quantidades** e produtos conforme necessário

## 🔧 Scripts Disponíveis

### Backend
```bash
cd vendergas_api

npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Produção
```

### Frontend
```bash
cd vendergas_frontend

npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Produção
```

## 🛡️ Segurança

- **Autenticação obrigatória** em todas as rotas privadas
- **Filtros por usuário** - cada usuário vê apenas seus dados
- **Filtros por empresa** - dados isolados por empresa
- **Validação de entrada** com Zod
- **Proteção CSRF** com Better Auth

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Empresas
- `GET /api/v1/companies` - Listar empresas
- `POST /api/v1/companies` - Criar empresa
- `PUT /api/v1/companies/:id` - Atualizar empresa
- `DELETE /api/v1/companies/:id` - Deletar empresa

### Clientes
- `GET /api/v1/clients` - Listar clientes
- `POST /api/v1/clients` - Criar cliente
- `PUT /api/v1/clients/:id` - Atualizar cliente
- `DELETE /api/v1/clients/:id` - Deletar cliente

### Produtos
- `GET /api/v1/products` - Listar produtos
- `POST /api/v1/products` - Criar produto
- `PUT /api/v1/products/:id` - Atualizar produto
- `DELETE /api/v1/products/:id` - Deletar produto

### Pedidos
- `GET /api/v1/orders` - Listar pedidos
- `POST /api/v1/orders` - Criar pedido
- `PUT /api/v1/orders/:id` - Atualizar pedido
- `DELETE /api/v1/orders/:id` - Deletar pedido

### Produtos do Pedido
- `GET /api/v1/order-products` - Listar produtos dos pedidos
- `POST /api/v1/order-products` - Adicionar produto ao pedido
- `PUT /api/v1/order-products/:id` - Atualizar produto do pedido
- `DELETE /api/v1/order-products/:id` - Remover produto do pedido
