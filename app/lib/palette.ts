// The field palettes, in cycle order: round the hue wheel from red, then
// the two near-greys. Colors live in main.css under
// `[data-palette]`. The default (forest) is also `:root`, so <html> carries
// no attribute for it; it keeps its own rule so a forest swatch stays forest.
export const PALETTES = [
	{ id: 'red', label: 'Red' },
	{ id: 'rust', label: 'Rust' },
	{ id: 'green', label: 'Green' },
	{ id: 'forest', label: 'Forest' },
	{ id: 'teal', label: 'Teal' },
	{ id: 'blue', label: 'Blue' },
	{ id: 'violet', label: 'Violet' },
	{ id: 'plum', label: 'Plum' },
	{ id: 'slate', label: 'Slate' },
	{ id: 'ink', label: 'Ink' },
] as const

export type PaletteId = (typeof PALETTES)[number]['id']

export const DEFAULT_PALETTE: PaletteId = 'forest'

export const PALETTE_KEY = 'books-palette'

// Inlined in <head> so the saved palette paints before first render.
export const PALETTE_BOOT = `try{var p=localStorage.getItem('${PALETTE_KEY}');if(p&&p!=='${DEFAULT_PALETTE}')document.documentElement.dataset.palette=p}catch(e){}`
