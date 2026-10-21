"use client";
import { useActionState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { sendMessageAction, type FormState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";

export function MessageForm({
  requestId,
  onSent,
}: {
  requestId: string;
  onSent?: () => void;
}) {
  const [state, action] = useActionState(sendMessageAction, {} as FormState);
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.success) {
      form.current?.reset();
      onSent?.();
    }
  }, [state, onSent]);
  return (
    <form ref={form} action={action} className="message-form">
      <input type="hidden" name="requestId" value={requestId} />
      <label className="sr-only" htmlFor="body">
        Message
      </label>
      <textarea
        id="body"
        name="body"
        required
        maxLength={1000}
        rows={1}
        placeholder="Message collaborator…"
        autoComplete="off"
      />
      {state.error && <p className="alert error">{state.error}</p>}
      <SubmitButton className="button message-send" pending="Sending…">
        <Send size={16} />
        <span>Send</span>
      </SubmitButton>
    </form>
  );
}
