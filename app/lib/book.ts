// The data contract: frontmatter written by the vault's sync-site.ts.
// Property names and values are the vault's. Only title, slug and status are
// guaranteed; to-read books leave most fields empty. Mirrors the `books`
// collection schema in content.config.ts; keep the two in step.

export type BookStatus = 'to-read' | 'reading' | 'read' | 'abandoned'

export interface Book {
	title: string
	slug: string
	status: BookStatus
	author?: string[] | null
	cover_image?: string | null
	genre?: string[] | null
	pages?: number | null
	publication_year?: number | null
	isbn?: number | string | null
	started_at?: string | null
	finished_at?: string | null
	/** 1–8, the owner's own scale. Never rescale. */
	rating?: number | null
	/** URL, or "none" when there is no article. */
	wikipedia?: string | null
	hardcover_id?: string | null
	storygraph_id?: string | null
	audible?: boolean | null
	series?: string[] | null
	series_number?: number | null
	/** Yearly goal tag. false counts toward the goal; null = untagged. */
	white_male_author?: boolean | null
	/** true if any author is a person of color. */
	author_poc?: boolean | null
	places?: string[] | null
}

export const RATING_MAX = 8

export type AuthorTag = 'wm' | 'other' | 'untagged'

export function authorTag(value: boolean | null | undefined): AuthorTag {
	if (value === true) return 'wm'
	if (value === false) return 'other'
	return 'untagged'
}

export const AUTHOR_TAG_LABEL: Record<AuthorTag, string> = {
	other: 'Everyone else',
	wm: 'White men',
	untagged: 'Untagged',
}

/** One book's tag, for a row: "White man" rather than "White men". */
export const AUTHOR_TAG_SINGLE: Record<AuthorTag, string> = {
	other: 'Everyone else',
	wm: 'White man',
	untagged: 'Untagged',
}
