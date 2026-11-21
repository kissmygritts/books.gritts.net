// The book under the pointer on a dashboard page, shown in its caption.
// <DashPage> provides it; the dot charts inside set it.
import type { InjectionKey, Ref } from 'vue'
import type { Book } from '@/lib/book'

const KEY: InjectionKey<Ref<Book | null>> = Symbol('hover-book')

export function provideHoverBook() {
	const book = ref<Book | null>(null)
	provide(KEY, book)
	return book
}

export function useHoverBook(): Ref<Book | null> {
	return inject(KEY, () => ref<Book | null>(null), true)
}

const NOTE: InjectionKey<Ref<string | null>> = Symbol('hover-note')

/** A line about a hovered region (a state on the map), for charts whose
 * marks aren't single books. <DashPage> shows it when no book is hovered. */
export function provideHoverNote() {
	const note = ref<string | null>(null)
	provide(NOTE, note)
	return note
}

export function useHoverNote(): Ref<string | null> {
	return inject(NOTE, () => ref<string | null>(null), true)
}
