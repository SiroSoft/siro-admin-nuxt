# Changelog — siro-admin-nuxt

## [1.0.1] - 2026-09-13

### Fixed (via backend)
- File uploads (`upload.service.ts`, multipart/form-data) were rejected
  with 415 by backends on sirosoft/core ≤1.0.6. Requires backend
  `sirosoft/core ^1.0.7` — no template code change needed (verified:
  vitest 39 green).

## [1.0.0] - 2026-06-15

### Added
- Initial release of Siro Admin Nuxt
- Enterprise dashboard with stats cards and charts
- JWT auth with access + refresh token rotation
- 6 full CRUD modules: Users, Orders, Products, Posts, Categories, Tags
- Rich text editor (Tiptap), image upload, dark mode
- TanStack Vue Query, Pinia state management
- Auto-generated OpenAPI types
- E2E tests with Playwright, unit tests with Vitest
- Docker support
