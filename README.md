# Find My Car — CarDekho Assignment

**Live URL:** https://cardekho-tau.vercel.app

**GitHub:** https://github.com/PrashantPatel245/cardekho

A guided shortlisting tool that takes confused car buyers from "I don't know what to buy" to a confident top-5 shortlist in under 2 minutes.

## What I built and why

Instead of building another car catalog, I focused on one sharp flow: a 6-question guided questionnaire that feeds a transparent weighted scoring engine ranking ~50 real Indian-market cars. Buyers get a ranked shortlist with "why this fits you" explanations, a top-3 comparison table, and live weight sliders to instantly re-rank — proving real computation, not a static list.

## What I deliberately cut

| Feature | Why it's out of scope |
|---------|----------------------|
| User accounts / auth | No persistence needed for MVP; adds friction |
| Real review aggregation | Requires external APIs and moderation |
| Dealer integration | Out of assignment scope; needs partnerships |
| Financing calculators | Separate product surface; distracts from core flow |
| Image galleries | Time-intensive asset curation; specs matter more here |
| Admin panel | No CMS needed for a seeded static dataset |

## Tech stack and why

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 14 (App Router) + TypeScript | Single deployable full-stack unit with API routes |
| Styling | Tailwind CSS + shadcn/ui | Fast, polished UI with accessible components |
| Data | Typed TS dataset (`lib/data/cars.ts`) | Zero-config, Vercel-safe (no SQLite on read-only FS) |
| Scoring | Pure functions in `lib/rank.ts` | Transparent, testable, instant client-side re-rank |
| State | React hooks | Small scope; no Redux overhead |
| Deploy | Vercel | Zero-config Next.js hosting with instant live URL |

## AI tool usage

This project was built **100% AI-native in Cursor** during a single session — no manual code edits. The AI agent made autonomous product and engineering decisions including: scoring algorithm weights and dimension design, dataset schema and car curation (~50 Indian models), UI flow structure (6-step card questionnaire → results with sliders), and tech stack selection (JSON over SQLite for Vercel compatibility). A human would normally intervene on scoring weight tuning, visual design review, and data accuracy verification. The screen recording documents the full build process.

## Run instructions

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## With 4 more hours, I'd add

- Real review and spec data via a third-party automotive API
- LLM-powered natural language intake ("tell me what you want") alongside the questionnaire
- Save/share shortlist links (URL-encoded preferences + results)
- Expand dataset to 200+ cars with advanced filters (transmission, brand, features)
- Basic analytics on which scoring weights users adjust most

## Project structure

```
app/                  # Next.js pages and API routes
components/           # Questionnaire, results, and UI components
lib/data/cars.ts      # Seeded car dataset
lib/rank.ts           # Weighted scoring engine
```

## License

MIT
