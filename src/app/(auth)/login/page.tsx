import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";
export default async function LoginPage() {
  if (await getSessionUser()) redirect("/dashboard");
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Sign in to ProjectHub</h1>
        <p className="muted">
          Manage your projects and collaboration requests.
        </p>
        <AuthForm mode="login" />
        <div className="demo-credentials">
          <strong>Demo account</strong>
          <code>asha@example.com</code>
          <code>Demo@123</code>
        </div>
      </div>
    </div>
  );
}
