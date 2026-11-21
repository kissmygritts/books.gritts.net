// Derived fields, ported from the vault's ledger.py. Pure functions over the
// synced frontmatter; nothing here changes the data contract.
import type { Book } from '@/lib/book'

/** Bare non-US city names → region. `City, ST` and `City, Country` need no entry. */
export const BARE_CITIES: Record<string, string> = {
	Tokyo: 'Japan',
	London: 'England',
	Amsterdam: 'Netherlands',
	'Mexico City': 'Mexico',
	Paris: 'France',
	Berlin: 'Germany',
	Dublin: 'Ireland',
	Tehran: 'Iran',
}

export const ABBR: Record<string, string> = {
	AL: 'Alabama',
	AK: 'Alaska',
	AZ: 'Arizona',
	AR: 'Arkansas',
	CA: 'California',
	CO: 'Colorado',
	CT: 'Connecticut',
	DE: 'Delaware',
	FL: 'Florida',
	GA: 'Georgia',
	HI: 'Hawaii',
	ID: 'Idaho',
	IL: 'Illinois',
	IN: 'Indiana',
	IA: 'Iowa',
	KS: 'Kansas',
	KY: 'Kentucky',
	LA: 'Louisiana',
	ME: 'Maine',
	MD: 'Maryland',
	MA: 'Massachusetts',
	MI: 'Michigan',
	MN: 'Minnesota',
	MS: 'Mississippi',
	MO: 'Missouri',
	MT: 'Montana',
	NE: 'Nebraska',
	NV: 'Nevada',
	NH: 'New Hampshire',
	NJ: 'New Jersey',
	NM: 'New Mexico',
	NY: 'New York',
	NC: 'North Carolina',
	ND: 'North Dakota',
	OH: 'Ohio',
	OK: 'Oklahoma',
	OR: 'Oregon',
	PA: 'Pennsylvania',
	RI: 'Rhode Island',
	SC: 'South Carolina',
	SD: 'South Dakota',
	TN: 'Tennessee',
	TX: 'Texas',
	UT: 'Utah',
	VT: 'Vermont',
	VA: 'Virginia',
	WA: 'Washington',
	WV: 'West Virginia',
	WI: 'Wisconsin',
	WY: 'Wyoming',
	DC: 'District of Columbia',
}

/** Full US state names, sorted (ledger.py's `__US_STATES__`). */
export const US_STATES: string[] = Object.values(ABBR).sort()

export interface SplitPlaces {
	regions: string[]
	/** region → cities set there */
	cities: Record<string, string[]>
}

/** ledger.py `split_places`: a city's region comes from its suffix or BARE_CITIES. */
export function splitPlaces(
	places: readonly string[] | null | undefined,
): SplitPlaces {
	const regions: string[] = []
	const cities: Record<string, string[]> = {}
	for (const x of places ?? []) {
		const at = x.lastIndexOf(', ')
		if (at !== -1) {
			const name = x.slice(0, at)
			const suffix = x.slice(at + 2)
			const region = ABBR[suffix] ?? suffix
			cities[region] ??= []
			cities[region].push(name)
		} else if (x in BARE_CITIES) {
			const region = BARE_CITIES[x] as string
			cities[region] ??= []
			cities[region].push(x)
		} else {
			regions.push(x)
		}
	}
	return { regions, cities }
}

/** Genres compared and grouped in lowercase, as the ledger does. */
export function genres(book: Pick<Book, 'genre'>): string[] {
	return (book.genre ?? []).map((g) => g.toLowerCase())
}

/** The article URL, or null when there is none (`"none"`) or none recorded. */
export function wikipediaUrl(book: Pick<Book, 'wikipedia'>): string | null {
	const w = book.wikipedia
	return w && w !== 'none' ? w : null
}

export interface DerivedBook extends Book, SplitPlaces {
	genres: string[]
	wikipediaUrl: string | null
}

export function derive(book: Book): DerivedBook {
	return {
		...book,
		...splitPlaces(book.places),
		genres: genres(book),
		wikipediaUrl: wikipediaUrl(book),
	}
}

/** Newest finish first; unrecorded finishes last, then by title. */
export function byFinishDesc(a: Book, b: Book): number {
	const fa = a.finished_at ?? ''
	const fb = b.finished_at ?? ''
	if (fa !== fb) return fa < fb ? 1 : -1
	return a.title.localeCompare(b.title)
}

/** Oldest finish first, then by title: the order of the home grid. */
export function byFinishAsc(a: Book, b: Book): number {
	const fa = a.finished_at ?? ''
	const fb = b.finished_at ?? ''
	if (fa !== fb) return fa < fb ? -1 : 1
	return a.title.localeCompare(b.title)
}
