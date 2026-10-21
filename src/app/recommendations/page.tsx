import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SkillsForm } from "@/components/SkillsForm";
import { ProjectCard } from "@/components/ProjectCard";
export const dynamic = "force-dynamic";
export default async function Recommendations() {
  const user = await requireUser();
  const projects = await prisma.project.findMany({
    where: {
      ownerId: { not: user.id },
      ...(user.skills.length ? { tech: { hasSome: user.skills } } : {}),
    },
    include: { owner: { select: { name: true, college: true, state: true } } },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  return (
    <div className="container page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Matched to your skills</p>
          <h1>Recommended projects</h1>
          <p>Projects sharing at least one technology with your profile.</p>
        </div>
      </div>
      <SkillsForm skills={user.skills} />
      {projects.length ? (
        <div className="project-grid recommendations">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No matches yet</h2>
          <p>Add skills above or browse all projects.</p>
        </div>
      )}
    </div>
  );
}
