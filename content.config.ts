import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// One flat <slug>.md per book, written by the vault's sync-site.ts.
// Frontmatter only, property names and values as the vault writes them.
// Only title, slug and status are guaranteed; to-read books leave most
// fields empty, so everything else is nullable and optional.
const day = z.string().nullish() // ISO yyyy-mm-dd
const list = z.array(z.string()).nullish()

export default defineContentConfig({
	collections: {
		books: defineCollection({
			type: 'data',
			source: 'books/*.md',
			schema: z.object({
				title: z.string(),
				slug: z.string(),
				status: z.enum(['to-read', 'reading', 'read', 'abandoned']),
				author: list,
				cover_image: z.string().nullish(),
				genre: list,
				pages: z.number().int().nullish(),
				publication_year: z.number().int().nullish(),
				isbn: z.union([z.number(), z.string()]).nullish(),
				started_at: day,
				finished_at: day,
				/** 1–8, the owner's own scale. Never rescale. */
				rating: z.number().int().nullish(),
				/** URL, or "none" when there is no article. */
				wikipedia: z.string().nullish(),
				hardcover_id: z.string().nullish(),
				storygraph_id: z.string().nullish(),
				audible: z.boolean().nullish(),
				series: list,
				series_number: z.number().nullish(),
				/** Yearly goal tag. false counts toward the goal; null = untagged. */
				white_male_author: z.boolean().nullish(),
				/** One entry per author: man / woman / nonbinary. */
				author_gender: list,
				/** true if any author is a person of color. */
				author_poc: z.boolean().nullish(),
				/** Author nationality, one or more countries (plain text, e.g. "United States"). */
				author_country: list,
				/** Language the book was first written in. Translated = not "English". */
				original_language: z.string().nullish(),
				/** Region first (US state, else country), optional city. */
				places: list,
			}),
		}),
	},
})
