# Fidea Backend — NestJS

Backend scaffold for the Fidea frontend pages using the requested stack:

- **Framework:** NestJS / Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** JWT with role-based access control
- **Payments:** Flutterwave
- **Queues:** BullMQ + Redis
- **Jobs:** NestJS Schedule
- **Logging:** Pino via `nestjs-pino`
- **Email:** Nodemailer
- **Docs:** Swagger / OpenAPI

## Quick start

```bash
cp .env.example .env
docker compose up -d
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed
npm run start:dev
```

API base URL: `http://localhost:4000/api/v1`

Swagger docs: `http://localhost:4000/docs`

## Seeded admin

```txt
Email: admin@fidea.local
Password: Admin@12345
```

## Core endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

### Account

- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `PATCH /api/v1/users/me/password`

### Products

- `GET /api/v1/products`
- `GET /api/v1/products/categories`
- `GET /api/v1/products/:slug`
- `POST /api/v1/products` — admin only

### Orders

- `POST /api/v1/orders`
- `GET /api/v1/orders/track/:orderNumber?email=customer@example.com`
- `GET /api/v1/orders/mine`
- `GET /api/v1/orders` — admin only
- `POST /api/v1/orders/:orderNumber/cancel`

### Payments

- `POST /api/v1/payments/initialize`
- `POST /api/v1/payments/verify`
- `POST /api/v1/payments/flutterwave/webhook`

### Newsletter

- `POST /api/v1/newsletter/subscribe`

## Notes

- Flutterwave calls are implemented against `/v3/payments` and `/v3/transactions/:id/verify`.
- Webhook verification uses the `verif-hash` header and `FLUTTERWAVE_WEBHOOK_HASH`.
- BullMQ currently processes transactional email jobs and can be extended for stock sync, payment reconciliation, and invoice generation.
- A scheduled job cancels orders still pending after 24 hours.
