import { test, expect, type Page } from "@playwright/test";

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

const MOCK_USER_RESPONSE = { success: true, data: FAKE_USER };
const MOCK_META = { page: 1, per_page: 10, total: 1, last_page: 1 };
const MOCK_EMPTY_META = { page: 1, per_page: 10, total: 0, last_page: 0 };

const MOCK_PRODUCT = {
  id: 1,
  name: "Test Product",
  price: 99.99,
  stock: 10,
  sku: "PROD-001",
  is_active: true,
  created_at: "2025-01-01T00:00:00Z",
  cover_image: null,
};

async function mockApi(page: Page) {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ json: MOCK_USER_RESPONSE });
  });
  await page.route("**/api/products", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        json: { data: { ...MOCK_PRODUCT, id: 2, ...(body as object) }, message: "Product created" },
      });
      return;
    }
    await route.fulfill({ json: { data: [MOCK_PRODUCT], meta: MOCK_META } });
  });
  await page.route("**/api/categories**", async (route) => {
    await route.fulfill({ json: { data: [], meta: MOCK_EMPTY_META } });
  });
  await page.route("**/api/auth/logout", async (route) => {
    await route.fulfill({ json: { success: true } });
  });
}

async function loginAndMock(page: Page) {
  await mockApi(page);
  await page.addInitScript(
    ({ token, user }) => {
      localStorage.setItem("siro_access_token", token);
      localStorage.setItem("siro_refresh_token", token);
      localStorage.setItem("siro_user", JSON.stringify(user));
    },
    { token: FAKE_TOKEN, user: FAKE_USER },
  );
}

test.describe("Products CRUD", () => {
  test.beforeEach(async ({ page }) => {
    await loginAndMock(page);
  });

  test("products list renders", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL("/products", { timeout: 15000 });
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Test Product").first()).toBeVisible({ timeout: 10000 });
  });

  test("create product submits", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("text=Test Product").first()).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Create Product" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });

    await dialog.locator("#name").fill("E2E Product");
    await dialog.locator("#sku").fill("E2E-001");
    await dialog.locator("#price").fill("49.99");

    const [request] = await Promise.all([
      page.waitForRequest("**/api/products"),
      dialog.getByRole("button", { name: /create product/i }).click(),
    ]);

    const body = request.postDataJSON() as Record<string, unknown>;
    expect(body["name"]).toBe("E2E Product");
    expect(body["sku"]).toBe("E2E-001");
    await expect(dialog).toBeHidden({ timeout: 10000 });
  });

  test("validation error shows", async ({ page }) => {
    await page.goto("/products");
    await expect(page.locator("text=Test Product").first()).toBeVisible({ timeout: 10000 });

    await page.getByRole("button", { name: "Create Product" }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible({ timeout: 10000 });

    await dialog.getByRole("button", { name: /create product/i }).click();
    await expect(dialog.locator("text=Name must be at least 2 characters")).toBeVisible({ timeout: 10000 });
    await expect(dialog.locator("text=SKU is required")).toBeVisible({ timeout: 10000 });
  });
});
