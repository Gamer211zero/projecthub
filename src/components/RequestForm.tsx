"use client";
import { useActionState } from "react";
import { requestCollaborationAction, type FormState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
export function RequestForm({ projectId }: { projectId: string }) {
  const [state, action] = useActionState(
    requestCollaborationAction,
    {} as FormState,
  );
  return (
    <form action={action} className="request-form">
      <input type="hidden" name="projectId" value={projectId} />
      <label>
        Message <span className="optional">Optional</span>
        <textarea
          name="message"
          maxLength={500}
          rows={4}
          placeholder="Share how you would like to contribute."
        />
      </label>
      {state.error && <p className="alert error">{state.error}</p>}
      {state.success ? (
        <p className="alert success">{state.success}</p>
      ) : (
        <SubmitButton pending="Sending…">Send request</SubmitButton>
      )}
    </form>
  );
}
