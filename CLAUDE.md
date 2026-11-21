# books.gritts.net

A static reading ledger built from the frontmatter of the Obsidian vault at
`~/Documents/notes/kissmygritts`. The brief lives at
`~/Documents/notes/kissmygritts/notes/Build books.gritts.net.md`; read it
first.

## Rules

- **UI:** follow `.claude/skills/books-ui/SKILL.md` strictly, and use
  `/styleguide` as the visual reference. A new token goes into `main.css`
  (both themes plus `@theme inline`) and onto `/styleguide` before it is used.
- **Vault:** never modify the vault or its scripts. `content/books/` is
  `sync-site.ts` output, committed as-is.
- **Data contract:** the frontmatter `sync-site.ts` writes. Don't change it;
  if it needs to change, stop and ask.
- **Deployment and DNS:** out of scope.

## Commands

- `npm run dev`: dev server on http://localhost:8008
- `npm run lint`: Biome. It doesn't catch undefined names in `.vue`
  templates or scripts, so load the page to check.
- `npm run generate`: static build into `.output/public`
- Re-sync the data, run from the vault root:
  `bun .claude/skills/book/scripts/sync-site.ts ~/dev/sandbox/web/books.gritts.net/content/books`

## State (as of 2026-11-21)

Phases 1 to 3 are done, and the redesign approved as
`prototypes/11-dots.html` is in: a flat blue field, white ink, every book a
dot. Three pages, linked from `<SiteHeader>`. `/dashboard` and `/books`
share the year filter through one localStorage key (`useLedgerYear`).

- `/`: every finished book as one dot, oldest first, about 3:1. Hover or
  arrow keys name the book. Nothing else on the page.
- `/dashboard`: one chart per full-height page, all on the field: the goal,
  in numbers, by month (by year under "All"), ratings, when it was
  published, what it was, most read authors, where it was set, on the map.
- `/books`: the table of books by status (Finished, Reading, Up next,
  Abandoned). Finished follows the year filter and sorts; Up next carries
  the goal projection.

The redesign dropped the "Every year" panel and the Author / Format switch
on the month chart. The US and world maps are back as "On the map", after
"Where it was set": states or countries shaded white by book count, empty
regions faint, split by field-colored gaps (`<PlaceMap>`), US / World persisted under `books-map`.

All panel numbers matched the private ledger for 2018 and 2021–2026 plus
"All" on 2026-11-21, before the redesign; `ledger.ts` is unchanged since.
One difference is deliberate: under "All" the Finished list counts 213
books, against the ledger's 200, because it includes the 13 read books with
no finish date. The home grid and dashboard leave those out.

## Where things are

- `app/lib/ledger.ts`: the panel math, ported from the ledger's JS
  (`template.html`). Keep it in step if the ledger changes.
- `app/lib/derive.ts`: ledger.py's derived fields.
- `app/composables/useLedger.ts`: fetches the books and restores null
  booleans (see Gotchas). It also reads the build date, which stands in for
  the ledger's "today".
- `app/components/ledger/*`: one component per dashboard page, each
  rendering a `<DashPage>`.
- `app/components/Dot*.vue`, `BookDot.vue`: the dot grid and dot charts.
  `PlaceMap.vue` draws the map with d3-geo + topojson-client.
- `public/geo/`: us-atlas@3.0.1 / world-atlas@2.0.2 outlines, copies of the
  vault's `ledger/geo/`. Biome ignores them.
- `prototypes/`: the design rounds; 11-dots.html is the approved one. Biome ignores it.

## Gotchas

- **Nulls become `false`:** Nuxt Content decodes BOOLEAN columns with
  `Boolean(v)`, so null or missing `white_male_author` / `audible` come back
  as `false`. `useLedger` fixes this. Don't query the collection anywhere
  else without the same fix.
- **Field pages set the body class:** `/` and `/dashboard` paint the field
  with `useHead({ bodyAttrs: ... })`, so overscroll stays blue.
- **Cover dither colors live twice:** the two inks in `DitherFilters.vue`
  are sRGB copies of `--foreground` / `--background`. Change both together.
- **Runtime config before the await:** `useRuntimeConfig()` must run before
  the `await` in an async composable.
- **Maps load on the client:** `<PlaceMap>` fetches `public/geo/` after mount,
  so SSR renders an empty map. A dev server started before `public/`
  existed won't serve it; restart it.
- **Per-viewer state:** the year is kept in
  localStorage via `usePersisted` and read after mount, so SSR always renders
  the default (the latest year).

## Checking numbers against the ledger

1. Build the private ledger into a scratch directory. From the vault, run
   `uv run .claude/skills/book/scripts/ledger.py <dir>/index.html`, then copy
   `ledger/geo/` beside it.
2. Serve that directory and open it.
3. For each year button, read the panel text: `#stats`, `#verdict`,
   `#m-legend`, the `.col` aria-labels, the `.hrow` text, and the `*-n` notes.
4. Compare against `/dashboard` (and Finished on `/books`) for the same
   year. Dashboard counts are in the chart aria-labels and captions.

## Open questions for the owner (ask before changing)

1. Should `vite.optimizeDeps.include` list the packages Nuxt flags during
   `npm run dev`?

## Next (from the brief, not yet scheduled)

- Choose a host and deploy. Out of scope until the owner picks a host.
- In `~/dev/sandbox/web/gritts.dev`, replace `/books` with a link or redirect
  to books.gritts.net and delete its `content/books/`. This is a separate
  change.
