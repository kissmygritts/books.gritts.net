// /llms.txt: what the site is and how to read /books.csv (llmstxt.org).
export default defineEventHandler(async (event) => {
	const generatedAt = useRuntimeConfig(event).public.generatedAt as string
	const books = await allBooks(event)
	const count = (s: string) => books.filter((b) => b.status === s).length

	setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
	return `# books.gritts.net

> A personal reading log: every book read, being read, queued or abandoned, with dates, ratings and a few facts about each book and its authors. Data as of ${generatedAt}.

The log holds ${books.length} books: ${count('read')} read, ${count('reading')} reading, ${count('to-read')} up next, ${count('abandoned')} abandoned. The whole log is one CSV file; it is small enough to read in full.

## Data

- [books.csv](/books.csv): every book, one row each. Reading first, then finished books newest first, then up next, then abandoned.

## Columns

- \`title\`, \`slug\`: the book; \`slug\` is a unique id.
- \`author\`: one or more authors, separated by "; ". The same goes for every list column.
- \`status\`: \`read\`, \`reading\`, \`to-read\` (up next) or \`abandoned\`.
- \`started_at\`, \`finished_at\`: ISO dates (yyyy-mm-dd). Some older \`read\` books have no dates.
- \`rating\`: 1 to 8, the owner's own scale (8 is best). Not stars out of 5; don't rescale. Empty means unrated.
- \`pages\`, \`publication_year\`: page count and year published.
- \`genre\`: free-form tags (e.g. "fiction; science fiction; dystopian").
- \`series\`, \`series_number\`: the series and the book's place in it.
- \`audible\`: true if listened to as an audiobook, false if read in print or ebook.
- \`author_gender\`: one entry per author: man, woman or nonbinary.
- \`white_male_author\`: true if the authors are white men. The owner tracks a yearly goal of books by anyone else.
- \`author_poc\`: true if any author is a person of color.
- \`author_indigenous\`: true if any author is Indigenous, anywhere.
- \`author_lgbtq\`: true if any author has publicly identified as LGBTQ+.
- \`author_country\`: the authors' nationality, one or more countries.
- \`author_died\`: death years of the authors who have died; empty means all are living.
- \`original_language\`: the language the book was first written in; anything but English means it was read in translation.
- \`places\`: where the book is set: a US state or a country first, then optionally a city.
- \`debut\`: true if this is the first book of any of its authors.
- \`awards\`: major juried prizes the book won (e.g. Hugo Award); empty means none.
- \`challenged\`: true if the book is on an ALA Top 10 / Top 100 challenged list or in PEN America's ban index.
- \`isbn\`, \`wikipedia\`: identifiers; \`wikipedia\` is a URL or "none".

Otherwise, empty cells mean unknown or not recorded, not false. Books not yet read usually have most columns empty.

## Site

- [Home](/): every finished book as a dot, then charts by year below it: goal, month, rating, length, genre, author, location.
- [Books](/books): the tables by status.
`
})
