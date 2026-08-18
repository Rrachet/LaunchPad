# LaunchPad — Full-Stack Project & Collaboration Platform

> A full-stack application built to demonstrate real-world authentication, relational data modelling, REST APIs, project workflows, and deployment-oriented architecture.

[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

## Project goal

LaunchPad is a portfolio-scale software system focused on the parts of application engineering that matter beyond a UI: **authentication, API design, data modelling, validation, security, deployment, and maintainable structure**.

The repository is intentionally organised as a frontend/backend monorepo so the complete request path can be inspected in one place.

## Engineering highlights

- Password authentication with verification workflows
- Google OAuth through Passport
- Email OTP generation and verification
- PostgreSQL relational data model through Prisma
- Layered Express backend with routes, controllers, middleware, services, and utilities
- React + Vite frontend with routing and REST API integration
- Environment-based secrets and configuration
- Independently deployable frontend and backend

## Architecture

```text
┌──────────────────────────────┐
│       React + Vite UI        │
│   routes · views · state     │
└──────────────┬───────────────┘
               │ HTTPS / REST
               ▼
┌──────────────────────────────┐
│      Node.js + Express       │
│ routes → controllers →       │
│ services → data access       │
└──────────────┬───────────────┘
               │ Prisma
               ▼
┌──────────────────────────────┐
│          PostgreSQL          │
│ users · auth · OTP · project │
│ activity / relational data   │
└──────────────────────────────┘

External integrations
   ├── Google OAuth
   └── Email provider
```

## Repository structure

```text
LaunchPad/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── .env.example
├── render.yaml
├── vercel.json
└── package.json
```

## Technology choices

| Layer | Choice | Reason |
|---|---|---|
| UI | React + Vite | Fast development and a clear component model |
| API | Node.js + Express | Small, explicit HTTP layer |
| Database | PostgreSQL | Strong relational model and production-grade SQL database |
| ORM | Prisma | Typed schema and maintainable data access |
| Auth | bcrypt + JWT/session infrastructure + Passport | Common, inspectable authentication building blocks |
| Email | Nodemailer | Straightforward transactional email integration |

## Local development

### 1. Clone

```bash
git clone https://github.com/Rrachet/LaunchPad.git
cd LaunchPad
```

### 2. Install dependencies

```bash
npm install
npm run install:all
```

### 3. Configure environment variables

Use the supplied `.env.example` files as templates. Keep real database credentials, OAuth secrets, JWT secrets, and email credentials outside Git.

### 4. Start both services

```bash
npm run dev
```

Or run them independently:

```bash
npm run dev:backend
npm run dev:frontend
```

## Validation

Before opening a change for review, the intended validation flow is:

```text
install
  ↓
lint
  ↓
frontend build
  ↓
backend startup / API checks
  ↓
manual authentication-flow verification
```

The project currently has **limited automated backend test coverage**. That is deliberately listed as a roadmap item rather than presented as completed work.

## Security notes

- Secrets belong in environment variables, never in source files.
- OAuth client secrets and database credentials must not be committed.
- Production environment configuration should be supplied by the deployment platform.
- Authentication changes should be tested across both the frontend and backend because the flow crosses service boundaries.

See [`SECURITY.md`](SECURITY.md) for the reporting policy.

## Engineering decisions

### Why PostgreSQL + Prisma?

LaunchPad has relational entities and authentication/audit relationships. PostgreSQL provides a strong relational foundation while Prisma keeps database access explicit and maintainable.

### Why a layered backend?

Routes should describe HTTP endpoints; controllers should coordinate requests; services should own reusable business logic; data access should remain isolated. This makes the system easier to test and extend than putting all logic inside route handlers.

### Why keep frontend and backend deployable separately?

The separation mirrors a common web architecture: the browser application can be served independently while the API scales and deploys on its own lifecycle.

## Current status

**Implemented:** authentication foundation, Google OAuth integration, email OTP flow, PostgreSQL/Prisma persistence, React frontend, API integration, and deployment configuration.

**Next engineering improvements:**

- [ ] Unit tests for authentication and core services
- [ ] Integration tests for critical API flows
- [ ] OpenAPI/Swagger API documentation
- [ ] Role-based authorization middleware hardening
- [ ] Docker-based local development
- [ ] CI pipeline covering lint, build, and tests
- [ ] Structured logging and production observability

## Related repositories

- [LaunchPad-Frontend](https://github.com/Rrachet/LaunchPad-Frontend) — focused frontend repository
- [LaunchPad-Backend](https://github.com/Rrachet/LaunchPad-Backend) — focused backend repository

## Author

**Amarnath Mishra** — Computer Science Engineer focused on backend systems, full-stack development, AI/ML, and production-oriented software engineering.

> **Problem → Architecture → Implementation → Testing → Deployment → Measurement**
