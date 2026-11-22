<script setup lang="ts">
// The cover dither, rendered once in app.vue and used through the
// `filter-dither` utility (`--dither` in main.css picks light or dark).
// Grey the image, add noise, then threshold to two inks: the page's ink and
// ground for that theme (`--page-ink-*` / `--page-ground-*`), read through
// `flood-color`, so covers follow the palette.
// `dither-field` (`filter-dither-field`) has no inks: light pixels go white,
// dark ones transparent, so the card color behind shows through.
const FILTERS = [
	{ id: 'dither-light', ink: 'var(--page-ink-light)', ground: 'var(--page-ground-light)' },
	{ id: 'dither-dark', ink: 'var(--page-ink-dark)', ground: 'var(--page-ground-dark)' },
]
</script>

<template>
  <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
    <filter
      v-for="f in FILTERS"
      :id="f.id"
      :key="f.id"
      color-interpolation-filters="sRGB"
      x="0"
      y="0"
      width="100%"
      height="100%"
    >
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values=".3 .59 .11 0 0  .3 .59 .11 0 0  .3 .59 .11 0 0  0 0 0 1 0"
        result="grey"
      />
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="noise" />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"
        result="noiseGrey"
      />
      <feComposite in="grey" in2="noiseGrey" operator="arithmetic" k1="0" k2="1.15" k3="1" k4="-.62" result="mix" />
      <feColorMatrix in="mix" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0" />
      <feComponentTransfer result="light">
        <feFuncA type="discrete" tableValues="0 1" />
      </feComponentTransfer>
      <feFlood :style="{ floodColor: f.ground }" result="groundFill" />
      <feComposite in="groundFill" in2="light" operator="in" result="ground" />
      <feFlood :style="{ floodColor: f.ink }" result="ink" />
      <feMerge>
        <feMergeNode in="ink" />
        <feMergeNode in="ground" />
      </feMerge>
    </filter>
    <filter id="dither-field" color-interpolation-filters="sRGB" x="0" y="0" width="100%" height="100%">
      <feColorMatrix
        in="SourceGraphic"
        type="matrix"
        values=".3 .59 .11 0 0  .3 .59 .11 0 0  .3 .59 .11 0 0  0 0 0 1 0"
        result="grey"
      />
      <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="noise" />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"
        result="noiseGrey"
      />
      <feComposite in="grey" in2="noiseGrey" operator="arithmetic" k1="0" k2="1.15" k3="1" k4="-.62" result="mix" />
      <feColorMatrix in="mix" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  1 0 0 0 0" />
      <feComponentTransfer>
        <feFuncA type="discrete" tableValues="0 1" />
      </feComponentTransfer>
    </filter>
  </svg>
</template>
