# LaunchPad

### Full-stack product platform — requirements to working system

LaunchPad is the technical-depth project in my product portfolio. It demonstrates how a product idea becomes a working system across **user requirements, workflows, APIs, business logic, data and deployment**.

---

## Product lens

A product manager does not need to implement every line of code, but should understand the system deeply enough to make good trade-offs with engineering.

LaunchPad is designed to show that technical fluency.

```text
USER NEED
   ↓
REQUIREMENT
   ↓
USER FLOW
   ↓
API CONTRACT
   ↓
BUSINESS LOGIC
   ↓
DATA MODEL
   ↓
IMPLEMENTATION
   ↓
VALIDATION
```

## Product questions

When shaping this type of system, I focus on:

- What is the user's primary job-to-be-done?
- What is the smallest useful workflow?
- Which state transitions matter?
- What should happen when an external dependency fails?
- Which data needs to be durable?
- Where should authentication and authorization live?
- What should be measured after launch?

---

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

---

## Product + engineering trade-offs

### Layered architecture

Separating routes, controllers, services and data access makes the system easier to reason about and change as requirements evolve.

### Authentication as product infrastructure

Login, OAuth, sessions and authorization are not merely technical details: they directly affect activation, trust and support burden.

### Configuration boundaries

Environment-specific configuration is kept outside source code so deployment changes do not require product code changes.

### Failure paths are part of the UX

The application considers authentication failures, API failures, database connectivity problems, external-service failures and configuration issues as product scenarios rather than afterthoughts.

---

## Metrics I would instrument

| Funnel stage | Example metric |
|---|---|
| Acquisition | Landing → signup rate |
| Activation | Signup → first successful workflow |
| Engagement | Weekly active users / completed workflows |
| Reliability | API error rate / availability |
| Retention | Returning users completing a workflow |
| Support | Failure-to-resolution time |

These are **proposed metrics**, not claims about production performance.

---

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

---

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

---

## Technical stack

**Frontend:** React + Vite  
**Backend:** Node.js + Express  
**Data:** PostgreSQL + Prisma  
**Auth:** JWT + Google OAuth  
**Delivery:** environment-based configuration + deployment manifests

---

## Why this belongs in a PM portfolio

LaunchPad is evidence of **technical product judgment**: I can translate product requirements into system behaviour, understand engineering constraints, reason about failure states and discuss trade-offs with developers.

**Product requirement → technical architecture → implementation → validation → measurement.**

## License

MIT
