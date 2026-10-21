import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container error-page">
      <p className="eyebrow">404</p>
      <h1>That page does not exist</h1>
      <p>The project may have been removed or the link is incorrect.</p>
      <Link className="button" href="/projects">
        Browse projects
      </Link>
    </div>
  );
}
