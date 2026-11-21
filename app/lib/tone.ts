// Domain color → utility class. Full class strings so Tailwind sees them.
export type Tone =
	| 'wm'
	| 'other'
	| 'untagged'
	| 'place'
	| 'audiobook'
	| 'print'
	| 'chart-1'
	| 'chart-2'
	| 'chart-3'
	| 'chart-4'
	| 'chart-5'

export const TONE_BG: Record<Tone, string> = {
	wm: 'bg-wm',
	other: 'bg-other',
	untagged: 'bg-untagged',
	place: 'bg-place',
	audiobook: 'bg-audiobook',
	print: 'bg-muted-foreground',
	'chart-1': 'bg-chart-1',
	'chart-2': 'bg-chart-2',
	'chart-3': 'bg-chart-3',
	'chart-4': 'bg-chart-4',
	'chart-5': 'bg-chart-5',
}

export const TONE_FILL: Record<Tone, string> = {
	wm: 'fill-wm',
	other: 'fill-other',
	untagged: 'fill-untagged',
	place: 'fill-place',
	audiobook: 'fill-audiobook',
	print: 'fill-muted-foreground',
	'chart-1': 'fill-chart-1',
	'chart-2': 'fill-chart-2',
	'chart-3': 'fill-chart-3',
	'chart-4': 'fill-chart-4',
	'chart-5': 'fill-chart-5',
}
