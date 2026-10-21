import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markNotificationsReadAction } from "@/app/actions";
import { formatDate } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function NotificationsPage() {
  const user = await requireUser();
  const items = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return (
    <div className="container narrow page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Updates</p>
          <h1>Notifications</h1>
        </div>
        {items.some((x) => !x.read) && (
          <form action={markNotificationsReadAction}>
            <button className="button secondary">Mark all read</button>
          </form>
        )}
      </div>
      {items.length ? (
        <div className="data-list">
          {items.map((x) => (
            <div
              className={`notification-row ${x.read ? "" : "unread"}`}
              key={x.id}
            >
              <div>
                <strong>{x.title}</strong>
                <p>{x.body}</p>
                <small>{formatDate(x.createdAt)}</small>
              </div>
              {x.href && <Link href={x.href}>Open</Link>}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>You are all caught up</h2>
          <p>Requests, decisions, and new messages will appear here.</p>
        </div>
      )}
    </div>
  );
}
