"use client";

import RequireAuth from "../../components/RequireAuth";
import AppShell from "../../components/AppShell";
import { Card } from "../../components/ui";

const dates = [
  { date: "Mar 17", title: "St. Patrick’s Day", body: "Expect higher volume. Confirm rush stations + restocks." },
  { date: "Apr 01", title: "Monthly inventory check-in", body: "Do a quick count of top movers (coffee, milk, cups, lids)." },
  { date: "Apr 15", title: "Schedule review", body: "Check coverage against sales patterns and adjust." },
];

export default function KeyDatesPage() {
  return (
    <RequireAuth>
      <AppShell title="Key Dates" subtitle="A simple reminders board">
        <div className="space-y-3">
          {dates.map((d) => (
            <Card key={d.title}>
              <div className="flex items-start justify-between gap-3">
                <div className="text-lg font-extrabold tracking-tight">
                  {d.title}
                </div>
                <div className="text-xs font-extrabold text-bm-orange">{d.date}</div>
              </div>
              <div className="mt-2 text-sm text-black/60">{d.body}</div>
            </Card>
          ))}
        </div>
      </AppShell>
    </RequireAuth>
  );
}

