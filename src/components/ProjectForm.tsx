"use client";
import { useActionState } from "react";
import { saveProjectAction, type FormState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";

type Existing = {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl: string | null;
  status: string;
  teamSize: number;
  lookingFor: string | null;
};
export function ProjectForm({ project }: { project?: Existing }) {
  const [state, action] = useActionState(saveProjectAction, {} as FormState);
  return (
    <form action={action} className="form-stack project-form">
      {project && <input type="hidden" name="id" value={project.id} />}{" "}
      {state.error && <p className="alert error">{state.error}</p>}
      <label>
        Project title
        <input
          name="title"
          required
          minLength={4}
          maxLength={100}
          defaultValue={project?.title}
          placeholder="A clear, specific title"
        />
      </label>
      <label>
        Description
        <textarea
          name="description"
          required
          minLength={30}
          maxLength={2000}
          rows={7}
          defaultValue={project?.description}
          placeholder="What does it solve, how does it work, and what have you built?"
        />
        <small>30–2,000 characters</small>
      </label>
      <label>
        Technologies
        <input
          name="tech"
          required
          maxLength={250}
          defaultValue={project?.tech.join(", ")}
          placeholder="React, Python, PostgreSQL"
        />
        <small>Separate tags with commas</small>
      </label>
      <div className="form-row">
        <label>
          Status
          <select name="status" defaultValue={project?.status ?? "IDEA"}>
            <option value="IDEA">Idea</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </label>
        <label>
          Team size
          <input
            name="teamSize"
            type="number"
            min={1}
            max={20}
            defaultValue={project?.teamSize ?? 1}
          />
        </label>
      </div>
      <label>
        Looking for <span className="optional">Optional</span>
        <input
          name="lookingFor"
          maxLength={160}
          defaultValue={project?.lookingFor ?? ""}
          placeholder="Backend developer, UI designer"
        />
      </label>
      <label>
        GitHub URL <span className="optional">Optional</span>
        <input
          name="githubUrl"
          type="url"
          maxLength={250}
          defaultValue={project?.githubUrl ?? ""}
          placeholder="https://github.com/..."
        />
      </label>
      <SubmitButton>{project ? "Save changes" : "Post project"}</SubmitButton>
    </form>
  );
}
