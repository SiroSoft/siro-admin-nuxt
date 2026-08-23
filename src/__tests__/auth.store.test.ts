import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "~/stores/auth.store";
import type { User } from "~/types/auth";

const mockUser: User = {
  id: 1,
  name: "Test User",
  email: "test@example.com",
  role: "admin",
  status: 1,
};

describe("auth.store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("starts with no user and loading true", () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.isLoading).toBe(true);
  });

  it("login sets user and tokens", () => {
    const store = useAuthStore();
    store.login(mockUser, "access-token", "refresh-token");

    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
    expect(localStorage.getItem("siro_access_token")).toBe("access-token");
    expect(localStorage.getItem("siro_refresh_token")).toBe("refresh-token");
    expect(localStorage.getItem("siro_user")).toBe(JSON.stringify(mockUser));
  });

  it("logout clears user and tokens", () => {
    const store = useAuthStore();
    store.login(mockUser, "access-token", "refresh-token");
    store.logout();

    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(localStorage.getItem("siro_access_token")).toBeNull();
    expect(localStorage.getItem("siro_refresh_token")).toBeNull();
    expect(localStorage.getItem("siro_user")).toBeNull();
  });

  it("restoreSession loads user from localStorage", () => {
    localStorage.setItem("siro_access_token", "existing-token");
    localStorage.setItem("siro_user", JSON.stringify(mockUser));

    const store = useAuthStore();
    const result = store.restoreSession();

    expect(result).toEqual(mockUser);
    expect(store.user).toEqual(mockUser);
    expect(store.isAuthenticated).toBe(true);
  });

  it("restoreSession returns null when no token", () => {
    const store = useAuthStore();
    const result = store.restoreSession();
    expect(result).toBeNull();
    expect(store.isLoading).toBe(false);
  });

  it("restoreSession handles corrupted user data", () => {
    localStorage.setItem("siro_access_token", "token");
    localStorage.setItem("siro_user", "{invalid json}");

    const store = useAuthStore();
    const result = store.restoreSession();
    expect(result).toBeNull();
    expect(localStorage.getItem("siro_user")).toBeNull();
  });

  it("setUser updates user", () => {
    const store = useAuthStore();
    store.setUser(mockUser);
    expect(store.user).toEqual(mockUser);
  });

  it("setLoading updates loading state", () => {
    const store = useAuthStore();
    expect(store.isLoading).toBe(true);
    store.setLoading(false);
    expect(store.isLoading).toBe(false);
  });
});
