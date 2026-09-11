import { describe, it, expect } from "vitest";
import { mapProductFromApi, mapProductToApi } from "~/utils/api-mapping";

describe("mapProductFromApi", () => {
  it("adds image alias from cover_image", () => {
    const product = { id: 1, name: "Test", cover_image: "/img.jpg" };
    const result = mapProductFromApi(product);
    expect(result.image).toBe("/img.jpg");
    expect(result.cover_image).toBe("/img.jpg");
  });

  it("handles missing cover_image", () => {
    const product = { id: 1, name: "Test" };
    const result = mapProductFromApi(product);
    expect(result.image).toBeUndefined();
  });
});

describe("mapProductToApi", () => {
  it("removes image and sets cover_image", () => {
    const product = { id: 1, name: "Test", image: "/img.jpg" };
    const result = mapProductToApi(product);
    expect(result.cover_image).toBe("/img.jpg");
    expect(result.image).toBeUndefined();
  });

  it("sets cover_image to null when no image", () => {
    const product = { id: 1, name: "Test" };
    const result = mapProductToApi(product);
    expect(result.cover_image).toBeNull();
  });
});
