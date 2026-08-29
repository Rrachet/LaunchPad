# LaunchPad — Full-Stack Project & Collaboration Platform

> **A full-stack system demonstrating authentication, API design, relational data modelling and deployment-oriented engineering.**

LaunchPad is the main engineering-focused application in my portfolio. It is intentionally built beyond a UI demo so the complete request path can be inspected: **React → REST API → business logic → PostgreSQL**.

[![Frontend](https://img.shields.io/badge/React%20%2B%20Vite-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/) [![Backend](https://img.shields.io/badge/Node.js%20%2B%20Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/) [![Database](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![ORM](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)

## Engineering highlights

- Password authentication and verification workflows
- Google OAuth through Passport
- Email OTP generation and verification
- PostgreSQL relational modelling through Prisma
- Layered Express backend: routes → controllers → services → data access
- React + Vite frontend with API integration
- Environment-based configuration and secrets
- Separate frontend/backend deployment configuration

## Architecture

```text
┌───────────────────────────┐
│       React + Vite        │
│       UI / routing        │
└─────────────┬─────────────┘
              │ HTTPS / REST
              ▼
┌───────────────────────────┐
│      Node + Express       │
│ routes → controllers →    │
│ services → data access    │
└─────────────┬─────────────┘
              │ Prisma
              ▼
┌───────────────────────────┐
│        PostgreSQL         │
│ users · auth · projects   │
│ activity / relations      │
└───────────────────────────┘
```

External integrations include Google OAuth and transactional email.

## Why this project matters

The objective is to demonstrate engineering decisions that matter beyond building a page:

**requirements → architecture → implementation → validation → deployment**

The backend is deliberately layered so HTTP concerns, business logic and data access remain separable and easier to evolve.

## Repository structure

```text
backend/
├── controllers/
├── middleware/
├── prisma/
├── routes/
├── services/
└── utils/

frontend/
├── src/
└── public/

.env.example
render.yaml
vercel.json
package.json
```

## Run locally

### 1. Clone

```bash
git clone https://github.com/Rrachet/LaunchPad.git
cd LaunchPad
```

### 2. Install

```bash
npm install
npm run install:all
```

### 3. Configure environment

Use the provided `.env.example` files. Keep database credentials, OAuth secrets, JWT secrets and email credentials outside Git.

### 4. Start

```bash
npm run dev
```

Or separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Validation

The intended development flow is:

```text
install
  ↓
lint
  ↓
frontend build
  ↓
backend startup / API checks
  ↓
authentication-flow verification
```

Automated backend coverage is still an improvement area; it is intentionally not presented as completed functionality.

## Security

- Secrets stay in environment variables.
- OAuth and database credentials must never be committed.
- Production configuration belongs in the deployment environment.
- Authentication changes should be validated across both frontend and backend.

See [`SECURITY.md`](SECURITY.md).

## Roadmap

- [ ] Unit tests for authentication and core services
- [ ] Integration tests for critical API flows
- [ ] OpenAPI / Swagger documentation
- [ ] Stronger role-based authorization
- [ ] Docker-based local development
- [ ] CI pipeline for lint, build and tests
- [ ] Structured logging and observability

## Related repositories

- [LaunchPad-Frontend](https://github.com/Rrachet/LaunchPad-Frontend)
- [LaunchPad-Backend](https://github.com/Rrachet/LaunchPad-Backend)

## Built by

**Amarnath Mishra** — Product Analyst / Product Builder with a full-stack engineering background.

## License

MIT
