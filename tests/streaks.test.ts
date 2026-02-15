import { describe, expect, it } from "vitest";
import type { HabitCompletion } from "@prisma/client";
import { getCompletionMap, isHabitCompletedOnDate } from "@/lib/utils/streaks";

describe("streak utilities", () => {
  it("detects completion on a specific date", () => {
    const completions = [
      { id: "a", habitId: "h1", date: new Date(2026, 1, 15, 10, 0, 0), note: null, createdAt: new Date() },
      { id: "b", habitId: "h1", date: new Date(2026, 1, 13, 9, 0, 0), note: null, createdAt: new Date() },
    ] satisfies HabitCompletion[];

    expect(isHabitCompletedOnDate(completions, new Date(2026, 1, 15, 3, 0, 0))).toBe(true);
    expect(isHabitCompletedOnDate(completions, new Date(2026, 1, 14, 3, 0, 0))).toBe(false);
  });

  it("builds completion map across date ranges", () => {
    const completions = [
      { id: "a", habitId: "h1", date: new Date(2026, 1, 14, 10, 0, 0), note: null, createdAt: new Date() },
      { id: "b", habitId: "h1", date: new Date(2026, 1, 15, 10, 0, 0), note: null, createdAt: new Date() },
    ] satisfies HabitCompletion[];

    const map = getCompletionMap(
      completions,
      new Date(2026, 1, 13, 0, 0, 0),
      new Date(2026, 1, 15, 0, 0, 0)
    );

    expect(map.get("2026-02-13")).toBe(false);
    expect(map.get("2026-02-14")).toBe(true);
    expect(map.get("2026-02-15")).toBe(true);
  });
});
