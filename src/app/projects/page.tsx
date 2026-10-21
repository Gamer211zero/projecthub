import Link from "next/link";
import { Prisma, ProjectStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProjectCard } from "@/components/ProjectCard";
import { FilterBar } from "@/components/FilterBar";
export const dynamic = "force-dynamic";
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const p = await searchParams;
  const one = (k: string) => (typeof p[k] === "string" ? (p[k] as string) : "");
  const page = Math.max(1, Number(one("page")) || 1);
  const status = one("status");
  const where: Prisma.ProjectWhereInput = {
    ...(one("q") && {
      OR: [
        { title: { contains: one("q"), mode: "insensitive" } },
        { description: { contains: one("q"), mode: "insensitive" } },
      ],
    }),
    ...(one("state") && { owner: { state: one("state") } }),
    ...(one("college") && { owner: { college: one("college") } }),
    ...(one("tech") && { tech: { has: one("tech") } }),
    ...(Object.values(ProjectStatus).includes(status as ProjectStatus) && {
      status: status as ProjectStatus,
    }),
  };
  const [projects, total, collegeRows] = await Promise.all([
    prisma.project.findMany({
      where,
      skip: (page - 1) * 12,
      take: 12,
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { name: true, college: true, state: true } },
      },
    }),
    prisma.project.count({ where }),
    prisma.user.findMany({
      select: { college: true },
      distinct: ["college"],
      orderBy: { college: "asc" },
    }),
  ]);
  const pages = Math.ceil(total / 12);
  const qs = new URLSearchParams(
    Object.entries(p)
      .filter(([, v]) => typeof v === "string" && v)
      .map(([k, v]) => [k, v as string]),
  );
  const href = (n: number) => {
    qs.set("page", String(n));
    return `/projects?${qs}`;
  };
  return (
    <div className="container page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Discover</p>
          <h1>Browse student projects</h1>
          <p>
            {total} project{total === 1 ? "" : "s"} across colleges
          </p>
        </div>
        <Link className="button" href="/projects/new">
          Post your project
        </Link>
      </div>
      <div className="browse-layout">
        <FilterBar params={p} colleges={collegeRows.map((x) => x.college)} />
        <section>
          {projects.length ? (
            <div className="project-grid two">
              {projects.map((x) => (
                <ProjectCard key={x.id} project={x} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No projects match these filters yet</h2>
              <p>Try removing a filter or searching for another term.</p>
              <Link href="/projects">Clear filters</Link>
            </div>
          )}
          {pages > 1 && (
            <nav className="pagination">
              {page > 1 && <Link href={href(page - 1)}>Previous</Link>}
              <span>
                Page {page} of {pages}
              </span>
              {page < pages && <Link href={href(page + 1)}>Next</Link>}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
