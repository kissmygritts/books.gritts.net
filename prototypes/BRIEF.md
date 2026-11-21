# books.gritts.net — prototype brief (shared by all five directions)

## What it is
A personal reading ledger: one person's books read, reading, to read and abandoned,
built from their Obsidian vault's frontmatter. Audience: the owner, plus friends and
curious visitors. Primary job: show what they're reading now and what they've read,
and let them (and visitors) see their reading year at a glance — especially the
yearly goal.

## Data
`books-data.js` in this folder sets `window.BOOKS` (243 books) and `window.AS_OF`
("2026-11-21"). Load it with `<script src="books-data.js"></script>`. Fields per book:
title, slug, status ("read" | "reading" | "to-read" | "abandoned"), author (array),
cover_image (Open Library URL or null), genre (array, lowercase-ish), pages,
publication_year, started_at, finished_at (ISO dates or null), rating (integer 1–8
or null), audible (true = audiobook, false = print, null = not recorded),
white_male_author (true / false / null = untagged), places (array, "Region" or
"Region, City"; region = US state, else country), series.

Counts: 213 read (13 with no finish date), 2 reading, 25 to read, 3 abandoned.
Finish years: 2018 (24), 2021 (5), 2022 (20), 2023 (8), 2024 (32), 2025 (54), 2026 (57).

## Hard content rules
- Ratings are the owner's **1–8 scale**. Always show the scale (`6/8` or eight
  marks). Never stars, never rescaled to 5 or 10.
- **The yearly goal:** more books finished by "everyone else" (white_male_author
  false) than by "white men" (true). null = "untagged", shown separately, never
  hidden. Show the tally for the selected year and whether the goal was met
  (for the current year 2026, "ahead/behind").
- Every figure carries its unit (`310 pages`, `23 books`).
- Book titles and author names exactly as written.
- Everything in the data is public, including to-read, abandoned and the author tag.

## What the prototype must contain (one HTML file, two views)
A view switch between **Books** and **Dashboard** (client-side, no reload).
- **Books view:** header with counts; "on the nightstand" — the 2 books reading
  now and the 25 up next; then a year filter (All, 2026 … 2018) and the shelf of
  finished books for that year (title, author, cover if any, finish date, pages,
  rating /8, author tag, audiobook marker), sortable at least by finish date and
  rating.
- **Dashboard view:** same year filter, then: the goal tally; the year in numbers
  (books, pages, average rating /8, audiobook share); books finished by month
  (by year under All); ratings distribution 1–8; publication decades; top genres;
  most-read authors; places (a list is fine — no map needed).
- The year filter is shared between views.

Moderate fidelity: real data rendered by vanilla JS (no frameworks, no build).
Charts hand-built in SVG or HTML/CSS. Google Fonts allowed; no other CDNs.
Responsive to 375px with no horizontal page scroll, visible keyboard focus,
`prefers-reduced-motion` respected. Good enough to judge the direction, not
production code. Keep it to one self-contained HTML file plus the shared data file.

## The original design (what every direction must move AWAY from)
Neutral cool grey desk, white rounded-xl cards with a faint ring, Bricolage
Grotesque headings + IBM Plex Sans/Mono, small uppercase tracked eyebrows,
blue/orange for the goal pair, pill-shaped year buttons, rows with tiny covers and
mono spec lines joined with middle dots. Basically a tidy SaaS dashboard.
A second attempt (cinematic, dark, Roger Deakins-lit, serif titles, letterbox
header with a skyline of book spines) was also rejected. Don't reuse it.

## Process
Load the skill `frontend-design:frontend-design` with the Skill tool first and
follow it: write a short plan (palette as 4–6 hex values, type, layout ASCII,
principles), review it against its list of AI-design defaults, revise, then build.
Do not use any browser tools (other agents share the browser). Do check your JS
parses: extract the inline script and run `node --check` on it, and sanity-run
your data functions under node with the data file if practical.
Write only your own HTML file. At the end, report in under 150 words: the
direction in one line, palette, fonts, the one memorable element, and anything
you couldn't do.
