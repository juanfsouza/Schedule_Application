# 📡 Documentação da API - ScheduleApp

## 🔗 Base URL
```
http://localhost:3001/api
```

## 🔐 Autenticação

Todas as rotas (exceto login/registro) requerem o header de autorização:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 👤 Autenticação

### Registrar Usuário
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "token": "jwt_token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
```

---

## 📅 Calendários

### Listar Calendários
```http
GET /calendars
Authorization: Bearer <token>
```

### Criar Calendário
```http
POST /calendars
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Trabalho",
  "description": "Calendário profissional",
  "color": "#3b82f6",
  "isDefault": false
}
```

### Atualizar Calendário
```http
PUT /calendars/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Trabalho Atualizado",
  "color": "#ef4444"
}
```

---

## 🗓️ Eventos

### Listar Eventos
```http
GET /events?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

### Criar Evento
```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Reunião de Equipe",
  "description": "Discussão sobre o projeto",
  "startTime": "2024-01-15T10:00:00Z",
  "endTime": "2024-01-15T11:00:00Z",
  "allDay": false,
  "location": "Sala de Reuniões",
  "calendarId": "calendar_uuid",
  "type": "MEETING"
}
```

### Evento Recorrente
```http
POST /events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Standup Diário",
  "startTime": "2024-01-15T09:00:00Z",
  "endTime": "2024-01-15T09:30:00Z",
  "calendarId": "calendar_uuid",
  "isRecurring": true,
  "recurrence": {
    "frequency": "DAILY",
    "interval": 1,
    "endDate": "2024-12-31T00:00:00Z"
  }
}
```

---

## 👥 Participantes

### Adicionar Participante
```http
POST /events/:eventId/attendees
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "maria@email.com",
  "name": "Maria Santos",
  "role": "ATTENDEE"
}
```

### Atualizar Status do Participante
```http
PUT /events/:eventId/attendees/:attendeeId
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "ACCEPTED"
}
```

---

## ⏰ Horários de Trabalho

### Obter Horários
```http
GET /working-hours
Authorization: Bearer <token>
```

### Configurar Horários
```http
PUT /working-hours
Authorization: Bearer <token>
Content-Type: application/json

{
  "mondayStart": 9,
  "mondayEnd": 18,
  "tuesdayStart": 9,
  "tuesdayEnd": 18,
  "wednesdayStart": 9,
  "wednesdayEnd": 18,
  "thursdayStart": 9,
  "thursdayEnd": 18,
  "fridayStart": 9,
  "fridayEnd": 17
}
```

---

## 📊 Tipos de Dados

### EventStatus
- `CONFIRMED` - Confirmado
- `TENTATIVE` - Provisório
- `CANCELLED` - Cancelado

### EventType
- `APPOINTMENT` - Compromisso
- `MEETING` - Reunião
- `BIRTHDAY` - Aniversário
- `REMINDER` - Lembrete
- `TASK` - Tarefa
- `OTHER` - Outro

### RecurrenceType
- `DAILY` - Diário
- `WEEKLY` - Semanal
- `MONTHLY` - Mensal
- `YEARLY` - Anual

### AttendeeStatus
- `PENDING` - Pendente
- `ACCEPTED` - Aceito
- `DECLINED` - Recusado
- `TENTATIVE` - Provisório

### AttendeeRole
- `ORGANIZER` - Organizador
- `ATTENDEE` - Participante
- `OPTIONAL` - Opcional

---

## ⚠️ Códigos de Erro

- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Recurso não encontrado
- `409` - Conflito (ex: email já existe)
- `500` - Erro interno do servidor

---

## 📝 Exemplos de Resposta de Erro

```json
{
  "success": false,
  "error": {
    "message": "Email já está em uso",
    "code": "EMAIL_EXISTS",
    "statusCode": 409
  }
}
```

---

## 🔄 Paginação

Para endpoints que retornam listas, use query parameters:
```http
GET /events?page=1&limit=10&startDate=2024-01-01&endDate=2024-01-31
```

**Resposta paginada:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
``` 