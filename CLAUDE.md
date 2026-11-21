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

Phases 1 to 3 are done. The site is two pages, switched by `<SiteNav>` in
the header. Both share the year filter through one localStorage key
(`useLedgerYear`).

`/` (books), in order:
1. Header.
2. The nightstand, with the up-next projection against the current year.
3. The reading list: the year filter, then the shelf (sortable, scoped by
   year, holding every read book under "All").

`/dashboard`, in order:
1. Header.
2. The year filter, which scopes everything below it.
3. The goal, then the year in numbers.
4. Books finished by month: by year under "All", colored by Author or Format.
5. Ratings, beside when it was published.
6. What it was, then most read authors.
7. Where it was set: US and world maps plus the places list.
8. Every year, hidden under "All".

All panel numbers matched the private ledger for 2018 and 2021–2026 plus
"All" on 2026-11-21. One difference is deliberate: under "All" the shelf
counts 213 books, against the ledger's 200, because it includes the 13 read
books with no finish date.

## Where things are

- `app/lib/ledger.ts`: the panel math, ported from the ledger's JS
  (`template.html`). Keep it in step if the ledger changes.
- `app/lib/derive.ts`: ledger.py's derived fields.
- `app/composables/useLedger.ts`: fetches the books and restores null
  booleans (see Gotchas). It also reads the build date, which stands in for
  the ledger's "today".
- `app/components/ledger/*`: one component per panel.
- `app/components/chart/*`: columns, bars and tooltips.
- `public/geo/`: copies of the vault's `ledger/geo/` files. Biome ignores
  them.

## Gotchas

- **Nulls become `false`:** Nuxt Content decodes BOOLEAN columns with
  `Boolean(v)`, so null or missing `white_male_author` / `audible` come back
  as `false`. `useLedger` fixes this. Don't query the collection anywhere
  else without the same fix.
- **No tooltips inside `<svg>`:** a reka Portal declared inside `<svg>` mounts
  in the SVG namespace and renders nothing. SVG charts use `<ChartHover>` (one
  controlled tooltip anchored to the hovered mark). HTML rows use
  `<ChartTip>`.
- **Runtime config before the await:** `useRuntimeConfig()` must run before
  the `await` in an async composable.
- **Per-viewer state:** the year, month mode and map view are kept in
  localStorage via `usePersisted` and read after mount, so SSR always renders
  the default (the latest year).

## Checking numbers against the ledger

1. Build the private ledger into a scratch directory. From the vault, run
   `uv run .claude/skills/book/scripts/ledger.py <dir>/index.html`, then copy
   `ledger/geo/` beside it.
2. Serve that directory and open it.
3. For each year button, read the panel text: `#stats`, `#verdict`,
   `#m-legend`, the `.col` aria-labels, the `.hrow` text, and the `*-n` notes.
4. Compare against `/dashboard` (and the shelf on `/`) for the same year.

## Open questions for the owner (ask before changing)

1. Should the status badge on nightstand rows go? The group headings already
   say Reading / Up next.
2. Should `vite.optimizeDeps.include` list the packages Nuxt flags during
   `npm run dev`?

## Next (from the brief, not yet scheduled)

- Choose a host and deploy. Out of scope until the owner picks a host.
- In `~/dev/sandbox/web/gritts.dev`, replace `/books` with a link or redirect
  to books.gritts.net and delete its `content/books/`. This is a separate
  change.
