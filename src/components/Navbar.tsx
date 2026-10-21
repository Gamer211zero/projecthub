import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HeaderNav } from "./HeaderNav";

export async function Navbar() {
  const user = await getSessionUser();
  const unread = user
    ? await prisma.notification.count({
        where: { userId: user.id, read: false },
      })
    : 0;
  return (
    <header className="site-header">
      <div className="nav container">
        <Link href="/" className="brand" aria-label="ProjectHub India home">
          <span>PH</span>
          <b>ProjectHub</b>
        </Link>
        <HeaderNav user={user ? { name: user.name } : null} unread={unread} />
      </div>
    </header>
  );
}
