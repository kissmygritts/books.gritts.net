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
dot. Three pages, linked from `<GooeyMenu>` (lower right). `/dashboard` and `/books`
each open their year filter on the current year (`useLedgerYear`); the
choice isn't saved.

- `/`: every finished book as one dot, oldest first, about 3:1, and one
  static line under it. Hover, click or arrow keys open the book card
  (`<BookCard>`). The legend (`<DotLegend>`) cycles what the dots read
  (White men, Gender, Authors of color, Translated, American; `app/lib/lens.ts`,
  shared through `useLens()`, kept as `books-lens`). Nothing else on the
  page. The same legend sits under the year filter on each dashboard dot
  chart (`<DashPage legend>`), the goal included: its rows follow the
  lens and its caption ends with solid minus ring. The goal's verdict
  line is gone for now (`verdict()` in `ledger.ts` is unused).
- `/dashboard`: one chart per full-height page, all on the field, in this
  order: by the numbers (books, pages, average rating, median days), annual
  goal, by month (by year under "All"), by rating, by length (pages), by
  duration (days), by decade, by age (when read), by genre, by author, by
  location (the map). The page snaps section to section (mandatory,
  `snap-always`, set on <html> by the page), with one dot per section on
  the right edge (`<ScrollDots>`, hidden below `sm`), the current one full
  ink and larger, the rest faded; clicking one scrolls to it.
- `/books`: the table of books by status (Finished, Reading, Up next,
  Abandoned). Finished follows the year filter and sorts; Up next carries
  the goal projection.

The redesign dropped the "Every year" panel and the Author / Format switch
on the month chart, and later the audiobook share and "Where it was set".
The map is "By location": states or countries shaded white by book count,
empty regions faint, split by field-colored gaps (`<PlaceMap>`), no hover,
US / World persisted under `books-map`.

All panel numbers matched the private ledger for 2018 and 2021–2026 plus
"All" on 2026-11-21, before the redesign; `ledger.ts` is unchanged since.
One difference is deliberate: under "All" the Finished list counts 213
books, against the ledger's 200, because it includes the 13 read books with
no finish date. The home grid and dashboard leave those out.

## Where things are

- `app/lib/ledger.ts`: the panel math, ported from the ledger's JS
  (`template.html`). Keep it in step if the ledger changes.
- `app/lib/derive.ts`: ledger.py's derived fields.
- `app/lib/shape.ts`: bins for length, days to finish and age when read.
  These aren't in the private ledger, so there's nothing to check them against.
- `app/composables/useLedger.ts`: fetches the books and restores null
  booleans (see Gotchas). It also reads the build date, which stands in for
  the ledger's "today".
- `app/components/ledger/*`: one component per dashboard page, each
  rendering a `<DashPage>`.
- `app/components/ScrollDots.vue`: the dashboard's section dots. It finds
  `main section[id]` after mount (each `<DashPage>` sets its `id`) and
  marks the one crossing the viewport's middle, so a new page needs no
  registration.
- `app/components/Dot*.vue`, `BookDot.vue`: the dot grid and dot charts.
  `PlaceMap.vue` draws the map with d3-geo + topojson-client.
- `public/geo/`: us-atlas@3.0.1 / world-atlas@2.0.2 outlines, copies of the
  vault's `ledger/geo/`. Biome ignores them.
- `prototypes/`: the design rounds; 11-dots.html is the approved one. Biome ignores it.

## Gotchas

- **Nulls become `false`:** Nuxt Content decodes BOOLEAN columns with
  `Boolean(v)`, so null or missing `white_male_author` / `audible` /
  `author_poc` come back
  as `false`. `useLedger` fixes this. Don't query the collection anywhere
  else without the same fix.
- **Field pages set the body class:** `/` and `/dashboard` paint the field
  with `useHead({ bodyAttrs: ... })`, so overscroll stays blue.
- **Cover dither inks:** `DitherFilters.vue` floods `--page-ink-*` /
  `--page-ground-*` (named per theme, since the filter can't read a theme
  block). Change a page ink there, in `main.css`, not in the filter.
- **Runtime config before the await:** `useRuntimeConfig()` must run before
  the `await` in an async composable.
- **Maps load on the client:** `<PlaceMap>` fetches `public/geo/` after mount,
  so SSR renders an empty map. A dev server started before `public/`
  existed won't serve it; restart it.
- **Field palette:** `--field` reads `--field-light` / `--field-dark`, which
  `[data-palette]` on <html> swaps (ids in `app/lib/palette.ts`, cycled by
  the menu's palette blob, kept in localStorage as `books-palette`). An
  inline head script (`PALETTE_BOOT`, nuxt.config) sets it before paint.
  The page surface follows: every page token is `oklch(from --field-* …)`
  at a fixed lightness, chroma scaled from the field's, so blue matches the
  prototype and contrast holds in every palette. Low-chroma palettes (teal,
  forest, slate, ink) give a near-grey page.
- **Per-viewer state:** the map view (`books-map`) is kept in localStorage
  via `usePersisted` and read after mount, so SSR renders the default.

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
