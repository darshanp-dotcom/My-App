"use client";

import RequireAuth from "../../components/RequireAuth";
import AppShell from "../../components/AppShell";
import { Card } from "../../components/ui";

const colors = [
  { name: "Primary • Dunkin Orange", hex: "#FF671F", varName: "--bm-orange" },
  { name: "Secondary • Dunkin Pink", hex: "#DA1884", varName: "--bm-pink" },
  { name: "Background • Soft Cream", hex: "#FFF8F2", varName: "--background" },
  { name: "Text • Dark Espresso", hex: "#2C2C2C", varName: "--foreground" },
  { name: "Accent • Coffee Brown", hex: "#6F4E37", varName: "--bm-brown" },
  { name: "Success • Green", hex: "#3CB371", varName: "--bm-success" },
  { name: "Warning • Red", hex: "#E63946", varName: "--bm-danger" },
];

export default function ColorPalettePage() {
  return (
    <RequireAuth>
      <AppShell title="Color palette" subtitle="BrewManager theme colors">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map((c) => (
            <Card key={c.hex}>
              <div className="flex items-start justify-between gap-3">
                <div className="text-sm font-extrabold">{c.name}</div>
                <div className="text-xs font-mono font-semibold text-black/60">
                  {c.hex}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl border border-black/10"
                  style={{ backgroundColor: c.hex }}
                  aria-label={c.name}
                />
                <div className="text-xs text-black/60">
                  CSS var: <span className="font-mono">{c.varName}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </AppShell>
    </RequireAuth>
  );
}

