import { describe, expect, it } from "vitest";
import { homePath, projectPath, switchLocalePath } from "../../src/i18n/routes";

describe("switchLocalePath", () => {
  it.each([
    ["/es/", "/en/"],
    ["/es", "/en/"],
    ["/en/", "/es/"],
    ["/es/proyectos/radar-ofertas-it/", "/en/projects/radar-ofertas-it/"],
    ["/en/projects/miniblog-api", "/es/proyectos/miniblog-api/"],
    ["/es/projects/miniblog-api/", "/en/"],
    ["/fr/algo", "/en/"],
    ["/", "/en/"],
  ])("%s -> %s", (pathname, expected) => {
    expect(switchLocalePath(pathname)).toBe(expected);
  });
});

describe("paths", () => {
  it("builds home paths", () => {
    expect(homePath("es")).toBe("/es/");
    expect(homePath("en")).toBe("/en/");
  });

  it("builds project paths", () => {
    expect(projectPath("es", "x")).toBe("/es/proyectos/x/");
    expect(projectPath("en", "x")).toBe("/en/projects/x/");
  });
});
