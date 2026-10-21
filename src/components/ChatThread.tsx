"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, WifiOff } from "lucide-react";
import { MessageForm } from "./MessageForm";

type ChatMessage = {
  id: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  senderId: string;
  sender: { name: string };
};

export function ChatThread({
  requestId,
  currentUserId,
  otherName,
  projectTitle,
  initialMessages,
}: {
  requestId: string;
  currentUserId: string;
  otherName: string;
  projectTitle: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [online, setOnline] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  const load = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages/${requestId}`, {
        cache: "no-store",
      });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { messages: ChatMessage[] };
      setMessages(data.messages);
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, [requestId]);
  useEffect(() => {
    const timer = window.setInterval(load, 2500);
    const refresh = () => load();
    window.addEventListener("online", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("online", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [load]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);
  const timestamp = (value: string) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  return (
    <>
      <main
        className="conversation"
        aria-label={`Conversation with ${otherName}`}
      >
        <div className="conversation-intro">
          <span>
            <MessageCircle size={22} />
          </span>
          <h1>{projectTitle}</h1>
          <p>This conversation is private between you and {otherName}.</p>
        </div>
        {!online && (
          <div className="chat-offline">
            <WifiOff size={14} /> You are offline. Messages will appear when the
            connection returns.
          </div>
        )}
        {messages.length ? (
          messages.map((message) => {
            const mine = message.senderId === currentUserId;
            return (
              <div
                key={message.id}
                className={`message-row ${mine ? "sent" : "received"}`}
              >
                {!mine && (
                  <span className="message-avatar" aria-hidden>
                    {message.sender.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="message-stack">
                  {!mine && <strong>{message.sender.name}</strong>}
                  <div className="message-bubble">
                    <p>{message.body}</p>
                  </div>
                  <div className="message-meta">
                    <time dateTime={message.createdAt}>
                      {timestamp(message.createdAt)}
                    </time>
                    {mine && message.readAt && <span>Read</span>}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="conversation-empty">
            <MessageCircle size={24} />
            <strong>Start the conversation</strong>
            <p>Say hello and decide what to work on first.</p>
          </div>
        )}
        <div ref={endRef} />
      </main>
      <div className="composer-shell">
        <MessageForm requestId={requestId} onSent={load} />
        <p>Only you and {otherName} can see these messages.</p>
      </div>
    </>
  );
}
