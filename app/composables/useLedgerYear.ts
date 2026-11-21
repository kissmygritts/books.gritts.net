// The year filter's value, shared by `/` (the shelf) and `/dashboard` (the
// panels) through one localStorage key, so both pages open on the same year.
import type { LedgerYear } from '@/lib/ledger'

export function useLedgerYear(years: Ref<number[]>) {
	return usePersisted<LedgerYear>(
		'books-year',
		years.value[0] ?? 'all',
		(raw) =>
			raw === 'all' ? 'all' : years.value.includes(+raw) ? +raw : undefined,
	)
}
