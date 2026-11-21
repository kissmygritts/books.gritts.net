import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	modules: ['@nuxt/content', 'shadcn-nuxt'],
	devtools: { enabled: true },
	compatibilityDate: '2025-07-15',

	components: [
		// shadcn primitives live in components/ui; scan only .vue so the
		// re-export index.ts files don't double-register.
		{ path: '~/components/ui', extensions: ['vue'], pathPrefix: false },
		'~/components',
	],

	css: ['~/assets/css/main.css'],

	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			title: 'Books',
			meta: [{ name: 'color-scheme', content: 'light dark' }],
			link: [
				{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
				{
					rel: 'preconnect',
					href: 'https://fonts.gstatic.com',
					crossorigin: '',
				},
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,750&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap',
				},
			],
		},
	},

	nitro: { prerender: { crawlLinks: true, routes: ['/', '/styleguide'] } },

	vite: { plugins: [tailwindcss()] },

	shadcn: { prefix: '', componentDir: '@/components/ui' },
})
