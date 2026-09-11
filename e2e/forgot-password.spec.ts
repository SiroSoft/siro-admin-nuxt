import { test, expect, type Page } from "@playwright/test";

const TURNSTILE_TOKEN = "forgot-token-456";

async function mockApi(page: Page) {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ status: 401, json: { success: false, message: "Unauthenticated" } });
  });
  await page.route("**/api/auth/forgot-password", async (route) => {
    await route.fulfill({ json: { success: true, message: "Reset link sent" } });
  });
}

test.describe("Forgot password", () => {
  test("submit forwards the turnstile token and shows confirmation", async ({ page }) => {
    await mockApi(page);
    await page.goto(`/forgot-password?turnstile=${TURNSTILE_TOKEN}`);

    await page.locator("#email").fill("e2e@example.com");

    const [request] = await Promise.all([
      page.waitForRequest("**/api/auth/forgot-password"),
      page.locator('button[type="submit"]').click(),
    ]);

    const body = request.postDataJSON() as Record<string, unknown>;
    expect(body["email"]).toBe("e2e@example.com");
    expect(body["cf-turnstile-response"]).toBe(TURNSTILE_TOKEN);

    await expect(page.locator("text=password reset link").first()).toBeVisible({ timeout: 10000 });
  });
});
