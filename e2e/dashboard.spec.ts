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
const MOCK_DASHBOARD = {
  success: true,
  data: {
    total_users: 42,
    active_users: 38,
    total_orders: 156,
    total_products: 89,
    total_revenue: 45200,
    recent_activity: [],
    api_status: { status: "healthy", version: "1.0.0", uptime: 86400, response_time: 45 },
    monthly_revenue: [],
  },
};
const MOCK_PAGINATED = { data: [], meta: { total: 0, per_page: 10, current_page: 1, last_page: 0 } };
const MOCK_SETTINGS = {
  success: true,
  data: { app_name: "Siro Admin", app_description: "", language: "en", timezone: "UTC", currency: "USD", pagination_per_page: 15, maintenance_mode: false, email_notifications: true },
};

async function setupAuth(page: Page) {
  await page.evaluate(
    ({ token, user }) => {
      localStorage.setItem("siro_access_token", token);
      localStorage.setItem("siro_refresh_token", token);
      localStorage.setItem("siro_user", JSON.stringify(user));
    },
    { token: FAKE_TOKEN, user: FAKE_USER },
  );
}

async function mockApi(page: Page) {
  await page.route("**/api/auth/me", async (route) => {
    await route.fulfill({ json: MOCK_USER_RESPONSE });
  });
  await page.route("**/api/dashboard/stats", async (route) => {
    await route.fulfill({ json: MOCK_DASHBOARD });
  });
  await page.route("**/api/users**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/products**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/orders**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/categories**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/tags**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/posts**", async (route) => {
    await route.fulfill({ json: MOCK_PAGINATED });
  });
  await page.route("**/api/settings**", async (route) => {
    await route.fulfill({ json: MOCK_SETTINGS });
  });
  await page.route("**/api/auth/logout", async (route) => {
    await route.fulfill({ json: { success: true } });
  });
}

async function loginAndMock(page: Page) {
  await mockApi(page);
  await setupAuth(page);
}

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await loginAndMock(page);
  });

  test("dashboard page loads with stat cards", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/", { timeout: 15000 });
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 10000 });
  });

  test("sidebar navigation links exist", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("nav", { timeout: 10000 });
    const navLinks = ["Users", "Orders", "Products", "Posts", "Categories", "Tags", "Settings"];
    for (const link of navLinks) {
      await expect(page.locator(`nav a:has-text("${link}")`).first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("navigate to Users page", async ({ page }) => {
    await page.goto("/users");
    await expect(page).toHaveURL("/users", { timeout: 15000 });
    await expect(page.locator("h1, .page-header, [class*=pageHeader]").first()).toBeVisible({ timeout: 10000 });
  });

  test("navigate to Products page", async ({ page }) => {
    await page.goto("/products");
    await expect(page).toHaveURL("/products", { timeout: 15000 });
    await expect(page.locator("h1, .page-header, [class*=pageHeader]").first()).toBeVisible({ timeout: 10000 });
  });

  test("navigate to Orders page", async ({ page }) => {
    await page.goto("/orders");
    await expect(page).toHaveURL("/orders", { timeout: 15000 });
    await expect(page.locator("h1, .page-header, [class*=pageHeader]").first()).toBeVisible({ timeout: 10000 });
  });

  test("navigate to Categories page", async ({ page }) => {
    await page.goto("/categories");
    await expect(page).toHaveURL("/categories", { timeout: 15000 });
    await expect(page.locator("h1, .page-header, [class*=pageHeader]").first()).toBeVisible({ timeout: 10000 });
  });

  test("navigate to Tags page", async ({ page }) => {
    await page.goto("/tags");
    await expect(page).toHaveURL("/tags", { timeout: 15000 });
    await expect(page.locator("h1, .page-header, [class*=pageHeader]").first()).toBeVisible({ timeout: 10000 });
  });

  test("navigate to Posts page", async ({ page }) => {
    await page.goto("/posts");
    await expect(page).toHaveURL("/posts", { timeout: 15000 });
    await expect(page.locator("h1, .page-header, [class*=pageHeader]").first()).toBeVisible({ timeout: 10000 });
  });

  test("Settings page loads", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL("/settings", { timeout: 15000 });
    await expect(page.locator("text=Settings").or(page.locator("text=settings")).first()).toBeVisible({ timeout: 10000 });
  });

  test("Profile page loads", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL("/profile", { timeout: 15000 });
    await expect(page.locator("text=Profile").or(page.locator("text=profile")).first()).toBeVisible({ timeout: 10000 });
  });

  test("logout clears localStorage and redirects to login", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("nav", { timeout: 10000 });
    await page.locator('button:has-text("Logout"), nav button:has(svg)').first().click();
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    const token = await page.evaluate(() => localStorage.getItem("siro_access_token"));
    expect(token).toBeNull();
  });
});
