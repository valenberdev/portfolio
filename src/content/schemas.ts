import { z } from "astro/zod";

const httpsUrl = z.url({ protocol: /^https$/ });
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

export const projectStatus = z.enum([
  "live",
  "code-only",
  "deploy-only",
  "in-progress",
]);

export type ProjectStatus = z.infer<typeof projectStatus>;

const LINK_RULES: Record<ProjectStatus, { demo: boolean; repo: boolean }> = {
  live: { demo: true, repo: true },
  "code-only": { demo: false, repo: true },
  "deploy-only": { demo: true, repo: false },
  "in-progress": { demo: false, repo: false },
};

export const projectSchema = z
  .object({
    title: z.string().min(1),
    summary: z.string().min(1).max(180),
    role: z.string().min(1),
    stack: z.array(z.string().min(1)).min(1),
    status: projectStatus,
    team: z.boolean(),
    links: z.object({
      demo: httpsUrl.optional(),
      repo: httpsUrl.optional(),
    }),
    note: z.string().min(1).optional(),
    order: z.number().int().positive(),
    cover: z.string().min(1).optional(),
  })
  .superRefine((project, ctx) => {
    const rule = LINK_RULES[project.status];
    for (const key of ["demo", "repo"] as const) {
      const present = project.links[key] !== undefined;
      if (present !== rule[key]) {
        ctx.addIssue({
          code: "custom",
          path: ["links", key],
          message: `status "${project.status}" ${rule[key] ? "requires" : "does not allow"} links.${key}`,
        });
      }
    }
  });

export type ProjectData = z.infer<typeof projectSchema>;

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  start: yearMonth,
  end: yearMonth.optional(),
  summary: z.string().min(1).max(180),
  stack: z.array(z.string().min(1)).min(1),
  links: z.object({
    store: httpsUrl.optional(),
  }),
  note: z.string().min(1).optional(),
  order: z.number().int().positive(),
});

export type ExperienceData = z.infer<typeof experienceSchema>;
