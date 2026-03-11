"use client";

import React from "react";
import { id } from "@instantdb/react";
import AppShell from "../../components/AppShell";
import RequireAuth from "../../components/RequireAuth";
import { Button, Card, Input, Label } from "../../components/ui";
import db from "../../lib/db";
import { formatDateLabel, yyyymmdd } from "../../lib/date";

export default function MetricsPage() {
  return (
    <RequireAuth>
      <MetricsInner />
    </RequireAuth>
  );
}

function MetricsInner() {
  const user = db.useUser();
  const today = yyyymmdd();

  const { isLoading, error, data } = db.useQuery({
    metrics: { $: { where: { userId: user.id, date: today } } },
  });

  const existing = (data?.metrics ?? [])[0];

  return (
    <AppShell
      title="Store performance"
      subtitle={`Today • ${formatDateLabel(today)}`}
    >
      {isLoading ? (
        <div className="text-sm text-black/60">Loading…</div>
      ) : error ? (
        <div className="rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
          {error.message}
        </div>
      ) : (
        <MetricsForm userId={user.id} date={today} existing={existing} />
      )}
    </AppShell>
  );
}

function MetricsForm({
  userId,
  date,
  existing,
}: {
  userId: string;
  date: number;
  existing?: any;
}) {
  const [salesToday, setSalesToday] = React.useState(
    existing ? String(existing.salesToday) : "",
  );
  const [laborPct, setLaborPct] = React.useState(
    existing ? String(existing.laborPct) : "",
  );
  const [foodCostPct, setFoodCostPct] = React.useState(
    existing ? String(existing.foodCostPct) : "",
  );
  const [driveThruSeconds, setDriveThruSeconds] = React.useState(
    existing ? String(existing.driveThruSeconds) : "",
  );
  const [wasteCost, setWasteCost] = React.useState(
    existing ? String(existing.wasteCost) : "",
  );
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    // If query loads after first render, hydrate once.
    if (!existing) return;
    setSalesToday(String(existing.salesToday ?? ""));
    setLaborPct(String(existing.laborPct ?? ""));
    setFoodCostPct(String(existing.foodCostPct ?? ""));
    setDriveThruSeconds(String(existing.driveThruSeconds ?? ""));
    setWasteCost(String(existing.wasteCost ?? ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id]);

  async function save() {
    setMsg(null);
    setErr(null);
    setBusy(true);
    try {
      const patch = {
        userId,
        date,
        salesToday: toNum(salesToday),
        laborPct: toNum(laborPct),
        foodCostPct: toNum(foodCostPct),
        driveThruSeconds: Math.round(toNum(driveThruSeconds)),
        wasteCost: toNum(wasteCost),
        updatedAt: Date.now(),
      };
      if (existing?.id) {
        await db.transact(db.tx.metrics[existing.id].update(patch));
      } else {
        await db.transact(db.tx.metrics[id()].update(patch));
      }
      setMsg("Saved. Nice work staying on top of the numbers.");
    } catch (e: any) {
      setErr(e?.body?.message ?? e?.message ?? "Could not save metrics.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <div className="text-xs font-semibold text-black/60">Today’s numbers</div>
      <div className="mt-1 text-sm text-black/60">
        Don’t worry about perfection—consistent tracking is the win.
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label="Sales Today ($)" value={salesToday} onChange={setSalesToday} />
        <Field label="Waste Cost ($)" value={wasteCost} onChange={setWasteCost} />
        <Field label="Labor Cost (%)" value={laborPct} onChange={setLaborPct} />
        <Field label="Food Cost (%)" value={foodCostPct} onChange={setFoodCostPct} />
        <Field
          label="Drive‑Thru Time (seconds)"
          value={driveThruSeconds}
          onChange={setDriveThruSeconds}
        />
      </div>

      <div className="mt-4">
        <Button className="w-full sm:w-auto" onClick={save} disabled={busy}>
          {busy ? "Saving…" : existing?.id ? "Update metrics" : "Save metrics"}
        </Button>
      </div>

      {msg ? (
        <div className="mt-3 rounded-xl bg-black/5 px-3 py-2 text-sm text-black/70">
          {msg}
        </div>
      ) : null}
      {err ? (
        <div className="mt-3 rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
          {err}
        </div>
      ) : null}
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-3">
      <Label>{label}</Label>
      <Input
        inputMode="decimal"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function toNum(s: string) {
  const n = Number(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

