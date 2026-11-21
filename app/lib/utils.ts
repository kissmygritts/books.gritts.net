import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge the custom type scale in main.css; otherwise it reads
// `text-meta` as a color and drops it next to `text-muted-foreground`.
const twMerge = extendTailwindMerge({
	extend: {
		theme: {
			text: ['meta', 'body', 'heading', 'verdict', 'title', 'figure'],
		},
	},
})

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
