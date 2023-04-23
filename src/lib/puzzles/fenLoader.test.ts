import { loadFromFEN } from "./fenLoader";

describe("fenLoader", () => {
  test("empty string should thorw error", () => {
    expect(() => {
      loadFromFEN("");
    }).toThrow();
  });
});
