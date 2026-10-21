"use client";
import { useActionState } from "react";
import { updateSkillsAction, type FormState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
export function SkillsForm({ skills }: { skills: string[] }) {
  const [state, action] = useActionState(updateSkillsAction, {} as FormState);
  return (
    <form action={action} className="inline-form">
      <label>
        Your skills
        <input
          name="skills"
          defaultValue={skills.join(", ")}
          placeholder="React, Python, IoT"
          maxLength={250}
        />
      </label>
      {state.success && <span className="success-text">{state.success}</span>}
      <SubmitButton>Update recommendations</SubmitButton>
    </form>
  );
}
