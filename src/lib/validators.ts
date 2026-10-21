import { z } from "zod";

const text = (min: number, max: number) => z.string().trim().min(min).max(max);
export const registerSchema = z.object({
  name: text(2, 60),
  email: z.email().max(120),
  password: z.string().min(8).max(72),
  college: text(2, 120),
  state: text(2, 60),
});
export const loginSchema = z.object({
  email: z.email().max(120),
  password: z.string().min(1).max(72),
});
export const projectSchema = z.object({
  title: text(4, 100),
  description: text(30, 2000),
  tech: z.string().trim().min(1).max(250),
  githubUrl: z.union([z.url().startsWith("https://"), z.literal("")]),
  status: z.enum(["IDEA", "IN_PROGRESS", "COMPLETED"]),
  teamSize: z.coerce.number().int().min(1).max(20),
  lookingFor: z.string().trim().max(160),
});
export const requestSchema = z.object({
  projectId: z.string().cuid(),
  message: z.string().trim().max(500),
});
export const messageSchema = z.object({
  requestId: z.string().cuid(),
  body: text(1, 1000),
});
export const surveySchema = z.object({
  year: text(1, 30),
  branch: text(2, 80),
  college: text(2, 120),
  awareness: z.coerce.number().int().min(1).max(5),
  discoveryMethod: text(2, 200),
  wantedCollaboration: z.enum(["yes", "no"]),
  likelihood: z.coerce.number().int().min(1).max(5),
  mostImportantFeature: z.enum([
    "Post projects",
    "Search projects",
    "Collaborate",
  ]),
  barrier: z.string().trim().max(500),
});
