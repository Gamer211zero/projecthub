import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChatThread } from "@/components/ChatThread";

export const dynamic = "force-dynamic";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ requestId: string }>;
}) {
  const [user, { requestId }] = await Promise.all([requireUser(), params]);
  const request = await prisma.collabRequest.findFirst({
    where: {
      id: requestId,
      status: "ACCEPTED",
      OR: [{ fromUserId: user.id }, { project: { ownerId: user.id } }],
    },
    include: {
      project: {
        select: {
          id: true,
          title: true,
          ownerId: true,
          owner: { select: { name: true } },
        },
      },
      fromUser: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        include: { sender: { select: { name: true } } },
      },
    },
  });
  if (!request) notFound();
  const other =
    user.id === request.project.ownerId
      ? request.fromUser.name
      : request.project.owner.name;
  return (
    <div className="container chat-page">
      <header className="chat-header">
        <Link
          className="chat-back"
          href="/dashboard"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={19} />
        </Link>
        <div className="chat-person">
          <span>{other.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{other}</strong>
            <p>
              <CheckCircle2 size={13} /> Accepted collaborator
            </p>
          </div>
        </div>
        <Link
          className="chat-project-link"
          href={`/projects/${request.project.id}`}
        >
          {request.project.title}
        </Link>
      </header>
      <ChatThread
        requestId={requestId}
        currentUserId={user.id}
        otherName={other}
        projectTitle={request.project.title}
        initialMessages={request.messages.map((message) => ({
          ...message,
          createdAt: message.createdAt.toISOString(),
          readAt: message.readAt?.toISOString() ?? null,
        }))}
      />
    </div>
  );
}
