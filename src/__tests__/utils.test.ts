import { describe, it, expect } from "vitest";
import { cn, formatDate, formatRelativeTime, formatNumber } from "~/utils/index";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });
});

describe("formatDate", () => {
  it("formats a date string", () => {
    const result = formatDate("2026-05-29T12:00:00Z");
    expect(result).toContain("2026");
  });

  it("returns empty for null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("returns empty for invalid date", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("formatRelativeTime", () => {
  it('returns "just now" for recent dates', () => {
    expect(formatRelativeTime(new Date().toISOString())).toBe("just now");
  });

  it("returns empty for null", () => {
    expect(formatRelativeTime(null)).toBe("");
  });
});

describe("formatNumber", () => {
  it("formats with commas", () => {
    expect(formatNumber(1234)).toBe("1,234");
  });
});
