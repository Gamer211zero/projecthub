import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  FolderKanban,
  MessageSquare,
  Plus,
  Search,
  Send,
  Sparkles,
} from "lucide-react";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateRequestAction } from "@/app/actions";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await requireUser();
  const [projects, incoming, sent, unread] = await Promise.all([
    prisma.project.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { requests: true } } },
    }),
    prisma.collabRequest.findMany({
      where: { project: { ownerId: user.id } },
      orderBy: { createdAt: "desc" },
      include: {
        fromUser: { select: { name: true, college: true } },
        project: { select: { title: true } },
      },
    }),
    prisma.collabRequest.findMany({
      where: { fromUserId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        project: {
          select: { id: true, title: true, owner: { select: { name: true } } },
        },
      },
    }),
    prisma.notification.count({ where: { userId: user.id, read: false } }),
  ]);
  const pending = incoming.filter((item) => item.status === "PENDING");
  const accepted = [...incoming, ...sent].filter(
    (item) => item.status === "ACCEPTED",
  );

  return (
    <div className="container dashboard-page">
      <header className="dashboard-hero">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Good to see you, {user.name.split(" ")[0]}</h1>
          <p>
            {user.college} · {user.state}
          </p>
        </div>
        <Link className="button" href="/projects/new">
          <Plus size={17} /> Post a project
        </Link>
      </header>

      <div className="dashboard-layout">
        <aside className="dashboard-nav" aria-label="Dashboard sections">
          <p>Dashboard</p>
          <a href="#overview">
            <FolderKanban size={17} /> Overview
          </a>
          <a href="#projects">
            <FolderKanban size={17} /> My projects{" "}
            <span>{projects.length}</span>
          </a>
          <a href="#incoming">
            <MessageSquare size={17} /> Incoming <span>{pending.length}</span>
          </a>
          <a href="#sent">
            <Send size={17} /> Sent requests <span>{sent.length}</span>
          </a>
          <div className="dashboard-nav-divider" />
          <Link href="/recommendations">
            <Sparkles size={17} /> Recommended
          </Link>
          <Link href="/notifications">
            <Bell size={17} /> Notifications <span>{unread}</span>
          </Link>
          <Link href="/analytics">
            <CheckCircle2 size={17} /> Analytics
          </Link>
        </aside>

        <div className="dashboard-content">
          <section
            id="overview"
            className="dashboard-stats"
            aria-label="Account overview"
          >
            <div>
              <span className="stat-icon blue">
                <FolderKanban size={19} />
              </span>
              <p>My projects</p>
              <strong>{projects.length}</strong>
              <small>
                {projects.filter((p) => p.status === "IN_PROGRESS").length} in
                progress
              </small>
            </div>
            <div>
              <span className="stat-icon amber">
                <MessageSquare size={19} />
              </span>
              <p>Waiting for you</p>
              <strong>{pending.length}</strong>
              <small>collaboration requests</small>
            </div>
            <div>
              <span className="stat-icon green">
                <CheckCircle2 size={19} />
              </span>
              <p>Collaborations</p>
              <strong>{accepted.length}</strong>
              <small>accepted connections</small>
            </div>
            <div>
              <span className="stat-icon stone">
                <Bell size={19} />
              </span>
              <p>Unread updates</p>
              <strong>{unread}</strong>
              <small>new notifications</small>
            </div>
          </section>

          <section className="quick-actions" aria-label="Quick actions">
            <div>
              <h2>What would you like to do?</h2>
              <p>Continue your work or find something new.</p>
            </div>
            <div className="quick-action-links">
              <Link href="/projects/new">
                <Plus size={17} /> New project
              </Link>
              <Link href="/projects">
                <Search size={17} /> Explore projects
              </Link>
              <Link href="/recommendations">
                <Sparkles size={17} /> View matches
              </Link>
            </div>
          </section>

          <section id="projects" className="workspace-section">
            <div className="workspace-heading">
              <div>
                <h2>My projects</h2>
                <p>Manage the projects you have shared.</p>
              </div>
              <Link href="/projects/new">Add project</Link>
            </div>
            {projects.length ? (
              <div className="workspace-table">
                <div className="workspace-table-head">
                  <span>Project</span>
                  <span>Status</span>
                  <span>Requests</span>
                  <span>Updated</span>
                  <span></span>
                </div>
                {projects.map((project) => (
                  <div className="workspace-table-row" key={project.id}>
                    <div>
                      <Link
                        className="row-title"
                        href={`/projects/${project.id}`}
                      >
                        {project.title}
                      </Link>
                      {project.facultyVerified && (
                        <small className="verified-inline">
                          Faculty verified
                        </small>
                      )}
                    </div>
                    <span className={`status ${project.status.toLowerCase()}`}>
                      {STATUS_LABELS[project.status]}
                    </span>
                    <span>{project._count.requests}</span>
                    <span>{formatDate(project.updatedAt)}</span>
                    <Link href={`/projects/${project.id}/edit`}>Edit</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <FolderKanban size={28} />
                <h3>Your projects will appear here</h3>
                <p>
                  Share what you are building and invite students to contribute.
                </p>
                <Link className="button" href="/projects/new">
                  Post your first project
                </Link>
              </div>
            )}
          </section>

          <section id="incoming" className="workspace-section">
            <div className="workspace-heading">
              <div>
                <h2>Collaboration inbox</h2>
                <p>Review students who want to join your projects.</p>
              </div>
              <span>{pending.length} pending</span>
            </div>
            {incoming.length ? (
              <div className="request-list">
                {incoming.map((request) => (
                  <article className="request-item" key={request.id}>
                    <div className="request-avatar" aria-hidden>
                      {request.fromUser.name.charAt(0)}
                    </div>
                    <div className="request-copy">
                      <div>
                        <strong>{request.fromUser.name}</strong>
                        <span>for {request.project.title}</span>
                      </div>
                      <p>{request.fromUser.college}</p>
                      {request.message && (
                        <blockquote>{request.message}</blockquote>
                      )}
                      <small>{formatDate(request.createdAt)}</small>
                    </div>
                    {request.status === "PENDING" ? (
                      <div className="request-controls">
                        <form action={updateRequestAction}>
                          <input type="hidden" name="id" value={request.id} />
                          <input type="hidden" name="status" value="ACCEPTED" />
                          <button className="button small action-button">
                            Accept
                          </button>
                        </form>
                        <form action={updateRequestAction}>
                          <input type="hidden" name="id" value={request.id} />
                          <input type="hidden" name="status" value="REJECTED" />
                          <button className="button small secondary action-button">
                            Decline
                          </button>
                        </form>
                      </div>
                    ) : request.status === "ACCEPTED" ? (
                      <Link
                        className="button small secondary action-button"
                        href={`/messages/${request.id}`}
                      >
                        <MessageSquare size={15} /> Open chat
                      </Link>
                    ) : (
                      <span className="request-status rejected">Rejected</span>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <p>No collaboration requests yet.</p>
              </div>
            )}
          </section>

          <section id="sent" className="workspace-section">
            <div className="workspace-heading">
              <div>
                <h2>Requests I sent</h2>
                <p>Track your requests to other project teams.</p>
              </div>
              <span>{sent.length} total</span>
            </div>
            {sent.length ? (
              <div className="sent-list">
                {sent.map((request) => (
                  <div className="sent-row" key={request.id}>
                    <div>
                      <Link
                        className="row-title"
                        href={`/projects/${request.project.id}`}
                      >
                        {request.project.title}
                      </Link>
                      <p>
                        Project by {request.project.owner.name} ·{" "}
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="sent-status">
                      <span
                        className={`request-status ${request.status.toLowerCase()}`}
                      >
                        {request.status.toLowerCase()}
                      </span>
                      {request.status === "ACCEPTED" && (
                        <Link href={`/messages/${request.id}`}>Open chat</Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state compact">
                <p>You have not sent a request yet.</p>
                <Link href="/projects">Explore projects</Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
