// A per-viewer preference (the year, a chart mode) kept in localStorage.
// SSR and the first client render use the default; the saved value is read
// after mount so hydration matches. Storage failures are ignored.
export function usePersisted<T>(
	key: string,
	initial: T,
	parse: (raw: string) => T | undefined,
) {
	const value = ref(initial) as Ref<T>
	onMounted(() => {
		try {
			const raw = localStorage.getItem(key)
			const v = raw == null ? undefined : parse(raw)
			if (v !== undefined) value.value = v
		} catch {}
		watch(value, (v) => {
			try {
				localStorage.setItem(key, String(v))
			} catch {}
		})
	})
	return value
}
