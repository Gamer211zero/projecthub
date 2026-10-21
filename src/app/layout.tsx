import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import "./globals.css";
import "./modern.css";
export const metadata: Metadata = {
  title: { default: "ProjectHub India", template: "%s | ProjectHub India" },
  description:
    "Discover student projects across India and find people to build with.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div>
              <strong>ProjectHub India</strong>
              <span>Student work, shared beyond campus.</span>
            </div>
            <nav>
              <Link href="/docs">Documentation</Link>
              <Link href="/docs/user-guide">User guide</Link>
              <Link href="/docs/api">API</Link>
              <Link href="/docs/privacy">Privacy</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
