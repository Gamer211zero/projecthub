import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ requestId: string }> },
) {
  const user = await getSessionUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { requestId } = await params;
  const request = await prisma.collabRequest.findFirst({
    where: {
      id: requestId,
      status: "ACCEPTED",
      OR: [{ fromUserId: user.id }, { project: { ownerId: user.id } }],
    },
    select: { id: true },
  });
  if (!request)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.message.updateMany({
    where: { requestId, senderId: { not: user.id }, readAt: null },
    data: { readAt: new Date() },
  });
  const messages = await prisma.message.findMany({
    where: { requestId },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      body: true,
      createdAt: true,
      readAt: true,
      senderId: true,
      sender: { select: { name: true } },
    },
  });
  return NextResponse.json(
    { messages },
    { headers: { "Cache-Control": "no-store" } },
  );
}
