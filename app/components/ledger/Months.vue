<script setup lang="ts">
// Books finished by month, or by year under "All".
import type { Bucket, LedgerYear } from '@/lib/ledger'

const props = defineProps<{ buckets: Bucket[]; years: number[] }>()
const year = defineModel<LedgerYear>('year', { required: true })

const byYear = computed(() => year.value === 'all')
// Years run newest first; months run January to December.
const columns = computed(() =>
	(byYear.value ? [...props.buckets].reverse() : props.buckets).map((b) => ({
		key: b.key,
		label: byYear.value ? b.name : b.label,
		name: b.name,
		books: b.books,
	})),
)
const caption = computed(() =>
	byYear.value
		? 'Books finished each year. Pick a year to see its months.'
		: `Books finished each month of ${year.value}.`,
)
</script>

<template>
  <DashPage legend
    id="months"
    v-model:year="year"
    :title="byYear ? 'By year' : 'By month'"
    :caption="caption"
    :years="years"
  >
    <DotColumns :columns="columns" :per-row="byYear ? 4 : 2" :max-rows="10" />
  </DashPage>
</template>
