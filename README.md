# B2B Template with Commet Billing

A simple template to test and demonstrate Commet's billing features. Shows how to integrate seat management and usage tracking in a Next.js app.

## What's Included

- **Commet Integration**: Working examples of customers, seats, and usage tracking
- **Interactive Demo**: `/dashboard` page to test all Commet features
- **Server Actions**: Clean patterns for Commet SDK calls
- **Type Safety**: Auto-generated types from Commet CLI
- **Basic Auth**: Simple org structure with Better Auth
- **UI Components**: Pre-built forms using shadcn/ui

## Project Structure

```
.
├── apps
│   └── dashboard              # Main SaaS application
│       ├── src
│       │   ├── app            # Next.js App Router
│       │   │   ├── (private)  # Protected routes (dashboard, demo)
│       │   │   ├── (auth)     # Auth routes (login, invitations)
│       │   │   └── api        # API routes
│       │   └── modules
│       │       ├── auth       # Authentication logic
│       │       ├── organization # Org management
│       │       ├── dashboard  # Commet demo components
│       │       └── shared     # Shared utilities
│       └── .commet            # Generated Commet types
├── packages
│   ├── database               # Drizzle ORM + schemas
│   ├── ui                     # Shared UI components
│   └── typescript-config      # Shared TS configs
└── docker-compose.yml         # PostgreSQL for local dev
```

## Prerequisites

- Node.js >= 20
- pnpm >= 10.4.1
- Docker (for local PostgreSQL)
- Commet account ([sign up](https://commet.co))

## Getting Started

1. **Clone and install**

```bash
git clone <your-repo-url>
cd sass-b2b-starter
pnpm install
```

2. **Setup database**

```bash
docker-compose up -d
cd packages/database
pnpm db:push
```

3. **Configure environment**

Create `apps/dashboard/.env.local`:

```env
# Better Auth
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000

# Commet
COMMET_API_KEY=your-commet-api-key
```

4. **Setup Commet types**

```bash
cd apps/dashboard
commet login       # Login to Commet
commet link        # Link to your organization
commet pull        # Generate TypeScript types
```

5. **Start development**

```bash
pnpm dev
```

Visit `http://localhost:3000` and create an account to get started.

## Commet Integration Demo

Once logged in, visit `/dashboard` to test Commet's billing features:

### 1. Create Customers
- Create 1, 10, or 50 demo organizations
- Each becomes a Commet customer automatically

### 2. Seat Events
- Add/remove seats for any organization
- Track seat types: `admin_seat`, `editor_seat`, `viewer_seat`, `api_key`

### 3. Usage Events
- Send single or batch usage events
- Event types: `api_call`, `payment_transaction`, `sms_notification`, `analytics_usage`, `data_processing`, `user_activity`

All events appear in your Commet dashboard (sandbox mode) in real-time.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run Biome linter
- `pnpm db:push` - Push database schema (in packages/database)
- `pnpm db:studio` - Open Drizzle Studio

## How It Works

### Customers
When you create an organization, it automatically creates a Commet customer:
```tsx
await commet.customers.create({
  legalName: "Acme Corp",
  displayName: "Acme Corp",
  billingEmail: "billing@acme.com",
  externalId: organizationId,
});
```

### Seat Management
Track seats by type (admin, editor, viewer, API keys):
```tsx
await commet.seats.add({
  customerId: "cus_xxx",
  seatType: "admin_seat",
  count: 5,
});
```

### Usage Tracking
Send usage events for metered billing:
```tsx
await commet.usage.create({
  eventType: "api_call",
  customerId: "cus_xxx",
  properties: [
    { property: "quantity", value: "100" }
  ],
});
```

## Tech Stack

### Core
- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [Better Auth](https://better-auth.com/) - Authentication with organizations
- [Commet](https://commet.co) - Usage-based billing platform
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM
- [PostgreSQL](https://www.postgresql.org/) - Database

### UI
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Radix UI](https://www.radix-ui.com/) - Accessible primitives

### Development
- [Turborepo](https://turbo.build/repo) - Monorepo build system
- [Biome](https://biomejs.dev/) - Linter and formatter
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Environment Variables

### Required

```env
# Better Auth
BETTER_AUTH_SECRET=         # Generate with: openssl rand -base64 32
BETTER_AUTH_URL=            # Your app URL

# Commet
COMMET_API_KEY=             # From Commet dashboard

# Database (auto-configured with docker-compose)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/saas
```

## Learn More

- [Commet Documentation](https://docs.commet.co)
- [Better Auth Documentation](https://better-auth.com/docs)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs)

## License

MIT