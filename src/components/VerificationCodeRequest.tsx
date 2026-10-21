"use client";

import { useActionState, useState } from "react";
import { Check, Copy, KeyRound } from "lucide-react";
import {
  generateProjectVerificationCodeAction,
  type FormState,
} from "@/app/actions";
import { SubmitButton } from "./SubmitButton";

export function VerificationCodeRequest({ id }: { id: string }) {
  const [state, action] = useActionState(
    generateProjectVerificationCodeAction,
    {} as FormState,
  );
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    if (!state.verificationCode) return;
    try {
      await navigator.clipboard.writeText(state.verificationCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <form action={action} className="verification-code-request">
      <input type="hidden" name="id" value={id} />
      <p>
        Create a private code for your faculty guide. It is unique to this
        project, works once, and expires after 7 days.
      </p>
      {state.error && <p className="alert error">{state.error}</p>}
      {state.verificationCode ? (
        <div className="verification-code-result" aria-live="polite">
          <code>{state.verificationCode}</code>
          <button type="button" className="button secondary small" onClick={copyCode}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? "Copied" : "Copy code"}
          </button>
          <small>
            Send this code privately with the project link. Expires {new
              Intl.DateTimeFormat("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })
              .format(new Date(state.expiresAt ?? ""))}.
          </small>
        </div>
      ) : (
        <SubmitButton className="button secondary small">
          <KeyRound size={15} /> Create verification code
        </SubmitButton>
      )}
      {state.success && <p className="alert success">{state.success}</p>}
    </form>
  );
}
