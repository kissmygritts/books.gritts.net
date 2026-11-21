// The year filter's value. Every page opens on the current year (the build
// year), or the latest year with a finished book if there is none yet.
import type { LedgerYear } from '@/lib/ledger'

export function useLedgerYear(years: Ref<number[]>, currentYear: number) {
	return ref<LedgerYear>(
		years.value.includes(currentYear) ? currentYear : (years.value[0] ?? 'all'),
	)
}
