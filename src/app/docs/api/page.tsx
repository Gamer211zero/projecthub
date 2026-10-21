export default function ApiDocs() {
  return (
    <article className="docs-article">
      <p className="docs-kicker">Internal application interface</p>
      <h1>API and server-action reference</h1>
      <p className="docs-lead">
        ProjectHub does not currently expose a public REST API. The browser
        calls typed Next.js server actions. They are private implementation
        interfaces, enforce validation and authorization, and may change
        between versions.
      </p>
      <div className="docs-warning">
        <b>Do not call server-action transport URLs as a public API.</b>
        <p>
          Next.js generates those endpoints internally. External integrations
          should receive purpose-built versioned route handlers.
        </p>
      </div>

      <h2>Authentication actions</h2>
      <div className="api-list">
        <section>
          <code>registerAction(formData)</code>
          <p>Creates a user, hashes the password, sets the session, and redirects to Dashboard.</p>
          <b>Access: Public</b>
        </section>
        <section>
          <code>loginAction(formData)</code>
          <p>Verifies credentials, applies an attempt limit, and creates a session.</p>
          <b>Access: Public</b>
        </section>
        <section>
          <code>logoutAction()</code>
          <p>Deletes the session cookie and redirects home.</p>
          <b>Access: Signed in</b>
        </section>
      </div>

      <h2>Project actions</h2>
      <div className="api-list">
        <section>
          <code>saveProjectAction(formData)</code>
          <p>Creates or edits a project, including its title, description, technologies, GitHub URL, status, team size, and collaboration needs.</p>
          <b>Authorization: owner required for edits</b>
        </section>
        <section>
          <code>deleteProjectAction(formData)</code>
          <p>Deletes a project only when its owner ID matches the current user.</p>
          <b>Authorization: owner</b>
        </section>
        <section>
          <code>generateProjectVerificationCodeAction(formData)</code>
          <p>Generates a random, single-use code for the owner’s project. Only a hash is stored; the code expires after seven days and creating another replaces it.</p>
          <b>Authorization: project owner</b>
        </section>
        <section>
          <code>verifyProjectAction(formData)</code>
          <p>Verifies a project using its active per-project code and the faculty member’s name. The owner cannot verify their own project. Successful verification consumes the code.</p>
          <b>Authorization: signed in, not project owner, valid unused code</b>
        </section>
      </div>

      <h2>Collaboration actions</h2>
      <div className="api-list">
        <section>
          <code>requestCollaborationAction(formData)</code>
          <p>Creates one request per user and project, prevents self-requests, notifies the owner, and optionally sends email.</p>
          <b>Constraint: unique project and user</b>
        </section>
        <section>
          <code>updateRequestAction(formData)</code>
          <p>Accepts or rejects a pending request. Only the project owner can change it.</p>
          <b>Values: ACCEPTED or REJECTED</b>
        </section>
        <section>
          <code>sendMessageAction(formData)</code>
          <p>Creates a message only when the user is a participant in an accepted collaboration.</p>
          <b>Maximum: 1,000 characters</b>
        </section>
      </div>

      <h2>Other actions</h2>
      <div className="api-list">
        <section><code>updateSkillsAction(formData)</code><p>Saves up to ten normalized skills for recommendations.</p></section>
        <section><code>markNotificationsReadAction()</code><p>Marks only the current user’s notifications as read.</p></section>
        <section><code>submitSurveyAction(formData)</code><p>Stores an anonymous response after validating rating ranges and lengths.</p></section>
      </div>

      <h2>Core models</h2>
      <p>
        <code>User</code>, <code>Project</code>, <code>CollabRequest</code>,
        <code>Message</code>, <code>Notification</code>, and
        <code>SurveyResponse</code>. The Prisma schema is authoritative.
      </p>
      <h2>Adding a public API</h2>
      <p>
        Create versioned handlers under <code>src/app/api/v1</code>. Add token
        authentication, rate limiting, Zod response contracts, CORS allowlists,
        audit logs, and OpenAPI documentation. Never expose password hashes,
        private email addresses, chat content, or verification codes.
      </p>
    </article>
  );
}
