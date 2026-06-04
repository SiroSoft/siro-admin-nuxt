import { test, expect } from "@playwright/test";

const FAKE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTY3MDAwMDAwMH0.fake";
const FAKE_USER = {
  id: 1,
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  status: "active",
  created_at: "2025-01-01T00:00:00Z",
  avatar: null,
};

test.describe("Route Protection", () => {
  test("redirects unauthenticated users from dashboard to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("redirects unauthenticated users from users page to login", async ({ page }) => {
    await page.goto("/users");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("redirects unauthenticated users from products page to login", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("redirects unauthenticated users from orders page to login", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("redirects unauthenticated users from categories page to login", async ({ page }) => {
    await page.goto("/categories");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("redirects unauthenticated users from tags page to login", async ({ page }) => {
    await page.goto("/tags");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("redirects unauthenticated users from posts page to login", async ({ page }) => {
    await page.goto("/posts");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("redirects unauthenticated users from settings page to login", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("redirects unauthenticated users from profile page to login", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });

  test("login page redirects to dashboard when already authenticated", async ({ page }) => {
    await page.evaluate(
      ({ token, user }) => {
        localStorage.setItem("siro_access_token", token);
        localStorage.setItem("siro_refresh_token", token);
        localStorage.setItem("siro_user", JSON.stringify(user));
      },
      { token: FAKE_TOKEN, user: FAKE_USER },
    );
    await page.route("**/api/auth/me", async (route) => {
      await route.fulfill({ json: { success: true, data: FAKE_USER } });
    });
    await page.goto("/login");
    await expect(page).toHaveURL(/\/$|\/dashboard/, { timeout: 15000 });
  });
});
