"use client";

import React from "react";
import { id } from "@instantdb/react";
import AppShell from "../../components/AppShell";
import RequireAuth from "../../components/RequireAuth";
import { Button, Card } from "../../components/ui";
import db from "../../lib/db";

type Module = {
  slug: string;
  title: string;
  description: string;
  steps: string[];
  quiz: { question: string; options: string[]; correct: string };
};

const modules: Module[] = [
  {
    slug: "morning-rush",
    title: "Morning Rush Management",
    description: "A simple playbook for staying calm and fast during peak flow.",
    steps: [
      "Pre-stock your top movers (cups, lids, ice, napkins).",
      "Assign clear stations (order taking, drinks, sandwiches, runner).",
      "Use “one-touch” restocks: refill to a set line, not ‘a little bit’.",
      "Watch the bottleneck: move one person to wherever the line is forming.",
    ],
    quiz: {
      question: "What’s the best first move before a rush starts?",
      options: [
        "Wait until the line forms",
        "Pre-stock top movers and assign stations",
        "Turn off mobile orders",
        "Only focus on the drive‑thru",
      ],
      correct: "Pre-stock top movers and assign stations",
    },
  },
  {
    slug: "inventory-ordering",
    title: "Inventory Ordering (NDCP basics)",
    description: "Order enough to win the week—without waste.",
    steps: [
      "Start with what you sold last week (not what you ‘feel’ you’ll sell).",
      "Check on-hand + deliveries already scheduled.",
      "Protect service: prioritize items that stop sales (coffee, milk, cups).",
      "Add a small safety buffer for high-variance items.",
    ],
    quiz: {
      question: "Which is the best base for your order quantities?",
      options: [
        "A guess based on last month",
        "Last week’s sales + on‑hand inventory",
        "Whatever you ordered two weeks ago",
        "Only what’s on the shelf right now",
      ],
      correct: "Last week’s sales + on‑hand inventory",
    },
  },
  {
    slug: "food-cost-control",
    title: "Food Cost Control",
    description: "Small habits that protect margin every day.",
    steps: [
      "Use portion tools consistently (scoops, pumps, portion cups).",
      "Do fast waste logs: what got tossed and why?",
      "Coach on “make it right” without remake loops.",
      "Rotate stock: first in, first out (FIFO).",
    ],
    quiz: {
      question: "What’s a strong daily habit for food cost?",
      options: [
        "Ignore waste unless it’s huge",
        "Use portion tools and do quick waste logs",
        "Order extra to avoid running out",
        "Only check costs once a month",
      ],
      correct: "Use portion tools and do quick waste logs",
    },
  },
];

export default function TrainingPage() {
  return (
    <RequireAuth>
      <TrainingInner />
    </RequireAuth>
  );
}

function TrainingInner() {
  const user = db.useUser();
  const { isLoading, error, data } = db.useQuery({
    quizAttempts: { $: { where: { userId: user.id } } },
  });
  const attempts = data?.quizAttempts ?? [];

  const lastByModule = new Map<string, any>();
  for (const a of attempts
    .slice()
    .sort((x: any, y: any) => y.createdAt - x.createdAt)) {
    if (!lastByModule.has(a.moduleSlug)) lastByModule.set(a.moduleSlug, a);
  }

  return (
    <AppShell title="Training center" subtitle="Short lessons + quick quizzes">
      {isLoading ? (
        <div className="text-sm text-black/60">Loading…</div>
      ) : error ? (
        <div className="rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
          {error.message}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {modules.map((m) => (
            <ModuleCard
              key={m.slug}
              module={m}
              lastAttempt={lastByModule.get(m.slug)}
              userId={user.id}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function ModuleCard({
  module,
  lastAttempt,
  userId,
}: {
  module: Module;
  lastAttempt?: any;
  userId: string;
}) {
  const [answer, setAnswer] = React.useState<string>("");
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function submit() {
    setMsg(null);
    setBusy(true);
    try {
      const correct = answer === module.quiz.correct;
      await db.transact(
        db.tx.quizAttempts[id()].update({
          userId,
          moduleSlug: module.slug,
          answer,
          correct,
          createdAt: Date.now(),
        }),
      );
      setMsg(correct ? "Nice work — correct!" : "Good try — review the steps and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-black/60">Module</div>
          <div className="mt-1 text-lg font-extrabold tracking-tight">
            {module.title}
          </div>
          <div className="mt-1 text-sm text-black/60">{module.description}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-semibold text-black/50">Last quiz</div>
          <div className={`mt-1 text-sm font-extrabold ${lastAttempt ? (lastAttempt.correct ? "text-bm-success" : "text-bm-danger") : "text-black/40"}`}>
            {lastAttempt ? (lastAttempt.correct ? "Passed" : "Try again") : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-black/10 bg-white p-3">
        <div className="text-xs font-semibold text-black/60">Step‑by‑step</div>
        <ol className="mt-2 list-decimal pl-5 text-sm text-black/70 space-y-1">
          {module.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>

      <div className="mt-3 rounded-2xl border border-black/10 bg-white p-3">
        <div className="text-xs font-semibold text-black/60">Quick quiz</div>
        <div className="mt-2 text-sm font-semibold">{module.quiz.question}</div>
        <div className="mt-2 space-y-2">
          {module.quiz.options.map((opt) => (
            <label
              key={opt}
              className="flex items-start gap-2 rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-[color:var(--background)] cursor-pointer"
            >
              <input
                type="radio"
                name={`q-${module.slug}`}
                checked={answer === opt}
                onChange={() => setAnswer(opt)}
              />
              <span>{opt}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={submit} disabled={!answer || busy}>
            {busy ? "Saving…" : "Submit answer"}
          </Button>
          <Button variant="secondary" onClick={() => { setAnswer(""); setMsg(null); }}>
            Reset
          </Button>
        </div>
        {msg ? (
          <div className="mt-3 rounded-xl bg-black/5 px-3 py-2 text-sm text-black/70">
            {msg}
          </div>
        ) : null}
      </div>
    </Card>
  );
}

