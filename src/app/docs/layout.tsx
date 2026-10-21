import Link from "next/link";
import { BookOpen, Braces, Database, LockKeyhole, Rocket, UserRound } from "lucide-react";

const links = [
  ["Overview", "/docs", BookOpen], ["User guide", "/docs/user-guide", UserRound],
  ["Developer guide", "/docs/developer", Braces], ["API reference", "/docs/api", Database],
  ["Deployment", "/docs/deployment", Rocket], ["Security & privacy", "/docs/privacy", LockKeyhole],
] as const;

export default function DocsLayout({children}:{children:React.ReactNode}){return <div className="container docs-layout"><aside className="docs-sidebar"><div><span>PH</span><div><strong>Documentation</strong><small>ProjectHub India</small></div></div><nav>{links.map(([label,href,Icon])=><Link key={href} href={href}><Icon size={16}/>{label}</Link>)}</nav><p>Version 1.0 · October 2026</p></aside><div className="docs-content">{children}</div></div>}
