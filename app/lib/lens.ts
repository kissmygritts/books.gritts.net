// Ways to fill the home grid's dots. Each lens sorts a book into solid,
// ring or pip (BookDot's `other` / `wm` / `untagged`) from one frontmatter
// field. Only the home grid switches; the goal and tables stay on
// `white_male_author`.
import { type AuthorTag, authorTag, type Book } from '@/lib/book'

export type LensId = 'wm' | 'gender' | 'poc' | 'translated' | 'american'

export interface Lens {
	id: LensId
	/** The control's name for it, e.g. "White men". */
	name: string
	tag: (b: Book) => AuthorTag
	label: Record<AuthorTag, string>
}

const yes = (v: boolean | null | undefined): AuthorTag => (v == null ? 'untagged' : v ? 'other' : 'wm')

export const LENSES: Lens[] = [
	{
		id: 'wm',
		name: 'White men',
		tag: (b) => authorTag(b.white_male_author),
		label: { other: 'Everyone else', wm: 'White man', untagged: 'Untagged' },
	},
	{
		id: 'gender',
		name: 'Gender',
		tag: (b) => yes(b.author_gender?.length ? b.author_gender.some((g) => g !== 'man') : null),
		label: { other: 'Woman or nonbinary', wm: 'Man', untagged: 'Not recorded' },
	},
	{
		id: 'poc',
		name: 'Authors of color',
		tag: (b) => yes(b.author_poc),
		label: { other: 'Person of color', wm: 'White', untagged: 'Not recorded' },
	},
	{
		id: 'translated',
		name: 'Translated',
		tag: (b) => yes(b.original_language ? b.original_language !== 'English' : null),
		label: { other: 'Translated', wm: 'Written in English', untagged: 'Not recorded' },
	},
	{
		id: 'american',
		name: 'American',
		tag: (b) =>
			yes(b.author_country?.length ? !b.author_country.includes('United States') : null),
		label: { other: 'Not American', wm: 'American', untagged: 'Not recorded' },
	},
]

export function lensById(id: string): Lens | undefined {
	return LENSES.find((l) => l.id === id)
}

export function nextLens(id: LensId): Lens {
	const i = LENSES.findIndex((l) => l.id === id)
	return LENSES[(i + 1) % LENSES.length] as Lens
}
