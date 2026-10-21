"use server";

import bcrypt from "bcryptjs";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, clearSession, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  loginSchema,
  messageSchema,
  projectSchema,
  registerSchema,
  requestSchema,
  surveySchema,
} from "@/lib/validators";
import { field, splitTech } from "@/lib/utils";
import { sendEmail } from "@/lib/email";

export type FormState = {
  error?: string;
  success?: string;
  verificationCode?: string;
  expiresAt?: string;
};
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

export async function registerAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = registerSchema.safeParse(Object.fromEntries(formData));
  if (!result.success)
    return { error: result.error.issues[0]?.message ?? "Check your details." };
  const email = result.data.email.toLowerCase();
  if (await prisma.user.findUnique({ where: { email }, select: { id: true } }))
    return { error: "An account with this email already exists." };
  const { password, ...profile } = result.data;
  const user = await prisma.user.create({
    data: { ...profile, email, passwordHash: await bcrypt.hash(password, 12) },
  });
  await createSession(user.id);
  redirect("/dashboard");
}

export async function loginAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = loginSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: "Enter a valid email and password." };
  const email = result.data.email.toLowerCase();
  const attempt = loginAttempts.get(email);
  if (attempt && attempt.resetAt > Date.now() && attempt.count >= 5)
    return { error: "Too many attempts. Try again in 15 minutes." };
  const user = await prisma.user.findUnique({ where: { email } });
  if (
    !user ||
    !(await bcrypt.compare(result.data.password, user.passwordHash))
  ) {
    loginAttempts.set(email, {
      count: (attempt?.count ?? 0) + 1,
      resetAt: Date.now() + 15 * 60_000,
    });
    return { error: "Email or password is incorrect." };
  }
  loginAttempts.delete(email);
  await createSession(user.id);
  redirect("/dashboard");
}

export async function logoutAction() {
  await clearSession();
  redirect("/");
}

export async function saveProjectAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const result = projectSchema.safeParse(Object.fromEntries(formData));
  if (!result.success)
    return {
      error: result.error.issues[0]?.message ?? "Check the project details.",
    };
  const id = field(formData, "id");
  const data = {
    ...result.data,
    tech: splitTech(result.data.tech),
    githubUrl: result.data.githubUrl || null,
    lookingFor: result.data.lookingFor || null,
  };
  if (id) {
    const found = await prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!found || found.ownerId !== user.id)
      return { error: "You can only edit your own projects." };
    await prisma.project.update({ where: { id }, data });
  } else await prisma.project.create({ data: { ...data, ownerId: user.id } });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect(id ? `/projects/${id}` : "/dashboard");
}

export async function deleteProjectAction(formData: FormData) {
  const user = await requireUser();
  const id = field(formData, "id");
  await prisma.project.deleteMany({ where: { id, ownerId: user.id } });
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function requestCollaborationAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const result = requestSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: "Your message is too long." };
  const project = await prisma.project.findUnique({
    where: { id: result.data.projectId },
    select: { ownerId: true },
  });
  if (!project) return { error: "Project not found." };
  if (project.ownerId === user.id)
    return { error: "You cannot request your own project." };
  try {
    await prisma.collabRequest.create({
      data: {
        ...result.data,
        message: result.data.message || null,
        fromUserId: user.id,
      },
    });
    await prisma.notification.create({
      data: {
        userId: project.ownerId,
        title: "New collaboration request",
        body: `${user.name} wants to join your project.`,
        href: "/dashboard",
      },
    });
    const owner = await prisma.user.findUnique({
      where: { id: project.ownerId },
      select: { email: true },
    });
    if (owner)
      await sendEmail(
        owner.email,
        "New ProjectHub collaboration request",
        `${user.name} sent a collaboration request. Open your ProjectHub dashboard to respond.`,
      );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return { error: "You already sent a request for this project." };
    throw error;
  }
  revalidatePath(`/projects/${result.data.projectId}`);
  revalidatePath("/dashboard");
  return { success: "Request sent. You can track it in your dashboard." };
}

export async function updateRequestAction(formData: FormData) {
  const user = await requireUser();
  const id = field(formData, "id");
  const status = field(formData, "status");
  if (status !== "ACCEPTED" && status !== "REJECTED") return;
  const request = await prisma.collabRequest.findFirst({
    where: { id, project: { ownerId: user.id }, status: "PENDING" },
    include: {
      project: { select: { title: true } },
      fromUser: { select: { email: true } },
    },
  });
  if (!request) return;
  await prisma.collabRequest.update({ where: { id }, data: { status } });
  await prisma.notification.create({
    data: {
      userId: request.fromUserId,
      title: `Request ${status.toLowerCase()}`,
      body: `Your request for ${request.project.title} was ${status.toLowerCase()}.`,
      href: status === "ACCEPTED" ? `/messages/${id}` : "/dashboard",
    },
  });
  await sendEmail(
    request.fromUser.email,
    `ProjectHub request ${status.toLowerCase()}`,
    `Your collaboration request for ${request.project.title} was ${status.toLowerCase()}.`,
  );
  revalidatePath("/dashboard");
}

export async function sendMessageAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const result = messageSchema.safeParse(Object.fromEntries(formData));
  if (!result.success)
    return { error: "Message must be between 1 and 1,000 characters." };
  const request = await prisma.collabRequest.findFirst({
    where: {
      id: result.data.requestId,
      status: "ACCEPTED",
      OR: [{ fromUserId: user.id }, { project: { ownerId: user.id } }],
    },
    include: {
      project: { select: { ownerId: true, title: true } },
      fromUser: { select: { id: true } },
    },
  });
  if (!request)
    return { error: "Chat is available only to accepted collaborators." };
  await prisma.message.create({ data: { ...result.data, senderId: user.id } });
  const recipientId =
    user.id === request.project.ownerId
      ? request.fromUser.id
      : request.project.ownerId;
  await prisma.notification.create({
    data: {
      userId: recipientId,
      title: `New message about ${request.project.title}`,
      body: `${user.name} sent you a message.`,
      href: `/messages/${request.id}`,
    },
  });
  revalidatePath(`/messages/${request.id}`);
  return { success: "sent" };
}

export async function markNotificationsReadAction() {
  const user = await requireUser();
  await prisma.notification.updateMany({
    where: { userId: user.id, read: false },
    data: { read: true },
  });
  revalidatePath("/notifications");
  revalidatePath("/");
}

export async function verifyProjectAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const id = field(formData, "id"),
    code = field(formData, "code"),
    name = field(formData, "name").trim();
  const project = await prisma.project.findUnique({
    where: { id },
    select: {
      ownerId: true,
      facultyVerified: true,
      verificationCodeHash: true,
      verificationCodeExpiresAt: true,
    },
  });
  if (!project) return { error: "Project not found." };
  if (project.ownerId === user.id)
    return {
      error:
        "Project owners cannot verify their own project. Ask your faculty guide.",
    };
  if (project.facultyVerified)
    return { error: "This project has already been verified." };
  if (
    !project.verificationCodeHash ||
    !project.verificationCodeExpiresAt ||
    project.verificationCodeExpiresAt <= new Date()
  )
    return {
      error:
        "This code is missing or expired. Ask the project owner for a new one.",
    };
  const expectedHash = Buffer.from(project.verificationCodeHash, "hex");
  const submittedHash = Buffer.from(
    createHash("sha256").update(code.trim().toUpperCase()).digest("hex"),
    "hex",
  );
  if (
    expectedHash.length !== submittedHash.length ||
    !timingSafeEqual(expectedHash, submittedHash)
  )
    return { error: "The faculty verification code is incorrect." };
  if (name.length < 2 || name.length > 100)
    return { error: "Enter the faculty member's name." };
  const updated = await prisma.project.updateMany({
    where: {
      id,
      facultyVerified: false,
      verificationCodeHash: project.verificationCodeHash,
    },
    data: {
      facultyVerified: true,
      verifiedBy: name,
      verificationCodeHash: null,
      verificationCodeExpiresAt: null,
    },
  });
  if (updated.count !== 1)
    return {
      error: "This code was already used. Ask the project owner for a new one.",
    };
  revalidatePath(`/projects/${id}`);
  return { success: "Project verified by faculty." };
}

export async function generateProjectVerificationCodeAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const id = field(formData, "id");
  const project = await prisma.project.findUnique({
    where: { id },
    select: { ownerId: true, facultyVerified: true },
  });
  if (!project) return { error: "Project not found." };
  if (project.ownerId !== user.id)
    return { error: "Only the project owner can create a verification code." };
  if (project.facultyVerified)
    return { error: "This project has already been verified." };

  const verificationCode = randomBytes(8).toString("hex").toUpperCase();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const verificationCodeHash = createHash("sha256")
    .update(verificationCode)
    .digest("hex");
  await prisma.project.update({
    where: { id },
    data: { verificationCodeHash, verificationCodeExpiresAt: expiresAt },
  });
  revalidatePath(`/projects/${id}`);
  return {
    success: "Code created. Send it privately with the project link.",
    verificationCode,
    expiresAt: expiresAt.toISOString(),
  };
}

export async function updateSkillsAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const skills = splitTech(field(formData, "skills"));
  await prisma.user.update({ where: { id: user.id }, data: { skills } });
  revalidatePath("/recommendations");
  return { success: "Skills updated." };
}

export async function submitSurveyAction(
  _: FormState,
  formData: FormData,
): Promise<FormState> {
  const result = surveySchema.safeParse(Object.fromEntries(formData));
  if (!result.success)
    return {
      error: result.error.issues[0]?.message ?? "Check your responses.",
    };
  await prisma.surveyResponse.create({
    data: {
      ...result.data,
      wantedCollaboration: result.data.wantedCollaboration === "yes",
      barrier: result.data.barrier || null,
    },
  });
  revalidatePath("/survey/results");
  return { success: "Thank you. Your response has been recorded." };
}
