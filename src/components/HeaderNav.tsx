"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, LogOut, Menu, Plus, X } from "lucide-react";
import { logoutAction } from "@/app/actions";

type User = { name: string } | null;

export function HeaderNav({ user, unread }: { user: User; unread: number }) {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const pathname = usePathname();
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);
  const active = (href: string) =>
    pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`));
  useEffect(() => {
    if (!accountOpen && !open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (
        accountOpen &&
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target as Node)
      )
        setAccountOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen, open]);
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);
  return (
    <>
      <div className="desktop-navigation">
        <div className="primary-links">
          {user && (
            <Link
              className={active("/dashboard") ? "active-nav" : ""}
              href="/dashboard"
            >
              Dashboard
            </Link>
          )}
          <Link
            className={active("/projects") ? "active-nav" : ""}
            href="/projects"
          >
            Projects
          </Link>
          {user && (
            <Link
              className={active("/recommendations") ? "active-nav" : ""}
              href="/recommendations"
            >
              For you
            </Link>
          )}
          <Link
            className={active("/analytics") ? "active-nav" : ""}
            href="/analytics"
          >
            Analytics
          </Link>
          <Link
            className={active("/survey") ? "active-nav" : ""}
            href="/survey"
          >
            Survey
          </Link>
        </div>
        <div className="account-links">
          {user ? (
            <>
              <Link className="nav-create" href="/projects/new">
                <Plus size={15} /> Post project
              </Link>
              <Link
                className="icon-control"
                href="/notifications"
                aria-label={`${unread} unread notifications`}
              >
                <Bell size={18} />
                {unread > 0 && <span>{unread > 9 ? "9+" : unread}</span>}
              </Link>
              <div className="account-menu-wrap" ref={accountMenuRef}>
                <button
                  className="nav-avatar"
                  onClick={() => setAccountOpen((value) => !value)}
                  aria-label="Open account menu"
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                >
                  {user.name.charAt(0).toUpperCase()}
                </button>
                {accountOpen && (
                  <div className="account-menu" role="menu">
                    <div>
                      <strong>{user.name}</strong>
                      <span>Signed in</span>
                    </div>
                    <Link
                      href="/dashboard"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/notifications"
                      role="menuitem"
                      onClick={() => setAccountOpen(false)}
                    >
                      Notifications {unread > 0 && <b>{unread}</b>}
                    </Link>
                    <form action={logoutAction}>
                      <button role="menuitem">
                        <LogOut size={15} /> Sign out
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link className="nav-create" href="/register">
                Create account
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="mobile-controls">
        {user && (
          <Link
            className="icon-control"
            href="/notifications"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unread > 0 && <span>{unread > 9 ? "9+" : unread}</span>}
          </Link>
        )}
        <button
          className="icon-control"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu size={20} />
        </button>
      </div>
      {open && typeof document !== "undefined" && createPortal(
        <div
          className="mobile-menu-shell"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2147483000,
            width: "100vw",
            height: "100dvh",
            overflow: "hidden",
            isolation: "isolate",
            backgroundColor: "#f5f5f7",
            opacity: 1,
          }}
        >
          <button
            className="mobile-menu-backdrop"
            onClick={close}
            aria-label="Close menu"
          />
          <div
            className="mobile-menu"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              maxWidth: "none",
              height: "100%",
              backgroundColor: "#f5f5f7",
              opacity: 1,
            }}
          >
            <div className="mobile-menu-top">
              <div>
                {user ? (
                  <>
                    <span className="nav-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <strong>{user.name}</strong>
                  </>
                ) : (
                  <strong>ProjectHub India</strong>
                )}
              </div>
              <button
                className="icon-control"
                onClick={close}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav onClick={close}>
              {user && (
                <Link
                  className={active("/dashboard") ? "mobile-active" : ""}
                  href="/dashboard"
                >
                  <span>Dashboard</span>
                  <ChevronRight size={18} />
                </Link>
              )}
              <Link
                className={active("/projects") ? "mobile-active" : ""}
                href="/projects"
              >
                <span>Projects</span>
                <ChevronRight size={18} />
              </Link>
              {user && (
                <Link
                  className={active("/recommendations") ? "mobile-active" : ""}
                  href="/recommendations"
                >
                  <span>For you</span>
                  <ChevronRight size={18} />
                </Link>
              )}
              <Link
                className={active("/analytics") ? "mobile-active" : ""}
                href="/analytics"
              >
                <span>Analytics</span>
                <ChevronRight size={18} />
              </Link>
              <Link
                className={active("/survey") ? "mobile-active" : ""}
                href="/survey"
              >
                <span>Student survey</span>
                <ChevronRight size={18} />
              </Link>
            </nav>
            {user ? (
              <div className="mobile-menu-actions">
                <Link className="button" href="/projects/new" onClick={close}>
                  <Plus size={17} /> Post a project
                </Link>
                <form action={logoutAction}>
                  <button>
                    <LogOut size={17} /> Sign out
                  </button>
                </form>
              </div>
            ) : (
              <div className="mobile-menu-actions">
                <Link className="button" href="/register" onClick={close}>
                  Create account
                </Link>
                <Link
                  className="button secondary"
                  href="/login"
                  onClick={close}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
