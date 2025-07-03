# 📅 Scheduling System Documentation

## 🗂️ Overview

![Screenshot_10](https://github.com/user-attachments/assets/0c7b6b45-c857-40e5-9c78-5d5cfb1d4378)

This project is a **full-stack scheduling system** built with a **TypeScript backend** and a **Next.js frontend**.  
It provides robust features for:

✅ **User Authentication**  
📆 **Calendar Management**  
🗓️ **Event Scheduling**  
👥 **Attendee Tracking**  
⏰ **Working Hours Configuration**

---

## 📁 Project Structure

### 🛠️ Backend

- **`dtos/`**: 📄 Data Transfer Objects to define and validate data structures.  
  _Examples:_ `auth.dto.ts`, `calendar.dto.ts`, `event.attendee.dto.ts`

- **`middleware/`**: 🧩 Middlewares for handling authentication, validation, and error responses.  
  _Examples:_ `auth.middleware.ts`, `validator.middleware.ts`, `error.middleware.ts`

- **`repositories/`**: 🗃️ Database access layer for interacting with Prisma and handling CRUD operations for all entities.  
  _Examples:_ `calendar.repository.ts`, `event.repository.ts`

- **`routes/`**: 🚏 Defines all API endpoints for authentication, calendars, events, and schedules.  
  _Examples:_ `auth.routes.ts`, `calendar.routes.ts`

- **`services/`**: 🔧 Business logic for handling core functionalities like user management, event workflows, and validations.  
  _Examples:_ `auth.service.ts`, `calendar.service.ts`

- **`controllers/`**: 🎛️ Controllers that process HTTP requests and return responses to the client.  
  _Examples:_ `AuthController`, `CalendarController`, `EventAttendeeController`

- **`utils/`**: 🧰 Utility helpers for tasks like JWT handling, time calculations, and error formatting.  
  _Examples:_ `error.util.ts`, `jwt.util.ts`, `time.util.ts`

- **`app.ts`**: 🚀 Main application setup and Express app configuration.

- **`server.ts`**: 🖥️ Starts and configures the server instance.

---

### 📦 Backend Dependencies

Main dependencies used in the backend include:

- `@prisma/client: ^6.9.0` – ORM for database operations
- `bcryptjs: ^3.0.2` – For password hashing and verification
- `express: ^5.1.0` – Web framework for building APIs
- `jsonwebtoken: ^9.0.2` – For JWT-based authentication
- `zod: ^3.25.63` – Schema validation for inputs
- _And others — see `package.json` for the complete list._

---

### 🖥️ Frontend

- **`app/`**: 🏠 Contains main pages and routing files.  
  _Examples:_ `login.tsx` (login page), `page.tsx` (root pages)

- **`components/`**: ⚙️ Reusable React components for dialogs, forms, and cards.  
  _Examples:_ `AddCalendarDialog.tsx`, `EventCard.tsx`

- **`utils/`**: 🧩 Helper functions for date manipulation, formatting, and API calls.

- **`dashboard/`**: 📊 Dashboard layout and views to display and manage user schedules and calendars.  
  _Examples:_ `page.tsx`, `layout.tsx`

---

### 📦 Frontend Dependencies

Key frontend dependencies:

- `next: ^15.3.4` – React framework for SSR and routing
- `react: ^19.0.0` – Core library for building user interfaces
- `@radix-ui/react-dialog: ^1.1.14` – Accessible UI primitives for modals and dialogs
- `date-fns: ^4.1.0` – Utility library for date operations
- `tailwind-merge: ^3.3.1` – Utility for merging Tailwind CSS classes
- _See `package.json` for full details._

---

## ✨ Features

- 🔐 **Authentication:** Secure user registration and login with JWT.
- 📅 **Calendar Management:** Create, view, update, and delete calendars.
- 🗓️ **Event Scheduling:** Manage single or recurring events.
- 👥 **Attendee Tracking:** Add, remove, and update event attendees.
- ⏰ **Working Hours:** Define and control user-specific working schedules.
- 📌 **Scheduling:** Generate and fetch schedules based on user availability.

---

## ⚙️ Setup & Run

Follow these steps to run the project locally:

1. Clone the repository.
2. Install backend dependencies:

 ```bash
 npm install
 ```
   
Install frontend dependencies:

```bash
cd frontend && npm install
```

Run the backend:

```bash
npm run start
```

Run the frontend:

```bash
npm run dev
```

