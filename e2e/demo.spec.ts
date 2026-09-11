import { test, expect } from "@playwright/test";

test.describe("Demo 1-click login (REQ-5 + REQ-7)", () => {
  test("login page shows demo button and open-source links", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Try live demo").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("text=Deploy your own").first()).toBeVisible();
    await expect(page.locator('a[href*="github.com/SiroSoft/siro-admin-nuxt"]').first()).toBeVisible();
    await expect(page.locator('a[href*="github.com/SiroSoft/SiroPHP"]').first()).toBeVisible();
  });

  test("demo button fills demo creds and submits", async ({ page }) => {
    await page.goto("/login");
    const btn = page.locator("text=Try live demo").first();
    await expect(btn).toBeVisible({ timeout: 15000 });
    // stub login to avoid depending on backend state
    await page.route("**/api/auth/login", async (route) => {
      await route.fulfill({
        json: {
          success: true,
          data: {
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTY3MDAwMDAwMH0.fake",
            refresh_token: "fake-refresh",
            user: { id: 99, name: "Demo Viewer", email: "demo@skeleton.sirophp.com", role: "viewer", status: "active" },
          },
        },
      });
    });
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({
        json: { success: true, data: { id: 99, name: "Demo Viewer", email: "demo@skeleton.sirophp.com", role: "viewer", status: "active" } },
      });
    });
    await btn.click();
    await expect(page).toHaveURL(/\/(\?.*)?$/, { timeout: 20000 });
  });
});
