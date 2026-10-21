import { ProjectForm } from "@/components/ProjectForm";
import { requireUser } from "@/lib/auth";
export default async function NewProjectPage() {
  await requireUser();
  return (
    <div className="container narrow page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Share your work</p>
          <h1>Post a project</h1>
          <p>
            Give students enough detail to understand the work and contribute.
          </p>
        </div>
      </div>
      <ProjectForm />
    </div>
  );
}
