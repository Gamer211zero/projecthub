"use client";
import { useActionState } from "react";
import { verifyProjectAction, type FormState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
export function VerifyForm({ id }: { id: string }) {
  const [state, action] = useActionState(verifyProjectAction, {} as FormState);
  return (
    <form action={action} className="verify-form">
      <input type="hidden" name="id" value={id} />
      <label>
        Faculty name
        <input name="name" required maxLength={100} />
      </label>
      <label>
        Verification code
        <input name="code" type="password" required />
      </label>
      {state.error && <p className="alert error">{state.error}</p>}
      {state.success ? (
        <p className="alert success">{state.success}</p>
      ) : (
        <SubmitButton className="button secondary small">
          Verify project
        </SubmitButton>
      )}
    </form>
  );
}
