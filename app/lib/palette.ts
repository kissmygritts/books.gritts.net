// The field palettes, in cycle order. Colors live in main.css under
// `[data-palette]`; blue is the default and has no attribute.
export const PALETTES = [
	{ id: 'blue', label: 'Blue' },
	{ id: 'red', label: 'Red' },
	{ id: 'green', label: 'Green' },
	{ id: 'violet', label: 'Violet' },
	{ id: 'teal', label: 'Teal' },
	{ id: 'rust', label: 'Rust' },
	{ id: 'plum', label: 'Plum' },
	{ id: 'forest', label: 'Forest' },
	{ id: 'slate', label: 'Slate' },
	{ id: 'ink', label: 'Ink' },
] as const

export type PaletteId = (typeof PALETTES)[number]['id']

export const PALETTE_KEY = 'books-palette'

// Inlined in <head> so the saved palette paints before first render.
export const PALETTE_BOOT = `try{var p=localStorage.getItem('${PALETTE_KEY}');if(p&&p!=='blue')document.documentElement.dataset.palette=p}catch(e){}`
