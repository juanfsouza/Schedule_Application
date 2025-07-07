# 🖥️ Documentação do Frontend - ScheduleApp

## 🏗️ Estrutura do Projeto

```
frontend/
├── app/
│   ├── auth/                    # Páginas de autenticação
│   │   ├── login/page.tsx      # Página de login
│   │   └── register/page.tsx   # Página de registro
│   ├── dashboard/              # Dashboard principal
│   │   └── page.tsx           # Página do dashboard
│   ├── components/             # Componentes reutilizáveis
│   │   ├── ui/                # Componentes base (Radix UI)
│   │   ├── AddCalendarDialog.tsx
│   │   ├── AddEventDialog.tsx
│   │   ├── CalendarComponent.tsx
│   │   ├── EventCard.tsx
│   │   ├── MainContent.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── store/                 # Gerenciamento de estado
│   │   └── calendarStore.ts   # Store Zustand
│   ├── utils/                 # Utilitários
│   │   └── categories.ts      # Categorias de eventos
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página inicial
├── lib/
│   └── utils.ts               # Utilitários gerais
└── package.json
```

---

## 🎨 Componentes Principais

### 📱 Layout Principal
- **`layout.tsx`** - Layout base com providers e configurações
- **`page.tsx`** - Página inicial com redirecionamento

### 🔐 Autenticação
- **`auth/login/page.tsx`** - Formulário de login
- **`auth/register/page.tsx`** - Formulário de registro

### 📊 Dashboard
- **`dashboard/page.tsx`** - Página principal do sistema
  - Gerencia estado do usuário
  - Carrega calendários e eventos
  - Controla navegação

### 🧩 Componentes Reutilizáveis

#### **Sidebar.tsx**
- Navegação lateral
- Lista de eventos do dia
- Seletor de data

#### **MainContent.tsx**
- Visualização principal do calendário
- Controles de navegação (mês anterior/próximo)
- Integração com componentes de eventos

#### **CalendarComponent.tsx**
- Renderização do calendário
- Exibição de eventos
- Interação com cliques

#### **EventCard.tsx**
- Card de evento individual
- Informações básicas (título, horário, local)
- Ações rápidas

#### **Diálogos**
- **`AddCalendarDialog.tsx`** - Criar novo calendário
- **`AddEventDialog.tsx`** - Criar novo evento
- **`AddRecurrenceDialog.tsx`** - Configurar recorrência
- **`EventDetailsDialog.tsx`** - Detalhes do evento
- **`SetWorkingHoursDialog.tsx`** - Configurar horários

---

## 🗃️ Gerenciamento de Estado

### Zustand Store (`calendarStore.ts`)

```typescript
interface CalendarStore {
  // Estado
  calendars: Calendar[]
  events: Event[]
  loading: boolean
  
  // Ações
  fetchCalendars: () => Promise<void>
  fetchEvents: () => Promise<void>
  addCalendar: (calendar: CreateCalendarDto) => Promise<void>
  addEvent: (event: CreateEventDto) => Promise<void>
  // ... outras ações
}
```

**Principais funcionalidades:**
- Cache de calendários e eventos
- Sincronização com API
- Gerenciamento de loading states
- Operações CRUD

---

## 🎯 Hooks e Utilitários

### Autenticação
```typescript
// Decodificação de JWT
function jwtDecode<T>(token: string): T

// Verificação de token
const getToken = () => localStorage.getItem('token')
```

### API Calls
```typescript
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Exemplo de chamada autenticada
const response = await fetch(`${baseUrl}/events`, {
  headers: { Authorization: `Bearer ${token}` }
})
```

### Manipulação de Datas
```typescript
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Formatação de datas
const formattedDate = format(date, 'dd/MM/yyyy', { locale: ptBR })
```

---

## 🎨 Sistema de Design

### Tailwind CSS
- **Cores:** Sistema de cores consistente
- **Espaçamento:** Grid system responsivo
- **Tipografia:** Hierarquia clara de textos
- **Componentes:** Baseados em Radix UI

### Componentes Base (`ui/`)
- **Button** - Botões com variantes
- **Dialog** - Modais acessíveis
- **Input** - Campos de entrada
- **Select** - Seletores dropdown
- **Calendar** - Componente de calendário
- **Card** - Cards de conteúdo

### Variantes de Componentes
```typescript
// Exemplo de button com variantes
<Button variant="default" size="sm">
  Criar Evento
</Button>

<Button variant="destructive" size="lg">
  Excluir
</Button>
```

---

## 📱 Responsividade

### Breakpoints
- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### Adaptações
- Sidebar colapsável em mobile
- Diálogos em tela cheia em telas pequenas
- Grid responsivo para eventos
- Navegação otimizada para touch

---

## 🔄 Fluxo de Dados

### 1. Autenticação
```
Login → JWT Token → localStorage → Dashboard
```

### 2. Carregamento Inicial
```
Dashboard → Verificar Token → Carregar Usuário → Carregar Dados
```

### 3. Operações CRUD
```
Ação do Usuário → Store → API → Atualizar Store → UI
```

### 4. Sincronização
```
Mudança de Data → Fetch Events → Atualizar Calendário
```

---

## 🛠️ Desenvolvimento

### Scripts Disponíveis
```bash
npm run dev          # Desenvolvimento com Turbopack
npm run build        # Build para produção
npm run start        # Executar build
npm run lint         # Verificar código
```

### Variáveis de Ambiente
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Estrutura de Imports
```typescript
// Componentes
import { Button } from '@/app/components/ui/button'

// Utilitários
import { cn } from '@/lib/utils'

// Store
import useCalendarStore from '@/app/store/calendarStore'
```

---

## 🎯 Padrões de Código

### Nomenclatura
- **Componentes:** PascalCase (`AddEventDialog`)
- **Arquivos:** PascalCase para componentes, camelCase para utilitários
- **Variáveis:** camelCase
- **Constantes:** UPPER_SNAKE_CASE

### Estrutura de Componentes
```typescript
'use client' // Para componentes interativos

import { useState, useEffect } from 'react'
import { toast } from 'sonner'

interface Props {
  // Props tipadas
}

export default function ComponentName({ prop }: Props) {
  // Hooks
  // Lógica
  // Render
}
```

### Tratamento de Erros
```typescript
try {
  // Operação
} catch (error) {
  console.error('Erro:', error)
  toast.error('Mensagem de erro')
}
```

---

## 📊 Performance

### Otimizações
- **Lazy Loading** de componentes pesados
- **Memoização** com `useMemo` e `useCallback`
- **Virtualização** para listas grandes
- **Debounce** em inputs de busca

### Bundle Size
- **Tree Shaking** automático
- **Code Splitting** por rota
- **Import Dinâmico** para componentes grandes

---

## 🔧 Configurações

### Next.js 15
- **App Router** - Nova estrutura de roteamento
- **Turbopack** - Bundler mais rápido
- **Server Components** - Renderização otimizada

### TypeScript
- **Strict Mode** habilitado
- **Path Mapping** configurado
- **Type Safety** em toda aplicação

### ESLint + Prettier
- **Regras** padronizadas
- **Formatação** automática
- **Integração** com IDE 