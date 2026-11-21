import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// One flat <slug>.md per book, written by the vault's sync-site.ts.
// Frontmatter only; the full schema lands in phase 2.
export default defineContentConfig({
	collections: {
		books: defineCollection({
			type: 'data',
			source: 'books/*.md',
			schema: z.object({
				title: z.string(),
				slug: z.string(),
				status: z.enum(['to-read', 'reading', 'read', 'abandoned']),
			}),
		}),
	},
})
