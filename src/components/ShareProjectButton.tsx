"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function ShareProjectButton() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button className="button secondary share-project-button" type="button" onClick={copyLink}>
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Link copied" : "Copy project link"}
    </button>
  );
}
