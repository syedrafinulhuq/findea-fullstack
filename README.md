# Findea — Full-Stack E-Commerce Platform

A production-grade e-commerce platform built with **Next.js** (frontend) and **NestJS** (backend), featuring JWT authentication, Flutterwave payments, BullMQ job queues, and a full order lifecycle.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
  - [Backend](#backend-env)
  - [Frontend](#frontend-env)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Architecture Overview](#architecture-overview)
- [Contributing](#contributing)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS 4 |
| UI Components | Base UI, shadcn/ui, Framer Motion, Embla Carousel |
| Backend | NestJS 10, TypeScript |
| Database | PostgreSQL 16 + Prisma ORM |
| Auth | JWT (access 15m / refresh 7d), Argon2 hashing |
| Payments | Flutterwave |
| Queue | BullMQ + Redis 7 |
| Email | Nodemailer |
| API Docs | Swagger / OpenAPI |
| Infrastructure | Docker Compose |

---

## Project Structure

```
findea-fullstack/
├── frontend/          # Next.js customer-facing application
└── backend/           # NestJS REST API
```

### Frontend

```
frontend/
└── app/
    ├── (landing)/             # Public marketing pages
    │   ├── page.tsx           # Home page
    │   ├── about/             # About page
    │   └── products/          # Product listing & filters
    ├── login/                 # Authentication
    ├── register/
    ├── account/               # User dashboard
    ├── order/                 # Checkout
    ├── track-order/           # Guest order tracking
    ├── lost-password/         # Password recovery
    ├── reset-password/
    └── api/                   # Next.js route handlers (proxy to backend)
        ├── auth/
        ├── products/
        ├── users/
        └── orders/
```

### Backend

```
backend/src/
├── auth/          # JWT auth, guards, strategies
├── users/         # Profile & password management
├── products/      # Product catalog + categories
├── orders/        # Order lifecycle
├── payments/      # Flutterwave integration + webhooks
├── newsletter/    # Subscription management
├── mail/          # Nodemailer email service
├── queue/         # BullMQ setup
├── jobs/          # Scheduled tasks (auto-cancel orders)
├── prisma/        # Prisma service + schema
└── common/        # Decorators, guards, filters, interceptors
```

---

## Features

### Storefront
- Product catalog with category filters, search, and pagination
- Product detail pages with slug-based routing
- Responsive design with Framer Motion animations
- Announcement bar, testimonials, newsletter signup, Instagram feed

### Authentication & Users
- Register / login with email and password
- JWT access and refresh token rotation
- Password reset via emailed token (with expiry)
- Profile and password management
- Shipping address management with default address selection

### Orders & Checkout
- Multi-item order creation (authenticated or guest)
- Unique order number generation
- Full order status pipeline: `PENDING → PAID → PROCESSING → SHIPPED → DELIVERED`
- Order tracking by order number + email (no login required)
- Order cancellation with reason
- Scheduled job auto-cancels unpaid orders after 24 hours (runs daily at midnight)

### Payments
- Flutterwave payment initialization and verification
- Webhook handler with hash signature verification
- Full payment record with transaction reference and raw response storage

### Admin
- Role-based access control (`CUSTOMER` / `ADMIN`)
- Admin product creation
- Admin order management view

### Infrastructure
- BullMQ queue for async email processing
- Pino structured logging
- Helmet security headers
- Swagger docs at `/docs`
- Docker Compose for Postgres and Redis

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm (frontend) / npm (backend)
- Docker & Docker Compose

### Backend Setup

```bash
cd backend

# 1. Copy environment file and fill in values
cp .env.example .env

# 2. Start Postgres (port 5433) and Redis (port 6379)
docker compose up -d

# 3. Install dependencies
npm install

# 4. Generate Prisma client and run migrations
npm run prisma:generate
npm run prisma:migrate -- --name init

# 5. Seed the database (creates an admin account)
npm run seed

# 6. Start the development server
npm run start:dev
```

The API will be available at `http://localhost:4000/api/v1`.  
Swagger documentation: `http://localhost:4000/docs`

**Seeded admin credentials**

| Field | Value |
|---|---|
| Email | `admin@fidea.local` |
| Password | `Admin@12345` |

### Frontend Setup

```bash
cd frontend

# 1. Install dependencies
pnpm install

# 2. Create a local env file
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# 3. Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend (`backend/.env`) {#backend-env}

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` \| `production` |
| `PORT` | Server port (default `4000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL (e.g. `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL (e.g. `7d`) |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_PASSWORD` | Redis password (optional) |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `MAIL_FROM` | From address for outgoing emails |
| `FRONTEND_URL` | Frontend origin (for CORS and email links) |
| `FLUTTERWAVE_SECRET_KEY` | Flutterwave secret key |
| `FLUTTERWAVE_PUBLIC_KEY` | Flutterwave public key |
| `FLUTTERWAVE_ENCRYPTION_KEY` | Flutterwave encryption key |
| `FLUTTERWAVE_WEBHOOK_HASH` | Webhook signature verification hash |

### Frontend (`frontend/.env.local`) {#frontend-env}

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the Next.js app itself (used by route handlers to proxy to the backend) |

---

## API Reference

Base path: `/api/v1`  
Full interactive docs: `http://localhost:4000/docs`

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Login, returns access + refresh tokens |
| POST | `/auth/refresh` | Refresh token | Rotate tokens |
| POST | `/auth/forgot-password` | — | Send password reset email |
| POST | `/auth/reset-password` | — | Reset password with token |

### Users

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users/me` | JWT | Get current user profile |
| PATCH | `/users/me` | JWT | Update profile |
| PATCH | `/users/me/password` | JWT | Change password |

### Products

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/products` | — | List products (filter, paginate) |
| GET | `/products/categories` | — | List all categories |
| GET | `/products/:slug` | — | Get single product |
| POST | `/products` | Admin | Create product |

### Orders

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/orders` | Optional JWT | Create an order |
| GET | `/orders/mine` | JWT | List current user's orders |
| GET | `/orders/track/:orderNumber` | — | Track order by number + email |
| POST | `/orders/:orderNumber/cancel` | JWT | Cancel an order |
| GET | `/orders` | Admin | List all orders |

### Payments

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/initialize` | JWT | Initialize a Flutterwave payment |
| POST | `/payments/verify` | JWT | Verify payment after redirect |
| POST | `/payments/flutterwave/webhook` | — | Flutterwave webhook receiver |

### Newsletter

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/newsletter/subscribe` | — | Subscribe an email address |

---

## Database Schema

```
User ─┬─< Address
      └─< Order ─< OrderItem >─ Product >─ Category
               └─< Payment
```

**Key models:**

- **User** — email, argon2 hashed password, name, phone, role (`CUSTOMER` / `ADMIN`), refresh token, reset token
- **Address** — street, city, country, isDefault, belongs to User
- **Category** — name, slug
- **Product** — name, slug, price (Decimal), stock, description, image, active, belongs to Category
- **Order** — orderNumber, status, subtotal, deliveryFee, total, shipping snapshot, belongs to User (nullable for guests)
- **OrderItem** — quantity, unitPrice, belongs to Order + Product
- **Payment** — txRef, amount, status (`PENDING` / `SUCCESS` / `FAILED` / `CANCELLED`), rawResponse, belongs to Order
- **NewsletterSubscriber** — email (unique)

Order statuses: `PENDING → PAID → PROCESSING → SHIPPED → DELIVERED` (or `CANCELLED` / `REFUNDED`)

---

## Architecture Overview

```
Browser
  │
  ▼
Next.js (port 3000)
  │  App Router pages + layouts
  │  /app/api/* route handlers (thin proxy)
  │
  ▼  HTTP
NestJS API (port 4000)
  │  /api/v1/*
  │
  ├──► PostgreSQL 16 (via Prisma)
  ├──► Redis 7      (via BullMQ)
  └──► Flutterwave  (payments)
       SMTP server  (email)
```

The Next.js API route handlers act as a lightweight proxy so the browser never talks directly to the backend — all requests go through `localhost:3000/api/*` which forwards to `localhost:4000/api/v1/*`. This keeps credentials server-side and simplifies CORS.

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a pull request

Please follow the existing code style and ensure the project builds without errors before submitting.
