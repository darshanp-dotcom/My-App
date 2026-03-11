"use client";

import RequireAuth from "../../components/RequireAuth";
import AppShell from "../../components/AppShell";
import { Card } from "../../components/ui";

const items = [
  {
    date: "This week",
    title: "Window focus: speed + accuracy",
    body: "Pick one bottleneck, fix it for 3 days, then repeat. Small improvements compound fast.",
  },
  {
    date: "Today",
    title: "Training reminder: rush roles",
    body: "Before the rush, name stations out loud and confirm. Clarity prevents chaos.",
  },
  {
    date: "This month",
    title: "Waste reduction",
    body: "Run a quick waste log for 5 minutes at close—what got tossed and why.",
  },
];

export default function WhatsNewPage() {
  return (
    <RequireAuth>
      <AppShell title="What’s New" subtitle="Updates & reminders for managers">
        <div className="space-y-3">
          {items.map((i) => (
            <Card key={i.title}>
              <div className="flex items-start justify-between gap-3">
                <div className="text-lg font-extrabold tracking-tight">
                  {i.title}
                </div>
                <div className="text-[11px] font-semibold text-black/50">
                  {i.date}
                </div>
              </div>
              <div className="mt-2 text-sm text-black/60">{i.body}</div>
            </Card>
          ))}
        </div>
      </AppShell>
    </RequireAuth>
  );
}

