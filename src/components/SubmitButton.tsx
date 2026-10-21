"use client";
import { useFormStatus } from "react-dom";
export function SubmitButton({
  children,
  pending = "Saving…",
  className = "button",
}: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
}) {
  const { pending: busy } = useFormStatus();
  return (
    <button className={className} disabled={busy}>
      {busy ? pending : children}
    </button>
  );
}
