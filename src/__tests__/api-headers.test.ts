import { describe, it, expect, beforeEach } from "vitest";
import api, { setFeToken, tApi } from "~/services/api";

type RequestHandler = { fulfilled?: (config: any) => any };

function runRequestInterceptor(config: Record<string, unknown>) {
  const manager = api.interceptors.request as unknown as { handlers: RequestHandler[] };
  const handler = manager.handlers.find((h) => typeof h.fulfilled === "function");
  if (!handler?.fulfilled) throw new Error("request interceptor not found");
  return handler.fulfilled({ headers: {}, ...config });
}

describe("services/api request headers", () => {
  beforeEach(() => {
    localStorage.clear();
    setFeToken("");
  });

  it("sets X-Siro-FE header when the FE token is configured", () => {
    setFeToken("fe-secret-token");
    const config = runRequestInterceptor({}) as { headers: Record<string, string> };

    expect(config.headers["X-Siro-FE"]).toBe("fe-secret-token");
    expect(config.headers["X-Request-Id"]).toMatch(/^req_/);
  });

  it("omits X-Siro-FE header when no FE token is configured", () => {
    const config = runRequestInterceptor({}) as { headers: Record<string, string> };

    expect(config.headers["X-Siro-FE"]).toBeUndefined();
  });

  it("sends the current locale as X-Locale with en fallback", () => {
    localStorage.setItem("siro_locale", "vi");
    const viConfig = runRequestInterceptor({}) as { headers: Record<string, string> };
    expect(viConfig.headers["X-Locale"]).toBe("vi");

    localStorage.removeItem("siro_locale");
    const enConfig = runRequestInterceptor({}) as { headers: Record<string, string> };
    expect(enConfig.headers["X-Locale"]).toBe("en");
  });
});

describe("services/api tApi", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("translates api keys using the stored locale", () => {
    localStorage.setItem("siro_locale", "vi");
    expect(tApi("api.forbidden")).toBe("Bạn không có quyền truy cập tài nguyên này.");
  });

  it("falls back to English for unknown locales", () => {
    localStorage.setItem("siro_locale", "fr");
    expect(tApi("api.forbidden")).toBe("You do not have permission to access this resource.");
  });

  it("interpolates params", () => {
    expect(tApi("api.serverError", { status: 500 })).toContain("500");
  });
});
