# Task Planner

A modern team-based task management platform built with Next.js, TypeScript, Prisma, tRPC, and NextAuth.

---

## Overview

Task Planner is a collaborative project and task management application designed to help teams organize work, assign responsibilities, track progress, and monitor productivity through dashboards and analytics.

<img width="1920" height="1080" alt="ezgif com-animated-gif-maker" src="https://github.com/user-attachments/assets/c8cc29ff-25c9-4864-a289-748ed46ec8b9" />


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

Client (React + Next.js) -> tRPC API Layer -> Business Logic -> Prisma ORM -> PostgreSQL Database

---

# Folder Structure

```
src/
│
├── pages/
│   ├── signin/
│   ├── signup/
│   ├── dashboard/
│   ├── tasks/
│   └── settings/
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

<img width="557" height="617" alt="ezgif com-crop" src="https://github.com/user-attachments/assets/8625ecc2-a856-4b04-b2e2-dcb8056c3abd" />

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
# User Flows
```
1. Register     → Create Team            → Dashboard           → User Board   → Team Board
2. Login        → Dashboard              → User Board          → Team Board
3. Dashboard    → Create Team            → Team Created        → Team Board
4. Dashboard    → Switch Team            → Active Team Updated → Dashboard Reloaded
5. Team Board   → Create Task            → Assign Member       → Set Priority → Set Deadline → Save Task
6. Team Board   → Select Task            → Edit Task           → Save Changes → Board Updated
7. Create Task  → Select Assignee        → Save Task           → Assignee Receives Task
8. Team Board   → Open Task              → Change Status       → Save         → Dashboard Statistics Updated
9. Settings     → Update Profile         → Save Changes        → Profile Updated
10. Settings    → Update Avatar Seed     → Preview Avatar      → Save Avatar
11. Settings    → Change Password        → Save Password       → Login With New Password
12. Team Board  → View Members           → Fetch Team Members  → Display Member Statistics
13. Dashboard   → Load Team Metrics      → Render Charts       → Display Analytics
14. Any Page    → Sign Out               → Session Cleared     → Redirect To Sign In
15. Unauth User → Access Protected Route → Middleware Check    → Redirect To Sign In
```
# Authentication Flow

1. User submits credentials
2. NextAuth validates credentials
3. Password verified using bcrypt
4. JWT generated
5. Session returned to client

Flow:

```
Login ->  Credentials Provider -> Prisma User Lookup -> Bcrypt Validation -> JWT Token -> Session
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
