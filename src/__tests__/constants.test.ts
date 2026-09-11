import { describe, it, expect } from "vitest";
import { STORAGE_KEYS, ROLES, STATUS } from "~/constants";

describe("STORAGE_KEYS", () => {
  it("has access token key", () => {
    expect(STORAGE_KEYS.ACCESS_TOKEN).toBe("siro_access_token");
  });

  it("has refresh token key", () => {
    expect(STORAGE_KEYS.REFRESH_TOKEN).toBe("siro_refresh_token");
  });

  it("has user key", () => {
    expect(STORAGE_KEYS.USER).toBe("siro_user");
  });


});

describe("ROLES", () => {
  it("has admin role", () => {
    expect(ROLES.ADMIN).toBe("admin");
  });

  it("has editor role", () => {
    expect(ROLES.EDITOR).toBe("editor");
  });

  it("has viewer role", () => {
    expect(ROLES.VIEWER).toBe("viewer");
  });
});

describe("STATUS", () => {
  it("has active status", () => {
    expect(STATUS.ACTIVE).toBe("active");
  });

  it("has inactive status", () => {
    expect(STATUS.INACTIVE).toBe("inactive");
  });

  it("has suspended status", () => {
    expect(STATUS.SUSPENDED).toBe("suspended");
  });
});
