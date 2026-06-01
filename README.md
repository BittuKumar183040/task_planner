# Task Planner

A modern team-based task management platform built with Next.js, TypeScript, Prisma, tRPC, and NextAuth.

---

## Overview

Task Planner is a collaborative project and task management application designed to help teams organize work, assign responsibilities, track progress, and monitor productivity through dashboards and analytics.

The application supports:

* User Authentication
* Team Management
* Task Creation and Assignment
* Team-Based Workspaces
* Dashboard Analytics
* Role-Based Membership
* Real-Time Task Organization

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* TailwindCSS
* Recharts

## Backend

* tRPC
* Prisma ORM
* PostgreSQL (Supabase)

## Authentication

* NextAuth
* Credentials Provider
* JWT Session Strategy
* Bcrypt Password Hashing

---

# Features

## Authentication

### User Registration

Users can create accounts using:

* Name
* Username
* Email
* Password

Passwords are securely stored using bcrypt hashing.

### Login

Users can authenticate using:

* Email
* Username
* Password

JWT-based sessions are used for maintaining authenticated user state.

---

## Team Management

Users can:

* Create teams
* Join teams
* Switch active teams
* View team members

Each team contains:

* Name
* Description
* Member Count

---

## Task Management

### Create Tasks

Tasks support:

* Title
* Description
* Status
* Priority
* Deadline
* Assigned User
* Team Association

### Update Tasks

Users can:

* Modify task details
* Change status
* Reassign tasks
* Update deadlines

### Delete Tasks

Authorized users may remove tasks from a team.

---

## Dashboard

The dashboard provides analytics including:

### User Metrics

* Assigned Tasks
* Created Tasks
* Completed Tasks

### Team Metrics

* Team Member Count
* Team Activity

### Visualizations

#### Task Status Distribution

Displays:

* New Tasks
* Active Tasks
* Completed Tasks

#### Priority Distribution

Displays:

* Low Priority
* Medium Priority
* High Priority

---

# Project Architecture

## High-Level Architecture

Client (React + Next.js)
↓
tRPC API Layer
↓
Business Logic
↓
Prisma ORM
↓
PostgreSQL Database

---

# Folder Structure

```
src/
│
├── pages/
│   ├── signin.tsx
│   ├── signup.tsx
│   ├── dashboard.tsx
│   ├── tasks.tsx
│   └── settings.tsx
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── tasks/
│   ├── teams/
│   └── ui/
│
├── server/
│   ├── api/
│   │   ├── routers/
│   │   └── trpc.ts
│   │
│   ├── auth.ts
│   └── db.ts
│
├── utils/
│   ├── api.ts
│   └── team.ts
│
└── styles/
```

---

# Database Design



# API Architecture

The application uses tRPC.

Benefits:

* End-to-End Type Safety
* Automatic Type Inference
* Shared Types between Client and Server

Routers:

```
userRouter
taskRouter
teamRouter
dashboardRouter
```

---

# Authentication Flow

1. User submits credentials
2. NextAuth validates credentials
3. Password verified using bcrypt
4. JWT generated
5. Session returned to client

Flow:

```
Login
↓
Credentials Provider
↓
Prisma User Lookup
↓
Bcrypt Validation
↓
JWT Token
↓
Session
```

# Security

## Password Security

Passwords are hashed using bcrypt.

Example:

```
bcrypt.hash(password, 10)
```

Passwords are never stored in plain text.

---

## Route Protection
Protected pages require authentication.

Examples:
* Dashboard
* boards
* Settings

Implemented using:
* NextAuth Middleware
* Protected tRPC Procedures

### API Routes
* User Router
* Team Router
* Task Router
* Task Member Router

---

# Local Development Setup

## Prerequisites

Install:

* Node.js >= 18
* PostgreSQL
* npm

---

## Installation

Clone repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create:

```
.env
```

Example:

```env
DATABASE_URL=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
NODE_ENV=development
```

## Database Setup

Generate Prisma Client:

```bash
npm run db:generate
```

Apply migrations:

```bash
npm run db:migrate
```
## Running Development Server

```bash
npm run dev
http://localhost:3000
```

# Build

Create production build:

```bash
npm run build
npm start
```

# Future Improvements
* Email Verification
* Notifications
* Password Reset
* Drag-and-Drop Boards
* Team Roles & Permissions

---

# Author
Bittu Kumar