// /books.csv: the whole reading log, one row per book, for LLMs and
// spreadsheets. Field names are the frontmatter's; /llms.txt documents them.
import type { Book } from '~/lib/book'

export const CSV_COLUMNS = [
	'title',
	'author',
	'status',
	'started_at',
	'finished_at',
	'rating',
	'pages',
	'publication_year',
	'genre',
	'series',
	'series_number',
	'audible',
	'author_gender',
	'white_male_author',
	'author_poc',
	'author_indigenous',
	'author_lgbtq',
	'author_country',
	'author_died',
	'original_language',
	'places',
	'debut',
	'awards',
	'challenged',
	'isbn',
	'wikipedia',
	'slug',
] as const satisfies readonly (keyof Book)[]

function cell(v: unknown): string {
	if (v == null) return ''
	const s = Array.isArray(v) ? v.join('; ') : String(v)
	return /[",\n\r]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s
}

export default defineEventHandler(async (event) => {
	const books = (await allBooks(event)).sort(byStatusThenFinish)
	const rows = [
		CSV_COLUMNS.join(','),
		...books.map((b) => CSV_COLUMNS.map((c) => cell(b[c])).join(',')),
	]
	setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
	return `${rows.join('\n')}\n`
})
