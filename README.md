# Siro Admin Nuxt

Production-ready admin frontend starter for [SiroPHP](https://sirophp.com) APIs.

Built with Nuxt 3, Vue 3, TypeScript, TailwindCSS, shadcn-vue (Radix Vue), Vue Query, Pinia, and vee-validate.

## Features

- **Authentication** — JWT login, refresh token, auto-persistence, Axios interceptor with 401 handling
- **Dashboard** — Stats cards, activity feed, API status widget
- **CRUD System** — Reusable data table, search, sort, pagination, form dialogs, delete confirmation
- **Users Module** — Full example: list, create, edit, delete, search, filter, pagination, role/status badges
- **Dark Mode** — System-aware theme with toggle (`@nuxtjs/color-mode`)
- **Responsive** — Mobile sidebar drawer, adaptive layouts
- **Type-Safe** — Full TypeScript with Zod + vee-validate
- **API-First** — Clean service layer with Axios

## Quick Start

```bash
# 1. Clone
git clone <repo-url> siro-admin-nuxt
cd siro-admin-nuxt

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit NUXT_PUBLIC_API_URL to point to your SiroPHP backend

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

```env
NUXT_PUBLIC_API_URL=http://localhost:8080
NUXT_PUBLIC_APP_NAME=Siro Admin
```

## API Connection

The admin expects a SiroPHP backend at `NUXT_PUBLIC_API_URL` with these endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login |
| `/api/auth/refresh` | POST | Refresh token |
| `/api/auth/me` | GET | Current user |
| `/api/auth/logout` | POST | Logout |
| `/api/users` | GET | List users |
| `/api/users` | POST | Create user |
| `/api/users/{id}` | GET | Get user |
| `/api/users/{id}` | PUT | Update user |
| `/api/users/{id}` | DELETE | Delete user |
| `/api/dashboard/stats` | GET | Dashboard stats |

## Auth Flow

1. User logs in → backend returns `access_token`, `refresh_token`, `user`
2. Tokens stored in `localStorage`
3. Axios interceptor injects `Bearer` token on every request
4. On 401, interceptor automatically tries refresh token
5. If refresh fails, user is redirected to `/login`
6. Auth middleware protects dashboard routes

## Project Structure

```
src/
├── app.vue                    # Root component
├── assets/css/main.css        # Tailwind + CSS variables
├── components/
│   ├── ui/                    # shadcn-vue (Radix Vue) components
│   ├── data-table/            # DataTable, Pagination
│   ├── dialogs/               # DeleteDialog
│   ├── forms/                 # SearchInput
│   ├── states/                # LoadingSkeleton, EmptyState, ErrorState, StatsSkeleton
│   └── layout/                # Sidebar, Header, UserNav, MobileSidebar, PageHeader, StatusBadge
├── composables/
│   ├── useAuth.ts             # Auth composable (login, logout, session)
│   ├── useUsers.ts            # Users CRUD composables
│   ├── useDashboard.ts        # Dashboard composable
│   ├── useDebounce.ts         # Debounce utility
│   └── useToast.ts            # Toast notifications
├── layouts/
│   ├── default.vue            # Main dashboard layout
│   └── auth.vue               # Auth layout (login)
├── middleware/
│   └── auth.ts                # Route auth guard
├── modules/
│   ├── auth/schemas/          # Login schema (Zod)
│   └── users/
│       ├── components/        # UserTable, UserForm, UserFormDialog
│       └── schemas/           # User schemas (Zod)
├── pages/
│   ├── login.vue              # Login page
│   ├── index.vue              # Dashboard overview
│   ├── users/index.vue        # Users CRUD page
│   ├── orders.vue             # Placeholder
│   ├── products.vue           # Placeholder
│   ├── posts.vue              # Placeholder
│   └── settings.vue           # Placeholder
├── plugins/
│   └── vue-query.ts           # Vue Query plugin
├── services/
│   ├── api.ts                 # Axios instance + interceptors
│   ├── auth.service.ts        # Auth API calls
│   ├── users.service.ts       # Users API calls
│   └── dashboard.service.ts   # Dashboard API calls
├── stores/
│   ├── auth.store.ts          # Pinia auth store
│   └── ui.store.ts            # Pinia UI store (sidebar state)
├── types/
│   ├── api.ts                 # API response types
│   ├── auth.ts                # Auth types
│   ├── user.ts                # User types
│   └── dashboard.ts           # Dashboard types
├── utils/index.ts             # cn(), formatDate(), formatNumber()
└── constants/index.ts         # App constants
```

## Adding a New Module

1. **Types** — Add type in `src/types/`
2. **Service** — Add API calls in `src/services/`
3. **Composables** — Add Vue Query composable in `src/composables/`
4. **Schema** — Add Zod validation in `src/modules/{module}/schemas/`
5. **Components** — Create table, form, dialog in `src/modules/{module}/components/`
6. **Page** — Create page in `src/pages/{module}/`

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run generate  # Static site generation
npm run preview   # Preview production build
```

## Architecture

- **API Layer** — Axios with interceptors for auth token injection, auto-refresh on 401, error handling
- **State** — Pinia for auth and UI state, Vue Query for server state (caching, refetching)
- **Forms** — vee-validate + Zod for type-safe validation
- **Tables** — Custom DataTable component with sort support
- **Styling** — TailwindCSS + CSS variables for theming, dark mode via `@nuxtjs/color-mode`
- **Routing** — Nuxt 3 file-based routing with auth middleware

## Future Integrations

- SiroTrace — Debug request viewer and replay
- API metrics dashboard
- Role-based permissions
- Multi-tenant SaaS support
- ERP modules (orders, inventory, invoicing)
- Audit logs
