import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import { STATUS_LABELS } from "@/lib/constants";
import { RequestForm } from "@/components/RequestForm";
import { VerifyForm } from "@/components/VerifyForm";
import { ShareProjectButton } from "@/components/ShareProjectButton";
import { VerificationCodeRequest } from "@/components/VerificationCodeRequest";
import { deleteProjectAction } from "@/app/actions";
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, user] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, college: true, state: true } },
        requests: { select: { fromUserId: true } },
      },
    }),
    getSessionUser(),
  ]);
  if (!project) notFound();
  const own = user?.id === project.ownerId;
  const requested = project.requests.some((r) => r.fromUserId === user?.id);
  return (
    <div className="container detail-page">
      <Link className="back" href="/projects">
        ← Back to projects
      </Link>
      <article className="project-detail">
        <div className="detail-main">
          <div className="card-top">
            <span className={`status ${project.status.toLowerCase()}`}>
              {STATUS_LABELS[project.status]}
            </span>
            {project.facultyVerified && (
              <span className="verified">Verified by {project.verifiedBy}</span>
            )}
            {project.isDemo && <span className="demo">Demo data</span>}
          </div>
          <h1>{project.title}</h1>
          <p className="meta">
            <MapPin size={16} />
            {project.owner.college}, {project.owner.state}
          </p>
          <div className="tags">
            {project.tech.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <section>
            <h2>About this project</h2>
            <p className="long-copy">{project.description}</p>
          </section>
          {project.lookingFor && (
            <section>
              <h2>Who they are looking for</h2>
              <p>{project.lookingFor}</p>
            </section>
          )}
          {project.githubUrl && (
            <a
              className="button secondary"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub <ExternalLink size={16} />
            </a>
          )}
        </div>
        <aside className="detail-aside">
          <h2>Project details</h2>
          <dl>
            <div>
              <dt>Posted by</dt>
              <dd>{project.owner.name}</dd>
            </div>
            <div>
              <dt>Team size</dt>
              <dd>
                <Users size={15} />
                {project.teamSize}
              </dd>
            </div>
            <div>
              <dt>Posted</dt>
              <dd>{formatDate(project.createdAt)}</dd>
            </div>
          </dl>
          {own ? (
            <>
              <div className="owner-actions">
                <Link className="button" href={`/projects/${id}/edit`}>
                  Edit project
                </Link>
                <form action={deleteProjectAction}>
                  <input type="hidden" name="id" value={id} />
                  <button className="danger">Delete project</button>
                </form>
              </div>
              {!project.facultyVerified && (
                <section className="faculty-verification owner-verification">
                  <h2>Request faculty verification</h2>
                  <p>
                    Copy the project link and create a one-time code. Send both
                    privately to your faculty guide.
                  </p>
                  <ShareProjectButton />
                  <VerificationCodeRequest id={id} />
                </section>
              )}
            </>
          ) : user ? (
            <>
              {!project.facultyVerified && (
                <section className="faculty-verification">
                  <h2>Faculty verification</h2>
                  <p>
                    Faculty guide? Enter your name and the one-time code the
                    project owner sent you.
                  </p>
                  <VerifyForm id={id} />
                </section>
              )}
              {requested ? (
                <p className="alert success">
                  You already requested to collaborate.
                </p>
              ) : (
                <>
                  <h2>Want to contribute?</h2>
                  <RequestForm projectId={id} />
                </>
              )}
            </>
          ) : (
            <div className="signin-prompt">
              <p>
                Sign in to request to collaborate or verify this project as a
                faculty guide.
              </p>
              <Link className="button" href="/login">
                Sign in
              </Link>
            </div>
          )}
        </aside>
      </article>
    </div>
  );
}
