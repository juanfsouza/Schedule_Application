# 📅 Sistema de Agendamento - ScheduleApp

![Screenshot_1](https://github.com/user-attachments/assets/d3b9325c-c109-46bd-888c-c38f60ba44fe)

## 🗂️ Visão Geral

Sistema completo de agendamento desenvolvido com **TypeScript** no backend e **Next.js 15** no frontend. Permite gerenciar calendários, eventos, participantes e horários de trabalho.

### ✨ Funcionalidades Principais

- 🔐 **Autenticação JWT** - Login e registro de usuários
- 📅 **Gestão de Calendários** - Criar, editar e gerenciar múltiplos calendários
- 🗓️ **Eventos** - Agendamento com suporte a eventos recorrentes
- 👥 **Participantes** - Adicionar e gerenciar convidados
- ⏰ **Horários de Trabalho** - Configurar disponibilidade semanal
- 📱 **Interface Responsiva** - Design moderno com Tailwind CSS

---

## 🏗️ Arquitetura

### Backend (Node.js + Express + TypeScript)

```
backend/
├── src/
│   ├── controllers/     # Controladores das rotas
│   ├── services/        # Lógica de negócio
│   ├── repositories/    # Acesso ao banco de dados
│   ├── middleware/      # Autenticação, validação, erros
│   ├── routes/          # Definição das rotas da API
│   ├── dtos/           # Validação de dados de entrada
│   └── utils/          # Utilitários (JWT, time, etc.)
├── prisma/
│   └── schema.prisma   # Schema do banco de dados
└── package.json
```

### Frontend (Next.js 15 + React 19 + TypeScript)

```
frontend/
├── app/
│   ├── auth/           # Páginas de autenticação
│   ├── dashboard/      # Dashboard principal
│   ├── components/     # Componentes reutilizáveis
│   └── store/         # Gerenciamento de estado (Zustand)
├── lib/
└── package.json
```

---

## 🗄️ Banco de Dados

**PostgreSQL** com **Prisma ORM**

### Principais Entidades:
- **User** - Usuários do sistema
- **Calendar** - Calendários dos usuários
- **Event** - Eventos/compromissos
- **EventRecurrence** - Recorrência de eventos
- **EventAttendee** - Participantes dos eventos
- **WorkingHours** - Horários de trabalho
- **Schedule** - Agendas geradas

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm ou yarn

### Backend
```bash
cd backend
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Variáveis de Ambiente

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/scheduleapp"
JWT_SECRET="your-secret-key"
PORT=3001
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📚 Tecnologias Utilizadas

### Backend
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de schemas
- **date-fns** - Manipulação de datas

### Frontend
- **Next.js 15** - Framework React
- **React 19** - Biblioteca UI
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Zustand** - Gerenciamento de estado
- **React Hook Form** - Formulários
- **date-fns** - Manipulação de datas

---

## 🔧 Scripts Disponíveis

### Backend
```bash
npm run dev          # Desenvolvimento com hot reload
npm run build        # Build para produção
npm run start        # Executar em produção
npm run db:generate  # Gerar cliente Prisma
npm run db:migrate   # Executar migrações
npm run db:studio    # Abrir Prisma Studio
npm run test         # Executar testes
```

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build para produção
npm run start        # Executar em produção
npm run lint         # Verificar código
```

---

## 📡 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Usuários
- `GET /api/users` - Listar usuários
- `PUT /api/users/:id` - Atualizar usuário

### Calendários
- `GET /api/calendars` - Listar calendários
- `POST /api/calendars` - Criar calendário
- `PUT /api/calendars/:id` - Atualizar calendário
- `DELETE /api/calendars/:id` - Deletar calendário

### Eventos
- `GET /api/events` - Listar eventos
- `POST /api/events` - Criar evento
- `PUT /api/events/:id` - Atualizar evento
- `DELETE /api/events/:id` - Deletar evento

### Participantes
- `GET /api/events/:id/attendees` - Listar participantes
- `POST /api/events/:id/attendees` - Adicionar participante
- `PUT /api/events/:id/attendees/:attendeeId` - Atualizar participante
- `DELETE /api/events/:id/attendees/:attendeeId` - Remover participante

### Horários de Trabalho
- `GET /api/working-hours` - Obter horários
- `PUT /api/working-hours` - Atualizar horários

---

## 🎨 Interface do Usuário

- **Dashboard** - Visualização principal do calendário
- **Sidebar** - Navegação e lista de eventos
- **Diálogos** - Criação e edição de eventos/calendários
- **Responsivo** - Adaptável para desktop e mobile

---

## 🔒 Segurança

- Autenticação JWT
- Hash de senhas com bcrypt
- Validação de entrada com Zod
- Rate limiting
- Headers de segurança com Helmet
- CORS configurado

---

