// The field palette, one per viewer. The head script in nuxt.config sets
// `data-palette` before paint; this reads it back after mount and writes
// both the attribute and localStorage on change.
import { PALETTE_KEY, PALETTES, type PaletteId } from '@/lib/palette'

export function usePalette() {
	const palette = useState<PaletteId>('palette', () => 'blue')

	onMounted(() => {
		const saved = document.documentElement.dataset.palette
		if (PALETTES.some((p) => p.id === saved)) palette.value = saved as PaletteId
	})

	function set(id: PaletteId) {
		palette.value = id
		const root = document.documentElement
		if (id === 'blue') delete root.dataset.palette
		else root.dataset.palette = id
		try {
			localStorage.setItem(PALETTE_KEY, id)
		} catch {}
	}

	function next() {
		const i = PALETTES.findIndex((p) => p.id === palette.value)
		set(PALETTES[(i + 1) % PALETTES.length]?.id ?? 'blue')
	}

	const label = computed(
		() => PALETTES.find((p) => p.id === palette.value)?.label ?? 'Blue',
	)

	return { palette, label, set, next }
}
