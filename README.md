## BrewManager

Training + operations dashboard for Dunkin store managers.

### Tech

- **Next.js (App Router)** + **Tailwind CSS**
- **InstantDB** (database + magic-code authentication)

### Running locally

1) Install dependencies:

```bash
npm install
```

2) Create `.env.local`:

```bash
# InstantDB App ID (required in Vercel; optional locally because we default it)
NEXT_PUBLIC_INSTANT_APP_ID=38737290-7b48-4287-b520-6852e034cfd9
```

3) Start the dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

### Deploying to Vercel

- Set the environment variable **`NEXT_PUBLIC_INSTANT_APP_ID`** in Vercel.
- Deploy as a standard Next.js app (no extra config needed).

### App pages

- `/login`: magic-code login (email + 6-digit code)
- `/`: dashboard (metrics + checklist progress + latest order)
- `/metrics`: enter today’s store metrics
- `/checklist`: daily checklist (seed defaults + custom tasks)
- `/orders`: NDCP order analyzer + history
- `/training`: bite-sized modules + quick quizzes (tracks attempts)
