const nf = new Intl.NumberFormat('en-US')

export function formatNumber(n: number): string {
	return nf.format(n)
}

/** "1 page" / "310 pages". Counts always carry their unit. */
export function plural(n: number, one: string, many = `${one}s`): string {
	return `${formatNumber(n)} ${n === 1 ? one : many}`
}

const MONTH_SHORT = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
]

/** "2026-11-20" → "20 Nov 2026". */
export function longDate(iso: string): string {
	const [y, m, d] = iso.split('-')
	return `${+(d ?? 0)} ${MONTH_SHORT[+(m ?? 1) - 1]} ${y}`
}

/** "A", "A and B", "A, B and C". */
export function authorList(authors: readonly string[] | null | undefined) {
	const a = authors ?? []
	if (a.length < 2) return a[0] ?? 'Unknown author'
	return `${a.slice(0, -1).join(', ')} and ${a.at(-1)}`
}
