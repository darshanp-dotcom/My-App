"use client";

import RequireAuth from "../../components/RequireAuth";
import AppShell from "../../components/AppShell";
import { Card } from "../../components/ui";

type Resource = {
  title: string;
  why: string;
  href: string;
  source: string;
};

const resources: Array<{ section: string; items: Resource[] }> = [
  {
    section: "Espresso machine not brewing",
    items: [
      {
        title: "Reset and fix common Breville espresso issues (video)",
        why: "Good walkthrough of common no-brew problems (water flow, pressure, resets).",
        href: "https://www.youtube.com/watch?v=9KrE79BUR44",
        source: "YouTube",
      },
      {
        title: "Espresso machine troubleshooting (video)",
        why: "General troubleshooting steps you can adapt to similar machines.",
        href: "https://www.youtube.com/watch?v=rQC1m16osJE",
        source: "YouTube",
      },
      {
        title: "Step-by-step troubleshooting guide (article)",
        why: "Quick checklist for clogs, descaling, pump/airlock issues.",
        href: "https://espressoatlas.com/articles/how-to-troubleshoot-espresso-machine-problems",
        source: "Espresso Atlas",
      },
    ],
  },
  {
    section: "Oven not heating properly",
    items: [
      {
        title: "Blodgett convection oven not heating (video)",
        why: "Example diagnosis path (components + symptoms) for commercial convection ovens.",
        href: "https://www.youtube.com/watch?v=Jo0b36X0-DM",
        source: "YouTube",
      },
      {
        title: "Troubleshooting a Bakers Pride convection oven (video)",
        why: "Practical checks: door switch, high-limit, temperature probe, airflow.",
        href: "https://www.partstown.com/cm/resource-center/videos/vid1/troubleshooting-a-bakers-pride-cyclone-convection-oven-video",
        source: "Parts Town",
      },
      {
        title: "How to fix a commercial oven that won’t heat properly (article)",
        why: "Fast “start here” list before you call service.",
        href: "https://www.allpointsfps.com/resources/how-to-fix-a-commerical-oven-that-wont-heat-properly/",
        source: "AllPoints Foodservice Parts & Supplies",
      },
    ],
  },
];

export default function EquipmentPage() {
  return (
    <RequireAuth>
      <AppShell
        title="Equipment troubleshooting"
        subtitle="Quick fixes + trusted walkthroughs"
      >
        <div className="space-y-4">
          {resources.map((group) => (
            <Card key={group.section}>
              <div className="text-lg font-extrabold tracking-tight">
                {group.section}
              </div>
              <div className="mt-3 space-y-2">
                {group.items.map((r) => (
                  <a
                    key={r.href}
                    href={r.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-black/10 bg-white p-3 hover:bg-[color:var(--background)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-sm font-extrabold">{r.title}</div>
                      <div className="text-[11px] font-semibold text-black/50">
                        {r.source}
                      </div>
                    </div>
                    <div className="mt-1 text-sm text-black/60">{r.why}</div>
                  </a>
                ))}
              </div>
            </Card>
          ))}
          <div className="text-xs text-black/50">
            Safety note: Always follow your store’s procedures and unplug equipment
            before inspection.
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

