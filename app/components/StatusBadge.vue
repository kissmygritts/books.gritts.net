<script setup lang="ts">
import { BookCheck, Bookmark, BookOpen, BookX } from '@lucide/vue'
import type { BadgeVariants } from '@/components/ui/badge'
import type { BookStatus } from '@/lib/book'

const props = defineProps<{ status: BookStatus }>()

const STATUS = {
	read: { label: 'Read', variant: 'outline', icon: BookCheck },
	reading: { label: 'Reading', variant: 'success', icon: BookOpen },
	'to-read': { label: 'To read', variant: 'secondary', icon: Bookmark },
	abandoned: { label: 'Abandoned', variant: 'destructive', icon: BookX },
} satisfies Record<
	BookStatus,
	{ label: string; variant: BadgeVariants['variant']; icon: unknown }
>

const s = computed(() => STATUS[props.status])
</script>

<template>
  <Badge :variant="s.variant">
    <component :is="s.icon" class="size-3.5" aria-hidden="true" />
    {{ s.label }}
  </Badge>
</template>
