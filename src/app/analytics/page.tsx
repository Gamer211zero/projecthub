import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function Analytics() {
  const [projects, users, requests, accepted, surveys, all] = await Promise.all(
    [
      prisma.project.count(),
      prisma.user.count(),
      prisma.collabRequest.count(),
      prisma.collabRequest.count({ where: { status: "ACCEPTED" } }),
      prisma.surveyResponse.count(),
      prisma.project.findMany({
        select: { tech: true, owner: { select: { state: true } } },
      }),
    ],
  );
  const tech = new Map<string, number>(),
    states = new Map<string, number>();
  for (const p of all) {
    states.set(p.owner.state, (states.get(p.owner.state) ?? 0) + 1);
    for (const t of p.tech) tech.set(t, (tech.get(t) ?? 0) + 1);
  }
  const top = (m: Map<string, number>) =>
    [...m].sort((a, b) => b[1] - a[1]).slice(0, 8);
  return (
    <div className="container page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Platform activity</p>
          <h1>ProjectHub analytics</h1>
          <p>Live aggregate figures from the platform database.</p>
        </div>
      </div>
      <div className="stat-grid">
        {[
          [projects, "Projects"],
          [users, "Students"],
          [requests, "Requests"],
          [accepted, "Accepted collaborations"],
          [surveys, "Survey responses"],
        ].map(([n, l]) => (
          <div className="stat" key={String(l)}>
            <strong>{n}</strong>
            <span>{l}</span>
          </div>
        ))}
      </div>
      <div className="analytics-grid">
        <section>
          <h2>Popular technologies</h2>
          <div className="rank-list">
            {top(tech).map(([name, count]) => (
              <div key={name}>
                <span>{name}</span>
                <b>{count}</b>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2>Projects by state</h2>
          <div className="rank-list">
            {top(states).map(([name, count]) => (
              <div key={name}>
                <span>{name}</span>
                <b>{count}</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
