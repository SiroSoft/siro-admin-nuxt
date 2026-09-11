import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("~/services/api", () => ({
  default: { post: vi.fn(), get: vi.fn() },
}));

import api from "~/services/api";
import { authService } from "~/services/auth.service";

const mockPost = vi.mocked(api.post);

describe("auth.service turnstile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPost.mockResolvedValue({ data: { success: true } });
  });

  it("login forwards cf-turnstile-response in the request body", async () => {
    await authService.login({
      email: "admin@example.com",
      password: "password123",
      "cf-turnstile-response": "turnstile-login-token",
    });

    expect(mockPost).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({ "cf-turnstile-response": "turnstile-login-token" }),
    );
  });

  it("register forwards cf-turnstile-response in the request body", async () => {
    await authService.register({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      password_confirmation: "password123",
      "cf-turnstile-response": "turnstile-register-token",
    });

    expect(mockPost).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({ "cf-turnstile-response": "turnstile-register-token" }),
    );
  });

  it("forgotPassword includes cf-turnstile-response when a token is given", async () => {
    await authService.forgotPassword("test@example.com", "turnstile-forgot-token");

    expect(mockPost).toHaveBeenCalledWith(
      "/api/auth/forgot-password",
      expect.objectContaining({
        email: "test@example.com",
        "cf-turnstile-response": "turnstile-forgot-token",
      }),
    );
  });

  it("forgotPassword omits cf-turnstile-response when no token is given", async () => {
    await authService.forgotPassword("test@example.com");

    expect(mockPost).toHaveBeenCalledWith("/api/auth/forgot-password", { email: "test@example.com" });
  });
});
