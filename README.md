# Event Buddy – Event Booking System

**Full Stack Application (Next.js + NestJS + PostgreSQL)**

Event Buddy is a full-stack event booking system that allows users to browse, book, and manage event tickets, while administrators can create and manage events through a separate dashboard. The project includes authentication, role-based access control, and validation on both client and server sides.



## Overview

This project consists of two parts:

- **Frontend**: Next.js application (TypeScript + Tailwind CSS)
- **Backend**: NestJS API server (TypeScript + Prisma + PostgreSQL)



## Features

### Public (Unauthenticated Users)

- View upcoming and past events
- View event details
- Redirect to login or signup when attempting to book

### Authenticated Users

- Book 1–4 seats for upcoming events
- Booking restricted if:

  - The event date has passed
  - The requested seats exceed available capacity

- View and cancel bookings in the personal dashboard

### Admin Users

- Create, edit, and delete events
- View all events with booking counts
- Manage events from the admin dashboard



## Technology Stack

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Frontend       | Next.js, Tailwind CSS, TypeScript, Axios |
| Backend        | NestJS, Prisma ORM, TypeScript           |
| Database       | PostgreSQL                               |
| Authentication | JWT (Bearer Token)                       |



## Project Structure

```
event-buddy/
 ├── backend/
 │   ├── src/
 │   ├── prisma/
 │   ├── package.json
 │   └── .env
 └── frontend/
     ├── src/
     ├── package.json
     └── .env.local
```



## Prerequisites

- Node.js (version 18 or above)
- npm or yarn
- PostgreSQL database
- Railway or local database setup (optional)



## Backend Setup (NestJS)

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   npm install
   ```

2. **Create an environment file:**
   Create a `.env` file inside `backend/` with the following variables:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   JWT_SECRET="your_jwt_secret"
   PORT=5000
   ```

3. **Initialize Prisma:**

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run the server:**

   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:5000`.

### Available Endpoints

| Method | Endpoint         | Description                     |
| ------ | ---------------- | ------------------------------- |
| POST   | `/auth/register` | Register a new user             |
| POST   | `/auth/login`    | Authenticate user and issue JWT |
| GET    | `/auth/me`       | Get authenticated user details  |
| GET    | `/events`        | List all events                 |
| POST   | `/events`        | Create new event (Admin only)   |
| PUT    | `/events/:id`    | Edit event (Admin only)         |
| DELETE | `/events/:id`    | Delete event (Admin only)       |
| POST   | `/bookings`      | Book seats for an event         |
| GET    | `/bookings/me`   | Retrieve user’s bookings        |
| DELETE | `/bookings/:id`  | Cancel booking                  |


## Frontend Setup (Next.js)

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   npm install
   ```

2. **Create an environment file:**
   Create a `.env.local` file inside `frontend/` with the following variable:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`.



## Roles and Permissions

| Role  | Description                         |
| ----- | ----------------------------------- |
| USER  | Can browse and book events          |
| ADMIN | Can create, edit, and delete events |

To assign the admin role manually, execute the following SQL command:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@example.com';
```


## Common Commands

| Purpose                 | Command                  |
| ----------------------- | ------------------------ |
| Generate Prisma client  | `npx prisma generate`    |
| Run database migrations | `npx prisma migrate dev` |
| Open Prisma Studio      | `npx prisma studio`      |
| Start backend server    | `npm run start:dev`      |
| Start frontend server   | `npm run dev`            |


## Submission Checklist

- Functional frontend and backend integration
- Responsive UI (mobile and desktop)
- Authentication with JWT
- Complete booking logic and validation
- Admin event management functionality
- Proper documentation with setup instructions



**End of Document**
This README provides a complete reference for setting up, running, and maintaining the Event Buddy project.
