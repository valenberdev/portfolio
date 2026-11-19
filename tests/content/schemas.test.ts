import { describe, expect, it } from "vitest";
import { experienceSchema, projectSchema } from "../../src/content/schemas";

const DEMO = "https://demo.example.com";
const REPO = "https://github.com/valenberdev/example";

const baseProject = {
  title: "Proyecto",
  summary: "Resumen corto.",
  role: "Backend",
  stack: ["Node.js"],
  status: "live",
  team: false,
  links: { demo: DEMO, repo: REPO },
  order: 1,
};

function parse(overrides: Record<string, unknown>) {
  return projectSchema.safeParse({ ...baseProject, ...overrides });
}

describe("projectSchema", () => {
  it("accepts a live project with demo and repo", () => {
    expect(parse({}).success).toBe(true);
  });

  it.each([
    ["live", { repo: REPO }, false],
    ["live", { demo: DEMO }, false],
    ["code-only", { repo: REPO }, true],
    ["code-only", { demo: DEMO, repo: REPO }, false],
    ["code-only", {}, false],
    ["deploy-only", { demo: DEMO }, true],
    ["deploy-only", { demo: DEMO, repo: REPO }, false],
    ["deploy-only", {}, false],
    ["in-progress", {}, true],
    ["in-progress", { repo: REPO }, false],
    ["in-progress", { demo: DEMO }, false],
  ])("status %s with links %o -> valid: %s", (status, links, valid) => {
    expect(parse({ status, links }).success).toBe(valid);
  });

  it("rejects non-https links", () => {
    expect(
      parse({ links: { demo: "http://demo.example.com", repo: REPO } }).success,
    ).toBe(false);
  });

  it("rejects a summary longer than 180 characters", () => {
    expect(parse({ summary: "a".repeat(181) }).success).toBe(false);
  });

  it("rejects a non-positive or non-integer order", () => {
    expect(parse({ order: 0 }).success).toBe(false);
    expect(parse({ order: 1.5 }).success).toBe(false);
  });

  it("rejects an empty stack", () => {
    expect(parse({ stack: [] }).success).toBe(false);
  });
});

describe("experienceSchema", () => {
  const baseExperience = {
    company: "ClinicGes",
    role: "Frontend developer",
    start: "2026-09",
    summary: "Resumen corto.",
    stack: ["React"],
    links: {
      store:
        "https://play.google.com/store/apps/details?id=com.clinicges.pacientes",
    },
    order: 1,
  };

  it("accepts a valid experience", () => {
    expect(experienceSchema.safeParse(baseExperience).success).toBe(true);
  });

  it.each(["2026-9", "2026-13", "sept 2026"])('rejects start "%s"', (start) => {
    expect(
      experienceSchema.safeParse({ ...baseExperience, start }).success,
    ).toBe(false);
  });
});
