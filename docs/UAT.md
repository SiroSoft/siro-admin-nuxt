# UAT Checklist — Admin + Skeleton (REQ-1)

> Env: Pages custom domains → `https://skeleton.sirophp.com` (MySQL, core 1.0.0).
> Demo: 1-click login `demo@skeleton.sirophp.com` (read-only, DemoGuard 403 on write).
> Admin: `admin@skeleton.sirophp.com` (full write).

## Auth
- [ ] Login page renders (no infinite spinner), demo button + 2 open-source links visible
- [ ] Demo 1-click login → dashboard 200
- [ ] Wrong password → field error from `meta.errors`, no crash
- [ ] Turnstile widget renders when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` set; login includes `cf-turnstile-response`
- [ ] Logout → `/login`, token revoked (`/api/auth/me` → 401)
- [ ] Refresh flow: expired access + valid refresh → silent retry 200

## CRUD (each: users/products/categories/tags/orders/posts)
- [ ] List renders table, pagination works
- [ ] Create → 201 appears in list; validation 422 shows field errors
- [ ] Update → persists; Delete → removed
- [ ] `PATCH /orders/{id}/status` updates badge
- [ ] Demo account: create/update/delete → `403 demo.readonly` toast

## Mapping (REQ-4)
- [ ] Products Active filter sends `status=active` (NOT `is_active`)
- [ ] Products category/min/max price filters narrow the list
- [ ] Dashboard shows Orders-by-status card with real counts
- [ ] Health badge shows `api_status.version` (1.0.1)
- [ ] Settings save persists + reload shows saved values

## Security (REQ-2/3)
- [ ] No `X-Siro-FE` → `/api/*` 403; evil Origin → 403; health stays 200
- [ ] Login without Turnstile token → 422 `cf-turnstile-response`
- [ ] `composer audit` 0 advisories; `APP_DEBUG=false` on prod (no trace leak)

## UI/UX (REQ-6)
- [ ] Dark mode no flash; skeleton → content, empty states, error retry buttons
- [ ] `npx axe https://admin-next.sirophp.com/login` 0 critical; same for nuxt
- [ ] Lighthouse perf/a11y ≥ 90 both admins
- [ ] vi/en switch covers new strings (ordersByStatus, demo, links)

## Sign-off
Tester: ______________  Date: __________  Result: PASS / FAIL
