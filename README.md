# Scheduling System Documentation

## Overview

This project is a full-stack scheduling system built with a **TypeScript-based backend** and a **Next.js frontend**.  
It handles **authentication**, **calendar management**, **event scheduling**, **attendee tracking**, and **working hours configuration**.

---

## Project Structure

### Backend

- **`dtos/`**: Contains data transfer objects (DTOs) for various entities  
  _Example:_ `auth.dto.ts`, `calendar.dto.ts`, `event.attendee.dto.ts`

- **`middleware/`**: Middleware for authentication, validation, and error handling  
  _Example:_ `auth.middleware.ts`, `validator.middleware.ts`, `error.middleware.ts`

- **`repositories/`**: Data access layer for entities like calendar, events, and users  
  _Example:_ `calendar.repository.ts`, `event.repository.ts`

- **`routes/`**: API route definitions for authentication, calendar, events, and more  
  _Example:_ `auth.routes.ts`, `calendar.routes.ts`

- **`services/`**: Business logic layer for auth, calendar, event attendees, and others  
  _Example:_ `auth.service.ts`, `calendar.service.ts`

- **`controllers/`**: Controllers handling HTTP requests  
  _Example:_ `AuthController`, `CalendarController`, `EventAttendeeController`

- **`utils/`**: Utility functions for error handling, JWT, and time management  
  _Example:_ `error.util.ts`, `jwt.util.ts`, `time.util.ts`

- **`app.ts`**: Main application file

- **`server.ts`**: Server configuration

---

### Backend Dependencies

- `@prisma/client: ^6.9.0`
- `bcryptjs: ^3.0.2`
- `express: ^5.1.0`
- `jsonwebtoken: ^9.0.2`
- `zod: ^3.25.63`
- _And more (see `package.json`)_

---

### Frontend

- **`app/`**: Contains pages and components  
  _Example:_ `login.tsx`, `page.tsx`

- **`components/`**: Reusable UI components  
  _Example:_ `AddCalendarDialog.tsx`, `EventCard.tsx`

- **`utils/`**: Utility functions for the frontend

- **`dashboard/`**: Dashboard-related files  
  _Example:_ `page.tsx`, `layout.tsx`

---

### Frontend Dependencies

- `next: ^15.3.4`
- `react: ^19.0.0`
- `@radix-ui/react-dialog: ^1.1.14`
- `date-fns: ^4.1.0`
- `tailwind-merge: ^3.3.1`
- _And more (see `package.json`)_

---

## Features

- **Authentication**: User registration and login via `AuthController`
- **Calendar Management**: Create, read, update, and delete calendars via `CalendarController`
- **Event Scheduling**: Manage events and recurrences with `EventController` and `EventRecurrenceController`
- **Attendee Tracking**: Add, update, and delete attendees for events via `EventAttendeeController`
- **Working Hours**: Configure and manage working hours with `WorkingHoursController`
- **Scheduling**: Create and retrieve schedules via `ScheduleController`

---

## Setup

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

