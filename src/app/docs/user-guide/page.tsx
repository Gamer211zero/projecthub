export default function UserGuide() {
  return (
    <article className="docs-article">
      <p className="docs-kicker">Help center</p>
      <h1>Using ProjectHub</h1>
      <p className="docs-lead">
        Find projects from colleges across India, share your own work, and
        connect with students who want to build together.
      </p>

      <h2>Get started</h2>
      <p>
        Create an account with your name, college, state, and email address.
        After signing in, Dashboard becomes your home for projects, requests,
        conversations, and updates.
      </p>

      <h2>Discover projects</h2>
      <p>
        Open <b>Projects</b> to see what students are working on. Use search or
        narrow the list by state, college, technology, or progress. You can
        share the page URL to send someone the same filtered view.
      </p>

      <h2>Share your work</h2>
      <ol>
        <li>Select <b>Post project</b> in the header.</li>
        <li>Give your project a clear title and description.</li>
        <li>Add the technologies you use, current status, and team size.</li>
        <li>If you need help, describe the kind of contributor you are looking for.</li>
        <li>Add a GitHub link when you have one.</li>
      </ol>
      <p>Your projects appear in Dashboard, where you can update their details or remove them.</p>

      <h2>Get a project verified by your faculty guide</h2>
      <ol>
        <li>Open your project page and select <b>Copy project link</b>.</li>
        <li>Select <b>Create verification code</b>. Each project gets its own one-time code, valid for seven days.</li>
        <li>Send both the link and code privately to your faculty guide, for example by email or WhatsApp.</li>
        <li>Your guide signs in or creates an account, opens your link, and enters their name and the code under <b>Faculty verification</b>.</li>
      </ol>
      <p>
        The code is shown to you when it is created. If it expires or is lost,
        create a new one; that replaces the previous code. Project owners cannot
        verify their own projects. Do not post the code publicly.
      </p>

      <h2>Join another project</h2>
      <p>
        Open a project and select <b>Send request</b>. A short, specific message
        helps the owner understand what you would like to contribute. You can
        follow the request from Dashboard.
      </p>

      <h2>Manage collaboration requests</h2>
      <p>
        When someone wants to join your project, their request appears in your
        collaboration inbox. You can accept it or decline it. Accepted requests
        open a private conversation for the two of you.
      </p>

      <h2>Continue a conversation</h2>
      <p>
        Select <b>Open chat</b> beside an accepted collaboration. Messages are
        available only to the project owner and the accepted collaborator.
      </p>

      <h2>Find projects that fit your skills</h2>
      <p>
        Open <b>For you</b> and add technologies you know or want to use. Your
        recommendations update to show relevant projects from other students.
      </p>

      <h2>Stay updated</h2>
      <p>
        The bell in the header shows new requests, decisions, and messages. Open
        Notifications to review them or mark them as read.
      </p>

      <h2>Analytics and student survey</h2>
      <p>
        Analytics presents an overview of activity across ProjectHub. The
        student survey is optional and anonymous. Select <b>Live results</b> to
        view combined responses.
      </p>

      <h2>Your account</h2>
      <p>
        Select your initials in the desktop header to open Dashboard,
        Notifications, or Sign out. On a phone, open the menu to find the same
        options.
      </p>

      <div className="docs-note">
        <b>Need help?</b> Start from Dashboard to see your projects, pending
        requests, collaborations, and recent activity in one place.
      </div>
    </article>
  );
}
