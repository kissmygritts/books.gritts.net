// The book card: a small popup over a dot, like a link preview. Hover opens
// it after a beat, a click (or tap) opens it at once; moving onto the card
// keeps it open. One per dot container, rendered by <BookCardPopover>.
// `usePopupCard` is the same behavior for any item (a map region's books,
// <PlaceCardPopover>).
import type { Book } from '@/lib/book'

const OPEN_DELAY = 300
const CLOSE_DELAY = 150

export function usePopupCard<T>() {
	const item = shallowRef<T | null>(null)
	const anchor = shallowRef<Element | null>(null)
	let openT: ReturnType<typeof setTimeout> | undefined
	let closeT: ReturnType<typeof setTimeout> | undefined

	function clear() {
		clearTimeout(openT)
		clearTimeout(closeT)
	}

	/** Open on `el`. Already open: swap at once, so sweeping across marks reads. */
	function show(v: T, el: Element, delay = OPEN_DELAY) {
		clear()
		const go = () => {
			item.value = v
			anchor.value = el
		}
		if (item.value || delay === 0) go()
		else openT = setTimeout(go, delay)
	}

	function hide() {
		clear()
		closeT = setTimeout(close, CLOSE_DELAY)
	}

	function close() {
		clear()
		item.value = null
	}

	/** Pointer handlers for one mark: `v-on="card.on(item)"`. */
	function on(v: T) {
		return {
			pointerenter: (e: PointerEvent) => {
				if (e.pointerType === 'mouse') show(v, e.currentTarget as Element)
			},
			pointerleave: (e: PointerEvent) => {
				if (e.pointerType === 'mouse') hide()
			},
			click: (e: MouseEvent) => show(v, e.currentTarget as Element, 0),
		}
	}

	onScopeDispose(clear)
	return { item, anchor, show, hide, keep: clear, close, on }
}

export type PopupCard<T> = ReturnType<typeof usePopupCard<T>>

export const useBookCard = () => usePopupCard<Book>()
export type BookCard = PopupCard<Book>
