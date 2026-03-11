"use client";

import Link from "next/link";
import AppShell from "../components/AppShell";
import RequireAuth from "../components/RequireAuth";
import { Button, Card } from "../components/ui";
import db from "../lib/db";
import { formatDateLabel, yyyymmdd } from "../lib/date";

export default function HomePage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}

function Dashboard() {
  const user = db.useUser();
  const today = yyyymmdd();

  const { isLoading, error, data } = db.useQuery({
    tasks: { $: { where: { userId: user.id, date: today } } },
    metrics: { $: { where: { userId: user.id, date: today } } },
    orders: { $: { where: { userId: user.id } } },
  });

  const tasks = data?.tasks ?? [];
  const metrics = (data?.metrics ?? [])[0];
  const orders = (data?.orders ?? []).slice().sort((a, b) => b.createdAt - a.createdAt);
  const latestOrder = orders[0];

  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <AppShell
      title="Home dashboard"
      subtitle={`Today • ${formatDateLabel(today)}`}
    >
      {isLoading ? (
        <div className="text-sm text-black/60">Loading your dashboard…</div>
      ) : error ? (
        <div className="rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
          {error.message}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <Card className="overflow-hidden p-0">
              <div className="p-4 sm:p-5 bg-gradient-to-r from-bm-orange/20 via-bm-pink/10 to-bm-brown/10">
                <div className="text-xs font-semibold text-black/60">
                  Welcome
                </div>
                <div className="mt-1 text-2xl font-extrabold tracking-tight">
                  {user.email?.split("@")[0] ? `Welcome, ${user.email.split("@")[0]}!` : "Welcome!"}
                </div>
                <div className="mt-1 text-sm text-black/60">
                  Quick links for today’s shift: checklist, numbers, and orders.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link href="/checklist">
                    <Button>Open checklist</Button>
                  </Link>
                  <Link href="/metrics">
                    <Button variant="secondary">
                      {metrics ? "Edit metrics" : "Add metrics"}
                    </Button>
                  </Link>
                  <Link href="/orders">
                    <Button variant="secondary">Order analyzer</Button>
                  </Link>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-black/60">
                    Store performance (today)
                  </div>
                  <div className="mt-1 text-lg font-extrabold tracking-tight">
                    {metrics ? "Performance snapshot" : "Add today’s numbers"}
                  </div>
                  <div className="mt-1 text-sm text-black/60">
                    A quick snapshot helps you spot problems early.
                  </div>
                </div>
                <Link href="/metrics">
                  <Button>{metrics ? "Edit" : "Add"}</Button>
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                <Stat
                  label="Sales"
                  value={metrics ? `$${metrics.salesToday}` : "—"}
                  mono
                />
                <Stat
                  label="Labor"
                  value={metrics ? `${metrics.laborPct}%` : "—"}
                  mono
                />
                <Stat
                  label="Food cost"
                  value={metrics ? `${metrics.foodCostPct}%` : "—"}
                  mono
                />
                <Stat
                  label="Drive‑thru"
                  value={metrics ? fmtSeconds(metrics.driveThruSeconds) : "—"}
                  mono
                />
                <Stat
                  label="Waste"
                  value={metrics ? `$${metrics.wasteCost}` : "—"}
                  mono
                />
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-black/60">
                    What’s new
                  </div>
                  <div className="mt-1 text-lg font-extrabold tracking-tight">
                    Updates for managers
                  </div>
                  <div className="mt-1 text-sm text-black/60">
                    Keep this as a quick bulletin board for your store.
                  </div>
                </div>
                <Link href="/whats-new">
                  <Button variant="secondary">View all</Button>
                </Link>
              </div>

              <div className="mt-4 space-y-2">
                <WhatsNewRow
                  title="Window focus: speed + accuracy"
                  dateLabel="This week"
                  body="Pick one bottleneck, fix it for 3 days, then repeat."
                />
                <WhatsNewRow
                  title="Training reminder: rush roles"
                  dateLabel="Today"
                  body="Before the rush, name stations out loud and confirm."
                />
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-black/60">
                    Latest NDCP order breakdown
                  </div>
                  <div className="mt-1 text-lg font-extrabold tracking-tight">
                    {latestOrder ? `$${latestOrder.total}` : "No order saved yet"}
                  </div>
                  <div className="mt-1 text-sm text-black/60">
                    Save your totals and we’ll break them into categories.
                  </div>
                </div>
                <Link href="/orders">
                  <Button>{latestOrder ? "View" : "Add"}</Button>
                </Link>
              </div>

              {latestOrder ? (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-6">
                  <Stat label="Food" value={`$${latestOrder.foodCost}`} mono />
                  <Stat label="Dairy" value={`$${latestOrder.dairy}`} mono />
                  <Stat label="Retail" value={`$${latestOrder.retail}`} mono />
                  <Stat label="Paper" value={`$${latestOrder.paperGoods}`} mono />
                  <Stat label="Cleaning" value={`$${latestOrder.cleaning}`} mono />
                  <Stat label="Total" value={`$${latestOrder.total}`} mono strong />
                </div>
              ) : null}
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <div className="text-xs font-semibold text-black/60">
                Daily checklist
              </div>
              <div className="mt-1 text-lg font-extrabold tracking-tight">
                {total ? `${pct}% complete` : "Not started"}
              </div>
              <div className="mt-1 text-sm text-black/60">
                {total
                  ? `${done} of ${total} tasks done`
                  : "Add tasks to stay on track."}
              </div>
              <div className="mt-4">
                <Link href="/checklist">
                  <Button className="w-full">Open checklist</Button>
                </Link>
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold text-black/60">
                    Key dates
                  </div>
                  <div className="mt-1 text-lg font-extrabold tracking-tight">
                    Upcoming reminders
                  </div>
                </div>
                <Link href="/key-dates">
                  <Button variant="secondary">View</Button>
                </Link>
              </div>
              <div className="mt-4 space-y-2">
                <KeyDateRow date="Mar 17" title="St. Patrick’s Day" />
                <KeyDateRow date="Apr 01" title="Monthly inventory check-in" />
                <KeyDateRow date="Apr 15" title="Schedule review" />
              </div>
            </Card>

            <Card>
              <div className="text-xs font-semibold text-black/60">
                Quick access
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link href="/equipment">
                  <Button variant="secondary" className="w-full">
                    Equipment
                  </Button>
                </Link>
                <Link href="/drinks">
                  <Button variant="secondary" className="w-full">
                    Drinks
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Stat({
  label,
  value,
  mono,
  strong,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white px-3 py-2">
      <div className="text-[11px] font-semibold text-black/50">{label}</div>
      <div className={`mt-0.5 text-sm ${mono ? "font-mono" : ""} ${strong ? "font-extrabold" : "font-semibold"}`}>
        {value}
      </div>
    </div>
  );
}

function fmtSeconds(s: number) {
  const mins = Math.floor(s / 60);
  const secs = s % 60;
  return `${mins}m ${String(secs).padStart(2, "0")}s`;
}

function WhatsNewRow({
  title,
  dateLabel,
  body,
}: {
  title: string;
  dateLabel: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="text-sm font-extrabold">{title}</div>
        <div className="text-[11px] font-semibold text-black/50">{dateLabel}</div>
      </div>
      <div className="mt-1 text-sm text-black/60">{body}</div>
    </div>
  );
}

function KeyDateRow({ date, title }: { date: string; title: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-3 py-2">
      <div className="text-xs font-extrabold text-bm-orange">{date}</div>
      <div className="flex-1 text-sm font-semibold text-black/70">{title}</div>
    </div>
  );
}
