<p align="center">
  <img src="public/logo.svg" width="80" height="80" alt="Siro Admin">
</p>

<h1 align="center">Siro Admin — Nuxt 3</h1>

<p align="center">
  <strong>Enterprise admin panel for <a href="https://sirophp.com">SiroPHP</a> — the zero-dependency PHP API framework.</strong>
  <br>
  One backend. Two frontends. Zero duplication.
</p>

<p align="center">
  <a href="#-features"><img src="https://img.shields.io/badge/🚀-Features-00DC82" alt="Features"></a>
  <a href="#-quick-start"><img src="https://img.shields.io/badge/⚡-Quick_Start-16a34a" alt="Quick Start"></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/🏗️-Architecture-dc2626" alt="Architecture"></a>
  <a href="#-api-contract"><img src="https://img.shields.io/badge/📋-API_Contract-ca8a04" alt="API Contract"></a>
</p>

<p align="center">
  <a href="https://github.com/SiroSoft/siro-admin-next"><img src="https://img.shields.io/badge/Next.js-15-000000?logo=next.js" alt="Next.js 15"></a>
  <a href="https://nuxt.com"><img src="https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt" alt="Nuxt 3"></a>
  <a href="https://vuejs.org"><img src="https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js" alt="Vue 3.5"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript 5.7"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss" alt="Tailwind CSS"></a>
  <a href="https://www.radix-vue.com"><img src="https://img.shields.io/badge/Radix_Vue-latest-000000?logo=radixui" alt="Radix Vue"></a>
  <a href="https://tanstack.com/query"><img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery" alt="TanStack Query 5"></a>
</p>

<br>

---

```bash
# One command to start:
cp .env.example .env && npm install && npm run dev
# → http://localhost:3000
```

---

## 🚀 Features

### 📊 Enterprise Dashboard
```
┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│  👥 Users    │  Active      │  📦 Orders   │  🏷️ Products  │  💰 Revenue   │
│  1,234       │  1,200       │  456         │  789         │  $12,345     │
├──────────────┴──────────────┴──────────────┴──────────────┴──────────────┤
│  📈 Monthly Revenue (Bar Chart - vue-chartjs)                           │
├────────────────────────────────────────────────────────────────────────┤
│  🔄 Recent Activity              │  ❤️ API Health                       │
│  John joined 2m ago             │  ● Connected 0.2ms                   │
│  Order #1234 created 5m ago     │  v0.32.0                             │
│  ...                            │                                      │
└────────────────────────────────────────────────────────────────────────┘
```

### 🔐 Complete Auth System
- JWT login with access + refresh token rotation
- Auto-persistent session with "Remember me"
- Axios interceptor: auto-retry with token refresh queue
- Route middleware guards all pages
- Forgot password flow ready

### 📋 6 Full CRUD Modules
| Module | List | Search | Sort | Paginate | Create | Edit | Delete |
|--------|------|--------|------|----------|--------|------|--------|
| Users | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Orders | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Products | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Posts | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Categories | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tags | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 🎨 Enterprise UI/UX
- **Rich Text Editor** — Tiptap-based with Bold/Italic/Headings/Lists/Quote
- **Image Upload** — Drag & drop, URL paste, preview with remove
- **Searchable Select** — Combobox for products, users, categories
- **Dark Mode** — System-aware with manual toggle
- **Responsive** — Mobile, tablet, desktop adaptive layouts
- **Accessibility** — ARIA labels, focus rings, keyboard nav, reduced motion
- **Micro-interactions** — Button press, card hover lift, toast zoom, page transitions

### 🔗 Auto-Generated Types
```bash
npm run generate:types
# → src/types/api.ts  (from OpenAPI spec)
# Frontend & backend types always in sync
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 20+
- A running [SiroPHP](https://sirophp.com) backend (or any REST API)

### Setup

```bash
# 1. Clone
git clone https://github.com/SiroSoft/siro-admin-nuxt.git my-admin
cd my-admin

# 2. Install
npm install

# 3. Configure
cp .env.example .env
# Edit NUXT_PUBLIC_API_URL to point to your backend
# Default: http://localhost:8080

# 4. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll see the login page.

### With SiroPHP Backend

```bash
# Terminal 1: Start the backend
iwr https://sirophp.com/downloads/install.ps1 -UseBasicParsing | iex   # Windows
curl -sS https://sirophp.com/downloads/install.sh | bash               # Linux/macOS
cd my-api
php siro db:seed           # Seed demo data
php siro serve             # → http://localhost:8080

# Terminal 2: Start the admin
cd my-admin
npm run dev                 # → http://localhost:3000
```

**Default login:** Register a new account → first user gets `admin` role automatically.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                     BROWSER                          │
│  ┌────────────────────────────────────────────────┐ │
│  │          Vue 3.5 + Nuxt 3                      │ │
│  │  ┌─────────┐ ┌──────────┐ ┌────────────────┐  │ │
│  │  │  Pages   │ │Components│ │   Plugins      │  │ │
│  │  │  (Auth)  │ │ (UI/Radix)│ │ (Vue Query,   │  │ │
│  │  │  (Dash)  │ │ (Modules)│ │  API Config)   │  │ │
│  │  └────┬────┘ └────┬─────┘ └───────┬────────┘  │ │
│  └───────┼───────────┼───────────────┼───────────┘ │
└──────────┼───────────┼───────────────┼─────────────┘
           │           │               │
     ┌─────▼───────────▼───────────────▼──────────┐
     │              Services Layer                │
     │  ┌──────────┐ ┌──────────┐ ┌────────────┐ │
     │  │  Axios   │ │  TanStack│ │  Pinia     │ │
     │  │ Instance │ │  Vue     │ │  (Auth +   │ │
     │  │+Refresh  │ │  Query   │ │  UI Store) │ │
     │  │  Queue   │ │  Hooks   │ │            │ │
     │  └────┬─────┘ └────┬─────┘ └─────┬──────┘ │
     └───────┼────────────┼──────────────┼────────┘
             │            │              │
     ┌───────▼────────────▼──────────────▼────────┐
     │           OpenAPI Types                    │
     │    src/types/api.ts (auto-generated)       │
     └────────────────┬──────────────────────────┘
                      │ HTTP/JSON
     ┌────────────────▼──────────────────────────┐
     │         SiroPHP API (Backend)              │
     │  sirophp.com/downloads/install.ps1 | iex   │
     └───────────────────────────────────────────┘
```

---

## 📋 API Contract

All endpoints follow the [Siro API Response Contract v1](docs/conventions/responses.md).

### Standard Response Envelope

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "last_page": 5,
    "timestamp": "2026-05-29T12:00:00+00:00"
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run generate` | Static site generation |
| `npm run preview` | Preview production build |
| `npm test` | Run unit tests (Vitest) |
| `npm run lint` | Lint & format check |
| `npm run typecheck` | TypeScript checking |
| `npm run generate:types` | Regenerate API types from OpenAPI spec |

---

## 🧩 Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | [Nuxt 3](https://nuxt.com) | Vue meta-framework |
| **UI Engine** | [Vue 3.5](https://vuejs.org) | Component rendering |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org) | Type safety |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com) | Utility-first CSS |
| **UI Library** | [Radix Vue](https://www.radix-vue.com) | Accessible primitives |
| **Data Fetching** | [TanStack Vue Query 5](https://tanstack.com/query) | Server state |
| **Forms** | [Vee-Validate](https://vee-validate.logaretm.com) + [Zod](https://zod.dev) | Form validation |
| **State** | [Pinia 3](https://pinia.vuejs.org) | Client state |
| **Rich Text** | [Tiptap](https://tiptap.dev) | WYSIWYG editor |
| **Charts** | [vue-chartjs](https://vue-chartjs.org) + [Chart.js](https://www.chartjs.org) | Dashboard charts |
| **HTTP** | [Axios](https://axios-http.com) | API client |
| **Icons** | [Lucide](https://lucide.dev) (Vue) | Icon set |
| **Theming** | [@nuxtjs/color-mode](https://color-mode.nuxtjs.org) | Dark mode |
| **Types** | [openapi-typescript 7](https://openapi-ts.dev) | Auto-generated types |
| **Tests** | [Vitest](https://vitest.dev) | Testing |

---

## 🔗 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **SiroPHP** | Zero-dependency PHP API framework | [github.com/SiroSoft/SiroPHP](https://github.com/SiroSoft/SiroPHP) |
| **Siro Admin (Next)** | React version of this starter | [github.com/SiroSoft/siro-admin-next](https://github.com/SiroSoft/siro-admin-next) |
| **Siro Installer** | One-liner installer scripts | [github.com/SiroSoft/siro-installer](https://github.com/SiroSoft/siro-installer) |

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/SiroSoft">SiroSoft</a>
  <br>
  <sub>MIT License · 2026</sub>
</p>
