import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Badge } from './Badge.vue'

// One chip weight: a hairline pill in the current ink (the audiobook marker).
export const badgeVariants = cva(
	'inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full border border-current px-2 text-xs',
	{
		variants: { variant: { outline: '' } },
		defaultVariants: { variant: 'outline' },
	},
)
export type BadgeVariants = VariantProps<typeof badgeVariants>
