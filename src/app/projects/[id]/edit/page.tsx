import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ProjectForm } from "@/components/ProjectForm";
export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [user, { id }] = await Promise.all([requireUser(), params]);
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project || project.ownerId !== user.id) notFound();
  return (
    <div className="container narrow page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Owner tools</p>
          <h1>Edit project</h1>
        </div>
      </div>
      <ProjectForm project={project} />
    </div>
  );
}
