import { describe, expect, it } from "vitest";
import { formatDate, getDateDescription, getToday, toDateString } from "@/lib/utils/dates";

describe("date utilities", () => {
  it("formats date values and handles null", () => {
    const target = new Date("2026-02-15T12:00:00.000Z");
    expect(formatDate(target, "yyyy-MM-dd")).toBe("2026-02-15");
    expect(formatDate(null)).toBe("");
  });

  it("returns a readable relative description", () => {
    const today = getToday();
    expect(getDateDescription(today)).toBe("Today");
  });

  it("converts to canonical date strings", () => {
    const target = new Date("2026-02-15T12:00:00.000Z");
    expect(toDateString(target)).toBe("2026-02-15");
  });
});
