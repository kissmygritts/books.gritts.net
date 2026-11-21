<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'
</script>

<template>
  <TooltipProvider :delay-duration="0" :skip-delay-duration="0">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </TooltipProvider>
</template>
