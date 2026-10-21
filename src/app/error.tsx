"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container error-page">
      <p className="eyebrow">Something went wrong</p>
      <h1>We could not load this page</h1>
      <p>
        Please try again. If the problem continues, check the database
        connection.
      </p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
