import { test, expect } from "@playwright/test";

const VALID_EMAIL = "admin@example.com";
const VALID_PASSWORD = "password123";

test.describe("Login", () => {
  test("login page loads correctly", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h3")).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test("shows validation errors with empty form", async ({ page }) => {
    await page.goto("/login");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator(".text-destructive").first()).toBeVisible({ timeout: 5000 });
  });

  test("shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("invalid@example.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.locator('button[type="submit"]').click();
    await expect(page.locator("text=Invalid credentials, text=Login failed, text=Invalid email or password").first()).toBeVisible({ timeout: 10000 });
  });

  test("forgot password page loads correctly", async ({ page }) => {
    await page.goto("/login");
    await page.locator('a[href*="forgot"]').click();
    await expect(page).toHaveURL(/\/forgot-password/, { timeout: 10000 });
    await expect(page.locator("text=Forgot").or(page.locator("text=forgot")).first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Login with valid credentials", () => {
  test("redirects to dashboard on successful login", async ({ page }) => {
    await page.goto("/login");
    await page.locator('input[type="email"]').fill(VALID_EMAIL);
    await page.locator('input[type="password"]').fill(VALID_PASSWORD);
    await page.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/$/, { timeout: 10000 });
  });
});
