"use client";

import React from "react";
import { id } from "@instantdb/react";
import AppShell from "../../components/AppShell";
import RequireAuth from "../../components/RequireAuth";
import { Button, Card, Input, Label } from "../../components/ui";
import db from "../../lib/db";
import { inventoryCategories, inventoryItems } from "../../lib/inventory";

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersInner />
    </RequireAuth>
  );
}

function OrdersInner() {
  const user = db.useUser();
  const { isLoading, error, data } = db.useQuery({
    orders: { $: { where: { userId: user.id } } },
  });

  const orders = (data?.orders ?? [])
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <AppShell
      title="NDCP order analyzer"
      subtitle="Save totals, get an instant category breakdown"
    >
      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <OrderForm userId={user.id} />

        <Card>
          <div className="text-xs font-semibold text-black/60">
            Saved orders
          </div>
          <div className="mt-1 text-sm text-black/60">
            Keep a history so you can compare week-to-week.
          </div>

          {isLoading ? (
            <div className="mt-4 text-sm text-black/60">Loading…</div>
          ) : error ? (
            <div className="mt-4 rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
              {error.message}
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-4 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm text-black/60">
              No orders yet. Add one on the left.
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.slice(0, 15).map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl border border-black/10 bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-black/50">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-1 text-lg font-extrabold font-mono">
                        ${o.total}
                      </div>
                    </div>
                    <Button
                      variant="danger"
                      onClick={() => db.transact(db.tx.orders[o.id].delete())}
                    >
                      Delete
                    </Button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-6">
                    <Mini label="Food" val={o.foodCost} total={o.total} />
                    <Mini label="Dairy" val={o.dairy} total={o.total} />
                    <Mini label="Retail" val={o.retail} total={o.total} />
                    <Mini label="Paper" val={o.paperGoods} total={o.total} />
                    <Mini label="Cleaning" val={o.cleaning} total={o.total} />
                    <Mini label="Total" val={o.total} total={o.total} strong />
                  </div>
                  {o.itemsText ? (
                    <div className="mt-3 rounded-2xl border border-black/10 bg-[color:var(--background)] p-3">
                      <div className="text-xs font-semibold text-black/60">
                        Inventory items (saved with order)
                      </div>
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-black/70">
                        {o.itemsText}
                      </pre>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

function OrderForm({ userId }: { userId: string }) {
  const [foodCost, setFoodCost] = React.useState("");
  const [dairy, setDairy] = React.useState("");
  const [retail, setRetail] = React.useState("");
  const [paperGoods, setPaperGoods] = React.useState("");
  const [cleaning, setCleaning] = React.useState("");
  const [total, setTotal] = React.useState("");
  const [invQ, setInvQ] = React.useState("");
  const [invCat, setInvCat] = React.useState<
    (typeof inventoryCategories)[number] | "All"
  >("All");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const values = {
    foodCost: toNum(foodCost),
    dairy: toNum(dairy),
    retail: toNum(retail),
    paperGoods: toNum(paperGoods),
    cleaning: toNum(cleaning),
    total: toNum(total),
  };

  const computedTotal =
    values.foodCost +
    values.dairy +
    values.retail +
    values.paperGoods +
    values.cleaning;

  const effectiveTotal = values.total || computedTotal;
  const canSave = effectiveTotal > 0;

  async function save() {
    setErr(null);
    setBusy(true);
    try {
      const itemsText = selected.length ? selected.join("\n") : undefined;
      await db.transact(
        db.tx.orders[id()].update({
          userId,
          createdAt: Date.now(),
          total: round2(effectiveTotal),
          foodCost: round2(values.foodCost),
          dairy: round2(values.dairy),
          retail: round2(values.retail),
          paperGoods: round2(values.paperGoods),
          cleaning: round2(values.cleaning),
          itemsText,
        }),
      );
      setFoodCost("");
      setDairy("");
      setRetail("");
      setPaperGoods("");
      setCleaning("");
      setTotal("");
      setInvQ("");
      setInvCat("All");
      setSelected([]);
    } catch (e: any) {
      setErr(e?.body?.message ?? e?.message ?? "Could not save order.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <div className="text-xs font-semibold text-black/60">New order</div>
      <div className="mt-1 text-sm text-black/60">
        Enter your category totals (or just enter total + the categories you know).
      </div>

      <div className="mt-4 space-y-3">
        <MoneyField label="Food Cost" value={foodCost} onChange={setFoodCost} />
        <MoneyField label="Dairy Products" value={dairy} onChange={setDairy} />
        <MoneyField label="Retail Items" value={retail} onChange={setRetail} />
        <MoneyField label="Paper Goods" value={paperGoods} onChange={setPaperGoods} />
        <MoneyField label="Cleaning Supplies" value={cleaning} onChange={setCleaning} />

        <div className="rounded-2xl border border-black/10 bg-white p-3">
          <Label>Total (optional)</Label>
          <Input
            inputMode="decimal"
            placeholder={`Auto: $${round2(computedTotal)}`}
            value={total}
            onChange={(e) => setTotal(e.target.value)}
          />
          <div className="mt-2 text-xs text-black/50">
            If you leave this blank, we’ll add the categories for you.
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-black/10 bg-white p-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-black/60">
              Inventory items (optional)
            </div>
            <div className="mt-1 text-sm text-black/60">
              Select what you ordered so it’s saved with the breakdown.
            </div>
          </div>
          <div className="text-xs font-semibold text-black/50">
            Selected: {selected.length}
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr]">
          <div>
            <Label>Search items</Label>
            <Input
              value={invQ}
              onChange={(e) => setInvQ(e.target.value)}
              placeholder="Try: milk, cup, espresso…"
            />
          </div>
          <div>
            <Label>Category</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              <Pill active={invCat === "All"} onClick={() => setInvCat("All")}>
                All
              </Pill>
              {inventoryCategories.slice(0, 4).map((c) => (
                <Pill
                  key={c}
                  active={invCat === c}
                  onClick={() => setInvCat(c)}
                >
                  {c}
                </Pill>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {inventoryCategories.slice(4).map((c) => (
                <Pill
                  key={c}
                  active={invCat === c}
                  onClick={() => setInvCat(c)}
                >
                  {c}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 max-h-56 overflow-auto rounded-2xl border border-black/10 bg-[color:var(--background)] p-2">
          {filterInventory(invQ, invCat).slice(0, 80).map((it) => {
            const on = selected.includes(it.name);
            return (
              <button
                key={it.name}
                type="button"
                className={[
                  "w-full text-left rounded-xl px-3 py-2 text-sm border transition",
                  on
                    ? "bg-white border-black/10 shadow-sm"
                    : "bg-white/60 border-transparent hover:bg-white hover:border-black/10",
                ].join(" ")}
                onClick={() => {
                  setSelected((prev) =>
                    prev.includes(it.name)
                      ? prev.filter((x) => x !== it.name)
                      : [...prev, it.name],
                  );
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-[11px] font-semibold text-black/50">
                    {it.category}
                  </div>
                </div>
              </button>
            );
          })}
          <div className="px-2 pt-2 text-[11px] text-black/50">
            Showing up to 80 matches (refine search if needed).
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-black/10 bg-white p-3">
          <div className="text-[11px] font-semibold text-black/50">Computed</div>
          <div className="mt-1 font-mono text-sm font-extrabold">
            ${round2(computedTotal)}
          </div>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-3">
          <div className="text-[11px] font-semibold text-black/50">Saving as</div>
          <div className="mt-1 font-mono text-sm font-extrabold">
            ${round2(effectiveTotal)}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button className="w-full" onClick={save} disabled={!canSave || busy}>
          {busy ? "Saving…" : "Save order breakdown"}
        </Button>
      </div>

      {err ? (
        <div className="mt-3 rounded-xl bg-bm-danger/10 px-3 py-2 text-sm text-bm-danger">
          {err}
        </div>
      ) : null}
    </Card>
  );
}

function MoneyField({
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
        placeholder="$0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1 text-xs font-extrabold transition",
        active
          ? "bg-[color:var(--background)] border-black/10"
          : "bg-white border-black/10 text-black/60 hover:text-black hover:bg-[color:var(--background)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function filterInventory(
  q: string,
  cat: (typeof inventoryCategories)[number] | "All",
) {
  const query = q.trim().toLowerCase();
  return inventoryItems.filter((i) => {
    if (cat !== "All" && i.category !== cat) return false;
    if (!query) return true;
    return i.name.toLowerCase().includes(query);
  });
}

function Mini({
  label,
  val,
  total,
  strong,
}: {
  label: string;
  val: number;
  total: number;
  strong?: boolean;
}) {
  const pct = total > 0 ? Math.round((val / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-black/10 bg-[color:var(--background)] px-3 py-2">
      <div className="text-[11px] font-semibold text-black/50">{label}</div>
      <div className={`mt-0.5 font-mono text-sm ${strong ? "font-extrabold" : "font-semibold"}`}>
        ${val}
      </div>
      {!strong ? (
        <div className="mt-0.5 text-[11px] text-black/50">{pct}%</div>
      ) : null}
    </div>
  );
}

function toNum(s: string) {
  const n = Number(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

