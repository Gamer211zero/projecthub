import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

const COOKIE = "projecthub_session";
const secret = () =>
  new TextEncoder().encode(
    process.env.SESSION_SECRET ??
      "dev-only-secret-change-before-production-12345",
  );

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
export async function clearSession() {
  (await cookies()).delete(COOKIE);
}
export async function getSessionUser() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (typeof payload.userId !== "string") return null;
    return prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        college: true,
        state: true,
        skills: true,
      },
    });
  } catch {
    return null;
  }
}
export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/dashboard");
  return user;
}
