# Security Policy

## Scope

This repository is a portfolio and engineering project. Security issues in authentication, authorization, secret handling, API validation, or deployment configuration are taken seriously.

## Reporting

Please do not publish credentials, tokens, or exploitable details in a public issue.

For a real vulnerability, contact the project owner privately through the email listed on the GitHub profile and include:

- affected component
- reproduction steps
- expected vs actual behaviour
- impact assessment
- any suggested mitigation

## Secret handling

Never commit:

- database credentials
- OAuth client secrets
- JWT/session secrets
- email-provider credentials
- AI/provider API keys
- production environment files containing secrets

Use `.env.example` files only for variable names and safe placeholders.

## Development expectation

Authentication and security changes should be validated across the complete frontend → API → database/integration path rather than only through isolated UI testing.
