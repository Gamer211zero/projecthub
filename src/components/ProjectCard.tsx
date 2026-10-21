import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type CardProject = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  status: "IDEA" | "IN_PROGRESS" | "COMPLETED";
  teamSize: number;
  lookingFor: string | null;
  isDemo: boolean;
  facultyVerified?: boolean;
  createdAt: Date;
  owner: { name: string; college: string; state: string };
};
export function ProjectCard({ project }: { project: CardProject }) {
  return (
    <article className="project-card">
      <div className="card-top">
        <span className={`status ${project.status.toLowerCase()}`}>
          {STATUS_LABELS[project.status]}
        </span>
        {project.facultyVerified && (
          <span className="verified">Faculty verified</span>
        )}
        {project.isDemo && <span className="demo">Demo data</span>}
      </div>
      <h3>
        <Link href={`/projects/${project.id}`}>{project.title}</Link>
      </h3>
      <p className="meta">
        <MapPin size={15} />
        {project.owner.college}, {project.owner.state}
      </p>
      <p className="description">{project.description}</p>
      <div className="tags">
        {project.tech.slice(0, 4).map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      {project.lookingFor && (
        <p className="looking">
          <strong>Looking for:</strong> {project.lookingFor}
        </p>
      )}
      <footer>
        <span>
          <Users size={15} /> {project.teamSize} member
          {project.teamSize === 1 ? "" : "s"}
        </span>
        <time>{formatDate(project.createdAt)}</time>
      </footer>
    </article>
  );
}
