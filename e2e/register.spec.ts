import { test, expect, type Page } from "@playwright/test";

const TURNSTILE_TOKEN = "test-token-123";

async function mockApi(page: Page) {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ status: 401, json: { success: false, message: "Unauthenticated" } });
  });
  await page.route("**/api/auth/register", async (route) => {
    await route.fulfill({ json: { success: true, message: "Account created" } });
  });
}

test.describe("Register", () => {
  test("submit forwards the turnstile token and redirects to login", async ({ page }) => {
    await mockApi(page);
    await page.goto(`/register?turnstile=${TURNSTILE_TOKEN}`);

    await page.locator("#name").fill("E2E User");
    await page.locator("#email").fill("e2e@example.com");
    await page.locator("#password").fill("Password123!");
    await page.locator("#password_confirmation").fill("Password123!");

    const [request] = await Promise.all([
      page.waitForRequest("**/api/auth/register"),
      page.locator('button[type="submit"]').click(),
    ]);

    const body = request.postDataJSON() as Record<string, unknown>;
    expect(body["email"]).toBe("e2e@example.com");
    expect(body["cf-turnstile-response"]).toBe(TURNSTILE_TOKEN);

    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
  });
});
