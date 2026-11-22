// The book card: a small popup over a dot, like a link preview. Hover opens
// it after a beat, a click (or tap) opens it at once; moving onto the card
// keeps it open. One per dot container, rendered by <BookCardPopover>.
import type { Book } from '@/lib/book'

const OPEN_DELAY = 300
const CLOSE_DELAY = 150

export function useBookCard() {
	const book = shallowRef<Book | null>(null)
	const anchor = shallowRef<HTMLElement | null>(null)
	let openT: ReturnType<typeof setTimeout> | undefined
	let closeT: ReturnType<typeof setTimeout> | undefined

	function clear() {
		clearTimeout(openT)
		clearTimeout(closeT)
	}

	/** Open on `el`. Already open: swap at once, so sweeping across dots reads. */
	function show(b: Book, el: HTMLElement, delay = OPEN_DELAY) {
		clear()
		const go = () => {
			book.value = b
			anchor.value = el
		}
		if (book.value || delay === 0) go()
		else openT = setTimeout(go, delay)
	}

	function hide() {
		clear()
		closeT = setTimeout(close, CLOSE_DELAY)
	}

	function close() {
		clear()
		book.value = null
	}

	/** Pointer handlers for one dot: `v-on="card.on(book)"`. */
	function on(b: Book) {
		return {
			pointerenter: (e: PointerEvent) => {
				if (e.pointerType === 'mouse') show(b, e.currentTarget as HTMLElement)
			},
			pointerleave: (e: PointerEvent) => {
				if (e.pointerType === 'mouse') hide()
			},
			click: (e: MouseEvent) => show(b, e.currentTarget as HTMLElement, 0),
		}
	}

	onScopeDispose(clear)
	return { book, anchor, show, hide, keep: clear, close, on }
}

export type BookCard = ReturnType<typeof useBookCard>
