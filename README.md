# LaunchPad — Full-Stack Project & Collaboration Platform

> A production-oriented full-stack application built to demonstrate authentication, secure user flows, project management, analytics, and modern web architecture.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

## Why I built this

LaunchPad is a portfolio-scale software project focused on the parts of application engineering that matter beyond a UI: authentication, data modeling, API design, validation, security, deployment, and maintainable project structure.

## Engineering highlights

- **Authentication:** password-based authentication with verification flows.
- **Google OAuth:** Passport-based Google sign-in integration.
- **OTP workflows:** email OTP generation and verification for account security.
- **Database:** PostgreSQL with Prisma ORM and relational models.
- **Backend architecture:** controllers, routes, middleware, services, utilities, and configuration separated by responsibility.
- **Frontend:** React + Vite with client-side routing, API integration, and data visualisation.
- **Security:** bcrypt password hashing, environment-based secrets, authenticated flows, and session/JWT infrastructure.
- **Deployment:** production configuration for separately deployable frontend/backend services.

## Architecture

```text
React / Vite Frontend
        │
        │ REST API
        ▼
Node.js / Express Backend
        │
   ┌────┼─────────────┐
   ▼    ▼             ▼
Prisma Auth/OAuth   Email/OTP
   │
   ▼
PostgreSQL
```

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios, Recharts |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Data access | Prisma ORM |
| Authentication | bcrypt, JWT/session infrastructure, Passport, Google OAuth |
| Email | Nodemailer |
| Deployment | Vercel / Render configuration |

## Core data model

The backend models users, login activity, email OTPs, and projects. User records support password verification, email verification, Google identity, roles, and account timestamps.

## Running locally

### 1. Clone

```bash
git clone https://github.com/Rrachet/LaunchPad.git
cd LaunchPad
```

### 2. Configure environment variables

Create the required environment files from the provided `.env.example` files. Do not commit secrets.

### 3. Start the backend

```bash
cd backend
npm install
npm run dev
```

### 4. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The exact OAuth, database, and email credentials depend on your local environment.

## Engineering decisions

### Why PostgreSQL + Prisma?

The application has relational entities and authentication/audit relationships, so PostgreSQL provides a strong foundation while Prisma keeps database access typed and maintainable.

### Why a layered backend?

Separating routes, controllers, middleware, services, and utilities makes the API easier to test, extend, and reason about than putting business logic directly into route handlers.

## What I learned

- Designing authentication flows across frontend and backend.
- Modeling relational application data with Prisma.
- Integrating third-party OAuth providers.
- Handling asynchronous email verification workflows.
- Structuring a Node.js backend for maintainability.
- Connecting a React application to a real REST API.
- Preparing full-stack applications for deployment.

## Roadmap

- [ ] Automated unit and integration test suite
- [ ] API documentation with OpenAPI/Swagger
- [ ] Role-based authorization middleware
- [ ] Docker-based local development
- [ ] CI pipeline for lint, test, and build
- [ ] Observability and structured application logging

## Author

**Amarnath Mishra** — Computer Science Engineer focused on full-stack development, backend systems, AI/ML, and production-oriented software engineering.

[GitHub](https://github.com/Rrachet)