<script setup lang="ts">
// The cover dither, rendered once in app.vue and used through the
// `filter-dither` utility (`--dither` in main.css picks light or dark).
// Grey the image, add noise, then threshold to two inks. The table values
// are sRGB 0–1 for foreground / background in main.css; keep them in step.
// `dither-field` (`filter-dither-field`) has no fixed inks: light pixels go
// white, dark ones transparent, so the card color behind shows through and
// the cover follows the palette.
const FILTERS = [
	{ id: 'dither-light', r: '.2 .89', g: '.255 .902', b: '.369 .925' },
	{ id: 'dither-dark', r: '.106 .89', g: '.129 .902', b: '.188 .925' },
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
      <feComponentTransfer in="mix">
        <feFuncR type="discrete" :tableValues="f.r" />
        <feFuncG type="discrete" :tableValues="f.g" />
        <feFuncB type="discrete" :tableValues="f.b" />
        <feFuncA type="identity" />
      </feComponentTransfer>
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
