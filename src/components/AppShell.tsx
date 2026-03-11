"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import db from "../lib/db";
import { Button, Card, Input, cx } from "./ui";

const nav = [
  { href: "/", label: "Dashboard" },
  { href: "/whats-new", label: "What's New" },
  { href: "/key-dates", label: "Key Dates" },
  { href: "/color-palette", label: "Color Palette" },
  { href: "/inventory", label: "Inventory" },
  { href: "/checklist", label: "Checklist" },
  { href: "/orders", label: "Orders" },
  { href: "/training", label: "Training" },
  { href: "/equipment", label: "Equipment" },
  { href: "/drinks", label: "Drinks" },
];

const mobileNav = [
  { href: "/", label: "Home" },
  { href: "/checklist", label: "Checklist" },
  { href: "/orders", label: "Orders" },
  { href: "/training", label: "Training" },
];

export default function AppShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  const pathname = usePathname();
  const user = db.useUser();

  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <Card className="p-3 sticky top-6">
              <div className="flex items-center gap-2 px-2 py-2">
                <div className="h-9 w-9 rounded-xl bg-bm-orange text-white grid place-items-center font-extrabold">
                  B
                </div>
                <div>
                  <div className="text-sm font-extrabold tracking-tight">
                    BrewManager
                  </div>
                  <div className="text-[11px] text-black/50">
                    Learn. Manage. Improve.
                  </div>
                </div>
              </div>

              <nav className="mt-2 space-y-1">
                {nav.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cx(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition border",
                        active
                          ? "bg-white text-black border-black/10 shadow-sm"
                          : "bg-white/60 text-black/70 border-transparent hover:bg-white hover:border-black/10",
                      )}
                    >
                      <span
                        className={cx(
                          "inline-block h-2 w-2 rounded-full",
                          active ? "bg-bm-orange" : "bg-black/20",
                        )}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-3 border-t border-black/10 pt-3 px-2">
                <div className="text-[11px] text-black/50">Signed in as</div>
                <div className="text-sm font-semibold truncate">{user.email}</div>
                <div className="mt-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => db.auth.signOut()}
                  >
                    Sign out
                  </Button>
                </div>
              </div>
            </Card>
          </aside>

          <main>
            <div className="mb-4">
              <Card className="p-3 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-[200px]">
                    <div className="text-xs font-semibold text-black/60">
                      {title}
                    </div>
                    {subtitle ? (
                      <div className="mt-1 text-sm text-black/60">
                        {subtitle}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-[220px] max-w-xl">
                    <Input
                      placeholder="Search (coming soon)…"
                      aria-label="Search"
                    />
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="rounded-full bg-white border border-black/10 px-3 py-1 text-xs font-semibold text-black/60">
                      Reporting
                    </span>
                    <span className="rounded-full bg-white border border-black/10 px-3 py-1 text-xs font-semibold text-black/60">
                      Learning Path
                    </span>
                    <span className="rounded-full bg-white border border-black/10 px-3 py-1 text-xs font-semibold text-black/60">
                      Readiness
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {children}

            <div className="h-16 lg:hidden" />
          </main>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-black/10 bg-white">
        <div className="mx-auto max-w-6xl px-3 py-2">
          <div className="grid grid-cols-4 gap-2">
            {mobileNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "rounded-xl px-2 py-2 text-center text-xs font-extrabold border transition",
                    active
                      ? "bg-[color:var(--background)] border-black/10 text-black"
                      : "bg-white border-transparent text-black/60 hover:border-black/10",
                  )}
                >
                  <div
                    className={cx(
                      "mx-auto mb-1 h-1.5 w-6 rounded-full",
                      active ? "bg-bm-orange" : "bg-black/10",
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

