import { redirect } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import { getSessionUser } from "@/lib/auth";
export default async function RegisterPage() {
  if (await getSessionUser()) redirect("/dashboard");
  return (
    <div className="auth-shell">
      <div className="auth-card wide">
        <p className="eyebrow">Join the community</p>
        <h1>Create your account</h1>
        <p className="muted">
          Share your work and meet students beyond your college.
        </p>
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
