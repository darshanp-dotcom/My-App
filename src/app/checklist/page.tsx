"use client";

import React from "react";
import AppShell from "../../components/AppShell";
import RequireAuth from "../../components/RequireAuth";
import { Button, Card, Input, Label } from "../../components/ui";
import db from "../../lib/db";
import { formatDateLabel, yyyymmdd } from "../../lib/date";
import { id } from "@instantdb/react";

type Section = "Morning" | "Midday" | "Closing" | "Custom";

const defaults: Array<{ section: Section; text: string }> = [
  { section: "Morning", text: "Verify inventory levels" },
  { section: "Morning", text: "Assign employee positions" },
  { section: "Morning", text: "Start coffee brewing cycles" },
  { section: "Midday", text: "Restock key ingredients" },
  { section: "Midday", text: "Review sales numbers" },
  { section: "Closing", text: "Perform inventory count" },
  { section: "Closing", text: "Review labor hours" },
  { section: "Closing", text: "Submit daily report" },
];

export default function ChecklistPage() {
  return (
    <RequireAuth>
      <ChecklistInner />
    </RequireAuth>
  );
}

function ChecklistInner() {
  const user = db.useUser();
  const today = yyyymmdd();

  const { isLoading, error, data } = db.useQuery({
    tasks: { $: { where: { userId: user.id, date: today } } },
  });
  const tasks = (data?.tasks ?? [])
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt);

  const grouped = groupBySection(tasks);
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;

  async function seedDefaults() {
    const now = Date.now();
    const txs = defaults.map((d, idx) =>
      db.tx.tasks[id()].update({
        userId: user.id,
        date: today,
        section: d.section,
        text: d.text,
        done: false,
        createdAt: now + idx,
      }),
    );
    await db.transact(txs);
  }

  return (
    <AppShell
      title="Daily checklist"
      subtitle={`Today • ${formatDateLabel(today)}`}
    >
      {isLoading ? (
        <div className="text-sm text-black/60">Loading checklist…</div>
      ) : error ? (
        <div className="rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
          {error.message}
        </div>
      ) : (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-black/60">
                  Progress
                </div>
                <div className="mt-1 text-lg font-extrabold tracking-tight">
                  {total ? `${done} of ${total} done` : "Start your day strong"}
                </div>
                <div className="mt-1 text-sm text-black/60">
                  Keep it simple: check off tasks as you go.
                </div>
              </div>
              <div className="flex gap-2">
                {total === 0 ? (
                  <Button onClick={seedDefaults}>Add BrewManager defaults</Button>
                ) : null}
                <Button
                  variant="secondary"
                  onClick={() => toggleAll(tasks)}
                  disabled={!total}
                >
                  Toggle all
                </Button>
                <Button
                  variant="danger"
                  onClick={() => clearCompleted(tasks)}
                  disabled={!tasks.some((t) => t.done)}
                >
                  Clear completed
                </Button>
              </div>
            </div>
          </Card>

          <SectionCard
            title="Morning"
            tasks={grouped.Morning}
            onAdd={(text) => addTask(user.id, today, "Morning", text)}
          />
          <SectionCard
            title="Midday"
            tasks={grouped.Midday}
            onAdd={(text) => addTask(user.id, today, "Midday", text)}
          />
          <SectionCard
            title="Closing"
            tasks={grouped.Closing}
            onAdd={(text) => addTask(user.id, today, "Closing", text)}
          />
          <SectionCard
            title="Custom"
            tasks={grouped.Custom}
            onAdd={(text) => addTask(user.id, today, "Custom", text)}
          />
        </div>
      )}
    </AppShell>
  );
}

function SectionCard({
  title,
  tasks,
  onAdd,
}: {
  title: Section;
  tasks: any[];
  onAdd: (text: string) => Promise<void>;
}) {
  const [text, setText] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-black/60">{title}</div>
          <div className="mt-1 text-sm text-black/60">
            {tasks.length
              ? `${tasks.filter((t) => t.done).length}/${tasks.length} complete`
              : "No tasks yet"}
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        {tasks.map((t) => (
          <label
            key={t.id}
            className="flex items-start gap-3 rounded-xl border border-black/10 bg-white px-3 py-2"
          >
            <input
              type="checkbox"
              className="mt-1"
              checked={!!t.done}
              onChange={() => toggleTask(t)}
            />
            <div className="flex-1">
              <div className={`text-sm font-semibold ${t.done ? "line-through text-black/40" : ""}`}>
                {t.text}
              </div>
            </div>
            <button
              className="text-xs font-semibold text-black/40 hover:text-bm-danger"
              onClick={(e) => {
                e.preventDefault();
                deleteTask(t);
              }}
              title="Delete"
            >
              Delete
            </button>
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <Label>Add a task</Label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Check headset batteries"
          />
        </div>
        <Button
          onClick={async () => {
            if (!text.trim()) return;
            setBusy(true);
            try {
              await onAdd(text.trim());
              setText("");
            } finally {
              setBusy(false);
            }
          }}
          disabled={!text.trim() || busy}
          className="w-full sm:w-auto"
        >
          Add
        </Button>
      </div>
    </Card>
  );
}

async function addTask(
  userId: string,
  date: number,
  section: Section,
  text: string,
) {
  await db.transact(
    db.tx.tasks[id()].update({
      userId,
      date,
      section,
      text,
      done: false,
      createdAt: Date.now(),
    }),
  );
}

async function toggleTask(t: any) {
  await db.transact(db.tx.tasks[t.id].update({ done: !t.done }));
}

async function deleteTask(t: any) {
  await db.transact(db.tx.tasks[t.id].delete());
}

async function clearCompleted(tasks: any[]) {
  const txs = tasks.filter((t) => t.done).map((t) => db.tx.tasks[t.id].delete());
  if (txs.length) await db.transact(txs);
}

async function toggleAll(tasks: any[]) {
  if (!tasks.length) return;
  const newVal = !tasks.every((t) => t.done);
  await db.transact(tasks.map((t) => db.tx.tasks[t.id].update({ done: newVal })));
}

function groupBySection(tasks: any[]) {
  const out: Record<Section, any[]> = {
    Morning: [],
    Midday: [],
    Closing: [],
    Custom: [],
  };
  for (const t of tasks) {
    const section = (t.section as Section) in out ? (t.section as Section) : "Custom";
    out[section].push(t);
  }
  return out;
}

