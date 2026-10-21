import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function SurveyResults() {
  const rows = await prisma.surveyResponse.findMany({
    orderBy: { createdAt: "desc" },
  });
  const avg = (key: "awareness" | "likelihood") =>
    rows.length
      ? (rows.reduce((s, r) => s + r[key], 0) / rows.length).toFixed(1)
      : "—";
  const wanted = rows.length
    ? Math.round(
        (rows.filter((r) => r.wantedCollaboration).length / rows.length) * 100,
      )
    : 0;
  const features = new Map<string, number>();
  rows.forEach((r) =>
    features.set(
      r.mostImportantFeature,
      (features.get(r.mostImportantFeature) ?? 0) + 1,
    ),
  );
  return (
    <div className="container page">
      <nav className="survey-tabs" aria-label="Survey navigation">
        <Link href="/survey">Take survey</Link>
        <Link className="active" href="/survey/results">
          Live results
        </Link>
      </nav>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Real responses only</p>
          <h1>Survey results</h1>
          <p>Live anonymous aggregates. No figures are invented.</p>
        </div>
      </div>
      {rows.length ? (
        <>
          <div className="stat-grid">
            <div className="stat">
              <strong>{rows.length}</strong>
              <span>Responses</span>
            </div>
            <div className="stat">
              <strong>{avg("awareness")}/5</strong>
              <span>Cross-college awareness</span>
            </div>
            <div className="stat">
              <strong>{avg("likelihood")}/5</strong>
              <span>Likelihood to use</span>
            </div>
            <div className="stat">
              <strong>{wanted}%</strong>
              <span>Wanted collaboration</span>
            </div>
          </div>
          <section className="analytics-grid">
            <div>
              <h2>Most important feature</h2>
              <div className="rank-list">
                {[...features]
                  .sort((a, b) => b[1] - a[1])
                  .map(([x, n]) => (
                    <div key={x}>
                      <span>{x}</span>
                      <b>{n}</b>
                    </div>
                  ))}
              </div>
            </div>
            <div>
              <h2>About these figures</h2>
              <p className="long-copy">
                These aggregates update whenever a real response is submitted.
                Report the sample size and collection method alongside every
                percentage.
              </p>
            </div>
          </section>
        </>
      ) : (
        <div className="empty-state">
          <h2>No responses yet</h2>
          <p>
            Share the survey link with students. Results will appear here
            automatically.
          </p>
          <Link className="button" href="/survey">
            Take the survey
          </Link>
        </div>
      )}
    </div>
  );
}
