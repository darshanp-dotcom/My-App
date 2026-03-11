"use client";

import RequireAuth from "../../components/RequireAuth";
import AppShell from "../../components/AppShell";
import { Card } from "../../components/ui";

type DrinkVideo = {
  title: string;
  href: string;
  note: string;
};

const videos: DrinkVideo[] = [
  {
    title: "How to make Ice Latte at Dunkin (training video)",
    href: "https://www.youtube.com/watch?v=KurN296I-7M",
    note: "Build flow + sequencing for a common espresso drink.",
  },
  {
    title: "3 different iced coffees (training video)",
    href: "https://www.youtube.com/watch?v=Cm6VaEibO2c",
    note: "Side-by-side builds; good for consistency and speed.",
  },
  {
    title: "Oatmilk iced coffee (training video)",
    href: "https://www.youtube.com/watch?v=PRa4tdVnnsw",
    note: "Oatmilk variation; useful for customizing builds.",
  },
  {
    title: "Dunkin espresso iced coffee (video)",
    href: "https://www.youtube.com/watch?v=RsyZ6rF2rAA",
    note: "Espresso + ice build; watch the order of steps.",
  },
  {
    title: "Dunkin frozen coffee (video)",
    href: "https://www.youtube.com/watch?v=QCMI2iXn5MM",
    note: "Blended drink build; good for training new shift leaders.",
  },
];

export default function DrinksPage() {
  return (
    <RequireAuth>
      <AppShell
        title="Drink builds"
        subtitle="Video walkthroughs for common Dunkin-style drinks"
      >
        <div className="space-y-3">
          {videos.map((v) => (
            <Card key={v.href}>
              <a
                href={v.href}
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <div className="text-lg font-extrabold tracking-tight hover:underline">
                  {v.title}
                </div>
                <div className="mt-2 text-sm text-black/60">{v.note}</div>
                <div className="mt-2 text-xs font-mono text-black/50 break-all">
                  {v.href}
                </div>
              </a>
            </Card>
          ))}
          <div className="text-xs text-black/50">
            Tip: Turn one video into a 3-step checklist for your store’s exact
            setup.
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

