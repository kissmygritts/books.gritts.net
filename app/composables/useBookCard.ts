// The book card: a small popup over a dot, like a link preview. Hover opens
// it after a beat, a click (or tap) opens it at once; moving onto the card
// keeps it open. A click also pins it: hover no longer moves or closes it,
// so a long list can be scrolled; Escape or a click outside (the popover's
// dismiss) closes it. One per dot container, rendered by <BookCardPopover>.
// `usePopupCard` is the same behavior for any item (a map region's books,
// <PlaceCardPopover>).
import type { Book } from '@/lib/book'

const OPEN_DELAY = 300
const CLOSE_DELAY = 150

export function usePopupCard<T>() {
	const item = shallowRef<T | null>(null)
	const anchor = shallowRef<Element | null>(null)
	const pinned = ref(false)
	let openT: ReturnType<typeof setTimeout> | undefined
	let closeT: ReturnType<typeof setTimeout> | undefined

	function clear() {
		clearTimeout(openT)
		clearTimeout(closeT)
	}

	/** Open on `el`; already open, swap at once, so sweeping across marks
	 * reads. Hover (a delay) can't move a pinned card; a click, the arrow
	 * keys or focus (no delay) can, and a click pins. */
	function show(v: T, el: Element, delay = OPEN_DELAY, pin = false) {
		if (pinned.value && delay > 0) return
		clear()
		if (pin) pinned.value = true
		const go = () => {
			item.value = v
			anchor.value = el
		}
		if (item.value || delay === 0) go()
		else openT = setTimeout(go, delay)
	}

	function hide() {
		if (pinned.value) return
		clear()
		closeT = setTimeout(close, CLOSE_DELAY)
	}

	function close() {
		clear()
		pinned.value = false
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
			click: (e: MouseEvent) => show(v, e.currentTarget as Element, 0, true),
		}
	}

	onScopeDispose(clear)
	return { item, anchor, pinned, show, hide, keep: clear, close, on }
}

export type PopupCard<T> = ReturnType<typeof usePopupCard<T>>

export const useBookCard = () => usePopupCard<Book>()
export type BookCard = PopupCard<Book>
