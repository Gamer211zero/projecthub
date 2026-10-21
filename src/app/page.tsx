import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Search,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/ProjectCard";
import { STATUS_LABELS } from "@/lib/constants";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [projects, projectCount, studentCount, stateRows, acceptedCount, user] =
    await Promise.all([
      prisma.project
        .findMany({
          take: 7,
          orderBy: [{ facultyVerified: "desc" }, { createdAt: "desc" }],
          include: {
            owner: { select: { name: true, college: true, state: true } },
          },
        })
        .catch(() => []),
      prisma.project.count().catch(() => 0),
      prisma.user.count().catch(() => 0),
      prisma.user
        .findMany({ distinct: ["state"], select: { state: true } })
        .catch(() => []),
      prisma.collabRequest
        .count({ where: { status: "ACCEPTED" } })
        .catch(() => 0),
      getSessionUser(),
    ]);
  const [featured, ...recent] = projects;

  return (
    <>
      <div className="home-hero-shell">
        <div className="container home-hero">
          <p className="home-kicker">Made by students. Open to India.</p>
          <h1>
            Great projects deserve
            <br />
            <span>to travel further.</span>
          </h1>
          <p className="home-intro">
            Discover what students are building beyond your campus—and find the
            right people to build the next version with you.
          </p>
          <div className="home-actions">
            <Link className="button home-primary" href="/projects">
              Explore projects <ArrowRight size={17} />
            </Link>
            <Link className="home-text-link" href="/projects/new">
              Share your work <ArrowRight size={15} />
            </Link>
          </div>
          <div className="home-metrics" aria-label="Live platform figures">
            <div>
              <strong>{projectCount}</strong>
              <span>projects shared</span>
            </div>
            <div>
              <strong>{studentCount}</strong>
              <span>student profiles</span>
            </div>
            <div>
              <strong>{stateRows.length}</strong>
              <span>states represented</span>
            </div>
            <div>
              <strong>{acceptedCount}</strong>
              <span>collaborations formed</span>
            </div>
          </div>
        </div>
      </div>

      {featured && (
        <section className="container home-featured">
          <div className="featured-copy">
            <p className="eyebrow">Project in focus</p>
            <span className={`status ${featured.status.toLowerCase()}`}>
              {STATUS_LABELS[featured.status]}
            </span>
            <h2>{featured.title}</h2>
            <p>{featured.description}</p>
            <div className="featured-meta">
              <span>
                <MapPin size={15} />
                {featured.owner.college}, {featured.owner.state}
              </span>
              <span>
                <Users size={15} />
                {featured.teamSize} team member
                {featured.teamSize === 1 ? "" : "s"}
              </span>
            </div>
            <div className="tags">
              {featured.tech.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <Link className="home-text-link" href={`/projects/${featured.id}`}>
              See the project <ArrowRight size={15} />
            </Link>
          </div>
          <div className="featured-visual" aria-hidden="true">
            <div className="visual-grid" />
            <div className="visual-window">
              <div className="visual-bar">
                <i />
                <i />
                <i />
              </div>
              <div className="visual-content">
                <span>PROJECTHUB / FEATURED</span>
                <strong>{featured.title}</strong>
                <div>
                  {featured.tech.slice(0, 3).map((item) => (
                    <b key={item}>{item}</b>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="home-band">
        <div className="container home-story">
          <p className="eyebrow">One platform, less friction</p>
          <h2>
            From “I have an idea” to
            <br />
            “we’re building it together.”
          </h2>
          <div className="story-steps">
            <article>
              <span>
                <Search size={20} />
              </span>
              <strong>Find meaningful work</strong>
              <p>
                Search real student projects by technology, college, state, and
                progress.
              </p>
            </article>
            <article>
              <span>
                <MessageCircle size={20} />
              </span>
              <strong>Make a thoughtful request</strong>
              <p>
                Tell the project owner how your experience can help their team.
              </p>
            </article>
            <article>
              <span>
                <CheckCircle2 size={20} />
              </span>
              <strong>Start collaborating</strong>
              <p>
                Once accepted, move into a private project conversation and get
                to work.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="container home-projects">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Across campuses</p>
            <h2>See what students are making now.</h2>
          </div>
          <Link href="/projects">
            View every project <ArrowRight size={15} />
          </Link>
        </div>
        {recent.length ? (
          <div className="project-grid">
            {recent.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No projects have been posted yet</h3>
            <p>Be the first student to share one.</p>
            <Link className="button" href="/projects/new">
              Post a project
            </Link>
          </div>
        )}
      </section>

      <section className="container home-cta">
        <p className="eyebrow">Your work belongs here</p>
        <h2>Building something worth sharing?</h2>
        <p>
          Give it a home beyond your classroom. Find feedback, contributors, and
          a wider student community.
        </p>
        <div>
          <Link className="button" href="/projects/new">
            Post your project
          </Link>
          <Link
            className="button secondary"
            href={user ? "/dashboard" : "/register"}
          >
            {user ? "Open dashboard" : "Create an account"}
          </Link>
        </div>
      </section>
    </>
  );
}
