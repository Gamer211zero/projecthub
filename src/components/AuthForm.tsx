"use client";
import { useActionState } from "react";
import Link from "next/link";
import { loginAction, registerAction, type FormState } from "@/app/actions";
import { INDIAN_STATES } from "@/lib/constants";
import { SubmitButton } from "./SubmitButton";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction;
  const [state, formAction] = useActionState(action, {} as FormState);
  return (
    <form action={formAction} className="form-stack">
      {state.error && (
        <p className="alert error" role="alert">
          {state.error}
        </p>
      )}
      {mode === "register" && (
        <>
          <label>
            Name
            <input
              name="name"
              required
              minLength={2}
              maxLength={60}
              autoComplete="name"
            />
          </label>
          <label>
            College
            <input
              name="college"
              required
              maxLength={120}
              placeholder="e.g. NIT Calicut"
            />
          </label>
          <label>
            State
            <select name="state" required defaultValue="">
              <option value="" disabled>
                Select state
              </option>
              {INDIAN_STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </>
      )}
      <label>
        Email
        <input
          name="email"
          type="email"
          required
          maxLength={120}
          autoComplete="email"
        />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 8 : 1}
          maxLength={72}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
      </label>
      <SubmitButton
        pending={mode === "login" ? "Signing in…" : "Creating account…"}
      >
        {mode === "login" ? "Sign in" : "Create account"}
      </SubmitButton>
      <p className="form-foot">
        {mode === "login" ? (
          <>
            New here? <Link href="/register">Create an account</Link>
          </>
        ) : (
          <>
            Already registered? <Link href="/login">Sign in</Link>
          </>
        )}
      </p>
    </form>
  );
}
