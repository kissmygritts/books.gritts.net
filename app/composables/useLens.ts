// The dot lens, shared by the home grid and every dashboard page, kept in
// localStorage as `books-lens`. SSR and the first client render use White
// men; the saved lens is read after mount so hydration matches.
import { type Lens, type LensId, LENSES, lensById } from '@/lib/lens'

let restored = false

export function useLens() {
	const id = useState<LensId>('books-lens', () => 'wm')
	const lens = computed<Lens>(() => lensById(id.value) ?? (LENSES[0] as Lens))
	onMounted(() => {
		if (restored) return
		restored = true
		try {
			const saved = lensById(localStorage.getItem('books-lens') ?? '')
			if (saved) id.value = saved.id
		} catch {}
		watch(id, (v) => {
			try {
				localStorage.setItem('books-lens', v)
			} catch {}
		})
	})
	return { id, lens }
}
