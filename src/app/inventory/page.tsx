"use client";

import React from "react";
import RequireAuth from "../../components/RequireAuth";
import AppShell from "../../components/AppShell";
import { Card, Input } from "../../components/ui";
import { inventoryCategories, inventoryItems } from "../../lib/inventory";

export default function InventoryPage() {
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<
    (typeof inventoryCategories)[number] | "All"
  >("All");

  const filtered = inventoryItems.filter((i) => {
    if (cat !== "All" && i.category !== cat) return false;
    if (!q.trim()) return true;
    return i.name.toLowerCase().includes(q.trim().toLowerCase());
  });

  return (
    <RequireAuth>
      <AppShell
        title="Inventory list"
        subtitle="Search your common items (fast reference)"
      >
        <div className="space-y-4">
          <Card>
            <div className="grid gap-3 sm:grid-cols-[1fr_240px] sm:items-end">
              <div>
                <div className="text-xs font-semibold text-black/60">Search</div>
                <div className="mt-1">
                  <Input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Try: milk, cup, espresso, refresher…"
                  />
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-black/60">
                  Category
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <button
                    className={pill(cat === "All")}
                    onClick={() => setCat("All")}
                  >
                    All
                  </button>
                  {categories.slice(0, 4).map((c) => (
                    <button
                      key={c}
                      className={pill(cat === c)}
                      onClick={() => setCat(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {categories.slice(4).map((c) => (
                    <button
                      key={c}
                      className={pill(cat === c)}
                      onClick={() => setCat(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-black/50">
              Showing <span className="font-semibold">{filtered.length}</span>{" "}
              items.
            </div>
          </Card>

          <div className="grid gap-3 md:grid-cols-2">
            {filtered.map((i) => (
              <div
                key={i.name}
                className="rounded-2xl border border-black/10 bg-white p-3"
              >
                <div className="text-sm font-extrabold">{i.name}</div>
                <div className="mt-1 text-xs font-semibold text-black/50">
                  {i.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AppShell>
    </RequireAuth>
  );
}

const categories = inventoryCategories;

function pill(active: boolean) {
  return [
    "rounded-full border px-3 py-1 text-xs font-extrabold transition",
    active
      ? "bg-[color:var(--background)] border-black/10"
      : "bg-white border-black/10 text-black/60 hover:text-black hover:bg-[color:var(--background)]",
  ].join(" ");
}

