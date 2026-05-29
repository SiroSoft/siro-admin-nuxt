<![CDATA[
# Siro Admin — Nuxt 3 Enterprise Starter

> **Production-ready admin panel for [SiroPHP](https://sirophp.com) — the zero-dependency PHP API framework.**

[![Nuxt](https://img.shields.io/badge/Nuxt-3.15-00DC82?logo=nuxt)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery)](https://tanstack.com/query)
[![Pinia](https://img.shields.io/badge/Pinia-3-F7D358?logo=pinia)](https://pinia.vuejs.org)
[![Radix Vue](https://img.shields.io/badge/Radix_Vue-latest-000000?logo=radixui)](https://www.radix-vue.com)

---

## ✨ Features

### Enterprise-Grade Dashboard
- **Real-time charts** — Revenue trends with interactive bar charts (vue-chartjs)
- **Stats overview** — Users, orders, products, revenue at a glance
- **Activity feed** — Recent user signups and order activity
- **API health monitor** — Backend status, uptime, response time

### Complete Authentication
- JWT login with access + refresh token rotation
- Auto-persistent session with `Remember me` option
- Axios interceptor with automatic 401 → refresh → retry queue
- Route middleware for page-level auth protection
- Forgot password flow with email confirmation UI

### CRUD Modules
| Module   | List | Search | Sort | Paginate | Create | Edit | Delete |
|----------|------|--------|------|----------|--------|------|--------|
| Users    | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Orders   | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Products | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Posts    | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Categories | ✅ | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |
| Tags     | ✅   | ✅     | ✅   | ✅       | ✅     | ✅   | ✅     |

### Type Safety
- **OpenAPI-generated types** — `npm run generate:types` syncs TypeScript types from the backend OpenAPI spec
- **Zod validation** — All forms validated client-side before submission (vee-validate + Zod)
- **End-to-end type safety** — From API response to Vue component

### User Experience
- ⚡ **Shimmer skeletons** — Premium loading states matching content shape
- 🌓 **Dark mode** — System-aware with manual toggle, persistent preference (color-mode)
- 📱 **Fully responsive** — Adaptive sidebar, mobile overlay, scrollable tables
- ♿ **Accessible** — ARIA labels, focus-visible rings, keyboard navigation
- 🎯 **Toast notifications** — 4 variants (success, error, warning, info) with auto-dismiss
- 🧭 **Breadcrumbs** — Dynamic navigation path with every page

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/SiroSoft/siro-admin-nuxt.git siro-admin
cd siro-admin

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit NUXT_PUBLIC_API_URL to point to your SiroPHP backend
# Default: http://localhost:8080

# 4. Generate types (sync with backend)
npm run generate:types

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — login with your SiroPHP backend credentials.

---

## 📸 What's Inside

### Dashboard
```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  👥 Users    │  📦 Orders   │  🏷️ Products  │  💰 Revenue   │
│  1,234       │  456         │  789         │  $12,345     │
├──────────────┴──────────────┴──────────────┴──────────────┤
│  📊 Monthly Revenue Chart (vue-chartjs)                   │
├───────────────────────────────────────────────────────────┤
│  🔄 Recent Activity                     │  ❤️ API Status  │
│  John joined • Order #123 created      │  ● Connected    │
│  ...
└───────────────────────────────────────────────────────────┘
```

### User Management
```
┌──────┬──────────┬────────────────┬──────────┬──────────┐
│  ID  │  Name    │  Email         │  Role    │  Status  │
├──────┼──────────┼────────────────┼──────────┼──────────┤
│  1   │  John    │  john@ex.com   │  Admin   │  Active  │
│  2   │  Jane    │  jane@ex.com   │  User    │  Active  │
│  ... │          │                │          │          │
└──────┴──────────┴────────────────┴──────────┴──────────┘
  < 1 | 2 | 3 ... 10 >    🔍 Search    ➕ New User
```

---

## 🔧 Architecture

```
src/
├── app.vue                 # Root component with page transitions
├── layouts/
│   ├── default.vue         # Dashboard layout (sidebar + header)
│   └── auth.vue            # Centered card layout for auth pages
├── pages/
│   ├── index.vue           # Dashboard with stats & charts
│   ├── login.vue           # Login form
│   ├── forgot-password.vue # Password reset flow
│   ├── users/index.vue     # Users CRUD
│   ├── orders/index.vue    # Orders CRUD
│   ├── products/index.vue  # Products CRUD
│   ├── posts/index.vue     # Posts CRUD
│   ├── categories/index.vue# Categories CRUD
│   ├── tags/index.vue      # Tags CRUD
│   ├── settings.vue        # App settings
│   └── profile/index.vue   # User profile
├── components/
│   ├── ui/                 # Radix Vue primitives (button, input, table, etc.)
│   ├── data-table/         # Reusable table + pagination
│   ├── dialogs/            # Delete confirmation dialog
│   ├── forms/              # Search input
│   ├── layout/             # Sidebar, header, user nav
│   └── states/             # Loading skeleton, empty state, error state
├── composables/            # Vue Query hooks per resource
├── middleware/              # Auth route middleware
├── modules/{resource}/     # Feature modules (form, table, schemas)
├── plugins/                # API config, Vue Query plugin
├── services/               # Axios API service layer
├── stores/                 # Pinia stores (auth, UI)
├── types/                  # OpenAPI-generated TypeScript types
└── utils/                  # cn(), formatDate(), formatNumber()
```

---

## 🔐 Auth Flow

```
┌─────────┐     POST /api/auth/login     ┌──────────┐
│  Login   │ ──────────────────────────→  │  SiroPHP  │
│  Page    │ ←──────────────────────────  │  Backend  │
└─────────┘     { token, refresh, user }  └──────────┘
                                                  │
                                          ┌───────┴───────┐
                                          │  localStorage  │
                                          │  access_token  │
                                          │  refresh_token │
                                          └───────┬───────┘
                                                  │
┌─────────┐     Axios Interceptor           ┌──────┴──────┐
│  Every   │ ────────────────────────────→  │  Attach     │
│  Request │                                │  Bearer     │
└─────────┘                                 │  Token      │
                                            └──────┬──────┘
                                                   │
                                          401? ────┤
                                                   │
                                          ┌────────┴────────┐
                                          │  POST /api/auth/ │
                                          │  refresh         │
                                          └────────┬────────┘
                                                   │
                                          ┌────────┴────────┐
                                          │  Retry original  │
                                          │  request         │
                                          └─────────────────┘
                                          Route middleware
                                          guards all pages
```

---

## 🔗 Integration with SiroPHP

This starter is designed for [**SiroPHP**](https://sirophp.com) — the production-first PHP API framework.

```bash
# Install SiroPHP backend
iwr https://sirophp.com/downloads/install.ps1 -UseBasicParsing | iex   # Windows
curl -sS https://sirophp.com/downloads/install.sh | bash               # Linux/macOS

# Generate resources & run
cd my-api
php siro serve  # → http://localhost:8080
```

**Auto-generated API types:**
```bash
# After updating your backend, regenerate types:
npm run generate:types
```
This runs `openapi-typescript` against your backend's OpenAPI spec, keeping frontend types always in sync.

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run generate` | Static site generation |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run generate:types` | Regenerate API types from backend OpenAPI spec |

---

## 🧰 Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | [Nuxt](https://nuxt.com) | 3.15 |
| UI Engine | [Vue](https://vuejs.org) | 3.5 |
| Language | [TypeScript](https://www.typescriptlang.org) | 5.7 |
| Styling | [Tailwind CSS](https://tailwindcss.com) | 3.4 |
| UI Library | [Radix Vue](https://www.radix-vue.com) + CVA | Latest |
| Data Fetching | [TanStack Vue Query](https://tanstack.com/query) | 5 |
| Forms | [Vee-Validate](https://vee-validate.logaretm.com) + [Zod](https://zod.dev) | Latest |
| State | [Pinia](https://pinia.vuejs.org) | 3 |
| Charts | [vue-chartjs](https://vue-chartjs.org) + [Chart.js](https://www.chartjs.org) | Latest |
| HTTP Client | [Axios](https://axios-http.com) | Latest |
| Icons | [Lucide](https://lucide.dev) (Vue) | Latest |
| Theming | [@nuxtjs/color-mode](https://color-mode.nuxtjs.org) | Latest |
| API Types | [openapi-typescript](https://openapi-ts.dev) | 7 |

---

## 📄 License

MIT — built for [SiroPHP](https://sirophp.com).

---

<p align="center">
  <a href="https://sirophp.com">
    <img src="https://sirophp.com/favicon.ico" width="32" height="32" alt="SiroPHP">
  </a>
  <br>
  <strong>Powered by <a href="https://sirophp.com">SiroPHP</a></strong> — 1 command, 0 dependency.
</p>
]]>