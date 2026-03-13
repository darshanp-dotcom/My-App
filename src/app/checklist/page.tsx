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
  // Morning – daily store opening pulled from DD 141
  { section: "Morning", text: "4:45 am – Turn off security system and clock in" },
  { section: "Morning", text: "Turn on kitchen ovens, sandwich stations, bagel toaster, hot holding, and hood fan" },
  { section: "Morning", text: "Turn on all coffee / iced coffee brewers, hot chocolate, Island Oasis" },
  { section: "Morning", text: "Brew hot coffee, iced coffee, iced tea, lemonade, green tea; bring cold brew from walk‑in" },
  { section: "Morning", text: "Log in to both registers and make sure $200 float is in each drawer" },
  { section: "Morning", text: "5:00 am – Turn on all lights, OPEN signs, and unlock / open drive‑thru window" },
  { section: "Morning", text: "Bring CML donut rack to front and build donut case (verify rack is for this store)" },
  { section: "Morning", text: "Start fresh bagels, muffins, and croissants for morning rush" },
  { section: "Morning", text: "Verify English muffins, tortillas, wraps, bacon bites, sourdough, and mini bagels are thawed" },
  { section: "Morning", text: "Check late‑night messages and call in extra help if there are call‑outs" },
  { section: "Morning", text: "Complete opening temperature log in Red Book" },

  // Midday – daily workflow + donut order
  { section: "Midday", text: "5–9 am – Keep all hands on deck and support rush" },
  { section: "Midday", text: "9 am – Coordinate short 10–15 minute meal breaks for crew" },
  { section: "Midday", text: "10 am – Clean dishes, dairy dispensers, espresso, hot chocolate, Island Oasis, wipe equipment fronts/tops" },
  { section: "Midday", text: "11 am – Sweep, mop, clean restrooms, and empty trash as needed" },
  { section: "Midday", text: "11 am – Prep kitchen for next day (portioning and thawing key items)" },
  { section: "Midday", text: "11:30 am – Restock front: paper, food, dairy, coolers, retail; check dates FIFO" },
  { section: "Midday", text: "Before 11 am – Review and adjust donut order on Jera CML and record waste" },
  { section: "Midday", text: "Monitor cash drawers (shorts no more than $3–5) and approve any refunds" },

  // Closing – end‑of‑day and security
  { section: "Closing", text: "Delegate closing duties and ensure crew follows closing list" },
  { section: "Closing", text: "Bake any remaining croissants, bagels, muffins needed for next day" },
  { section: "Closing", text: "Dump old coffee and complete end‑of‑day cleaning" },
  { section: "Closing", text: "Count headsets and put all on charge for next morning" },
  { section: "Closing", text: "Turn off drive‑thru and inside digital menu boards and monitors" },
  { section: "Closing", text: "Lock and secure drive‑thru window with metal bar" },
  { section: "Closing", text: "Make nightly cash deposit in safe with reports before leaving" },
  { section: "Closing", text: "Turn off non‑essential lights / TVs, lock all doors, arm security system, check back door" },

  // Custom – policy / weekly anchors from DD 141
  { section: "Custom", text: "Review daily truck / cleaning task for this weekday (see DD 141 list)" },
  { section: "Custom", text: "Check labeling system on all food and cleaning products (dates and stickers in place)" },
  { section: "Custom", text: "Verify dumpster lids closed, cardboard flattened, and outside area tidy" },
  { section: "Custom", text: "Quick huddle on meal policy, cash handling, and phone use expectations" },

  // Closing crew roles
  { section: "Closing", text: "Crew 1 – Stock drive‑thru line and coolers, clean full DT area" },
  { section: "Closing", text: "Crew 1 – Restock sandwich station (food, sleeves, wraps, utensils) and wipe down" },
  { section: "Closing", text: "Crew 1 – Count and record food waste in red binder" },
  { section: "Closing", text: "Crew 1 – Clean one Turbo oven today (alternate top/bottom each day)" },
  { section: "Closing", text: "Crew 2 – Stock front line from delivery bags through latte machine area" },
  { section: "Closing", text: "Crew 2 – Clean bathrooms and refill soap and toilet paper" },
  { section: "Closing", text: "Crew 2 – Wipe and reset donut case, tags, and glass (no fingerprints)" },
  { section: "Closing", text: "Crew 2 – Windex entrance doors and clean ice caddy" },
  { section: "Closing", text: "Crew 3 – Finish all remaining dishes and reset all stations (no dishes on machines)" },
  { section: "Closing", text: "Crew 3 – Clean Island Oasis with no ice left overnight" },
  { section: "Closing", text: "Crew 3 – Take all trash from entire store and check outside garbage / lawn" },
  { section: "Closing", text: "Crew 3 – Sweep and mop from donut case through prep table" },

  // Mid‑shift and end‑of‑shift duties
  { section: "Midday", text: "Mid‑shift – Restock sandwich station and hot holding pans" },
  { section: "Midday", text: "Mid‑shift – Refill condiment station and lobby beverage cooler" },
  { section: "Midday", text: "Mid‑shift – Sweep / mop lobby and back stock room" },
  { section: "Midday", text: "Mid‑shift – Clean both espresso machines (top, sides, underneath)" },
  { section: "Closing", text: "End of shift – Check equipment for breakdowns and report to manager/maintenance" },
  { section: "Closing", text: "End of shift – Lock dining room doors and re‑check restrooms" },
  { section: "Closing", text: "End of shift – Turn off drive‑thru heaters/fans and both espresso machines" },
  { section: "Closing", text: "End of shift – Turn off sandwich‑station refrigerators as required" },
  { section: "Closing", text: "End of shift – Turn off outside digital menu board with remote" },

  // Weekly day‑by‑day to‑dos
  { section: "Custom", text: "Monday – Count inventory and place DCP truck order before 4 pm" },
  { section: "Custom", text: "Monday – Before leaving, confirm enough paper, food, and freezer items for Tuesday" },
  { section: "Custom", text: "Monday – Before leaving, stock coins and small bills for Tuesday" },
  { section: "Custom", text: "Wednesday – Receive and put away DCP truck using FIFO (old product to front)" },
  { section: "Custom", text: "Friday – Schedule at least nine people for busy Friday shifts and confirm arrivals" },
  { section: "Custom", text: "Saturday – Stay calm and lead weekend teams that may be less experienced" },
  { section: "Custom", text: "Sunday – Build and publish next week’s schedule and review day‑off requests" },

  // Daily cleaning MON–SUN
  { section: "Custom", text: "Daily – Detail clean and wipe registers, kiosks, condiment stations, pickup areas, racks, and doors" },
  { section: "Custom", text: "Monday – Pull out under‑counter units, clean and mop behind, and clean VDU / digital boards" },
  { section: "Custom", text: "Tuesday – Deep clean sandwich station wall, containers, hashbrown freezer, dairy fridge, walk‑in floor" },
  { section: "Custom", text: "Saturday – Pull out tap system, clean wall, sweep and mop underneath" },
  { section: "Custom", text: "Sunday – Pull out front donut case, clean glass, sweep and mop underneath" },

  // Weekly / monthly / 6‑month equipment tasks
  { section: "Custom", text: "Weekly – Calibrate coffee brewers, grinders, sugar, and dairy dispensers" },
  { section: "Custom", text: "Weekly – Deep clean Island Oasis and check for mold or buildup" },
  { section: "Custom", text: "Monthly – Change HVAC filters in dining room and kitchen ceilings" },
  { section: "Custom", text: "Monthly – Full detail cleaning of Island Oasis" },
  { section: "Custom", text: "Every 6 months – Change espresso filters, water filters, and clean ice machine and sandwich station compressor area" },

  // Policy refreshers (no personal contacts)
  { section: "Custom", text: "Review store safety & security policy with new team members (two people in store, locked back door, safe drops, trash in daylight)" },
  { section: "Custom", text: "Review cash‑handling policy: verify tills at start, counterfeit pen on $20+, staple coupons to receipts" },
  { section: "Custom", text: "Review uniform policy: full uniform on before clock‑in, professional appearance in front of guests" },
  { section: "Custom", text: "Review phone / internet policy: no personal cell use on shift, store computers and phones are for business only" },
  { section: "Custom", text: "Review smoking policy: short breaks only when business allows, not at front door" },
  { section: "Custom", text: "Review availability, days‑off, and call‑out rules with team (two weeks notice, 2‑hour call‑out, documentation)" },
  { section: "Custom", text: "Review employee meal and discount rules (no free food for friends/family, proper ringing and receipts)" },
  { section: "Custom", text: "Review guest‑focused conduct expectations (no profanity, off‑clock staff stay out from behind counter)" },

  // Overall goals from DD 141
  { section: "Custom", text: "Overall Goal – Make customers happy every visit" },
  { section: "Custom", text: "Overall Goal – Ensure Dunkin is open every day for full posted hours" },
  { section: "Custom", text: "Overall Goal – Keep Dunkin clean and tidy (front and back of house)" },
  { section: "Custom", text: "Overall Goal – Manage inventory so we can serve all products without excessive waste" },
  { section: "Custom", text: "Overall Goal – Keep employees happy, staffed, and supported" },
  { section: "Custom", text: "Overall Goal – Continually train, coach, and run short team meetings on new products and promotions" },

  // Quick access links (as reminders) – managers open these from bookmarks
  { section: "Custom", text: "Open SupplyIt for donut ordering – https://app.supplyit.com" },
  { section: "Custom", text: "Open MyNDCP for truck orders and account – https://nationaldcp.com/MyNDCP" },
  { section: "Custom", text: "Open Daily Cash Report Google Sheet and enter today’s data" },
  { section: "Custom", text: "Open The Center (Inspire) for brand training – https://sso.inspirepartners.net" },
  { section: "Custom", text: "Open Oracle for labor/scheduling as needed – https://dun01-ohra-prod-dun.hospitality.oracleindustry.com" },
  { section: "Custom", text: "Open Indeed to review applicants and schedule at least one interview – https://employers.indeed.com" },
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
                  <Button onClick={seedDefaults}>Add New Manager checklist</Button>
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

