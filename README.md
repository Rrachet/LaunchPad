# LaunchPad — Full-Stack Application Platform

> **A full-stack application demonstrating APIs, authentication, relational data, configuration and deployment-oriented engineering.**

LaunchPad is the engineering-depth project in my IBM-focused portfolio. It demonstrates the application layer underneath support and operations work: a request travels from **React → REST API → business logic → PostgreSQL**.

## Why it matters for application support

A support engineer needs to understand what an application is made of before diagnosing a problem. LaunchPad provides that foundation:

- REST API design and integration
- Layered Express architecture
- PostgreSQL relational data modelling
- Authentication and authorization flows
- Environment-based configuration
- External service integration
- Separate frontend/backend deployment concerns

## Architecture

```text
React + Vite
     │
     │ HTTPS / REST
     ▼
Node + Express
routes → controllers → services → data access
     │
     │ Prisma
     ▼
PostgreSQL
users · auth · projects · activity
```

External integrations include Google OAuth and transactional email.

## Operational scenarios

The application provides useful scenarios for support-oriented investigation:

- Authentication failures
- OAuth configuration problems
- Database connectivity issues
- Invalid environment configuration
- API request failures
- External service failures
- Frontend/backend integration problems

The troubleshooting principle is:

```text
User symptom
    ↓
Reproduce
    ↓
Identify affected layer
    ↓
Check configuration / logs / dependency
    ↓
Apply safe remediation
    ↓
Validate
    ↓
Document / escalate
```

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

```bash
git clone https://github.com/Rrachet/LaunchPad.git
cd LaunchPad
npm install
npm run install:all
```

Configure the provided `.env.example` files, then:

```bash
npm run dev
```

Or separately:

```bash
npm run dev:backend
npm run dev:frontend
```

## Validation

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

Automated backend coverage remains a future improvement and is not presented as completed functionality.

## Security

- Secrets stay in environment variables.
- OAuth/database credentials must never be committed.
- Production configuration belongs in the deployment environment.
- Authentication changes should be validated across frontend and backend.

See [`SECURITY.md`](SECURITY.md).

## Portfolio role

**ENGINEER — application architecture and troubleshooting depth**

LaunchPad complements [ThriiLocal](https://github.com/Rrachet/ThriiLocal), [SupportHub](https://github.com/Rrachet/SupportHub) and [APIAtlas](https://github.com/Rrachet/apiatlas): build the application, understand its dependencies, monitor it, support users and investigate failures.

## License

MIT
