import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
	modules: ['@nuxt/content', 'shadcn-nuxt'],
	devtools: { enabled: true },
	devServer: { port: 8008 }, // 8008 reads like "BOOK"
	compatibilityDate: '2025-07-15',

	components: [
		// shadcn primitives live in components/ui; scan only .vue so the
		// re-export index.ts files don't double-register.
		{ path: '~/components/ui', extensions: ['vue'], pathPrefix: false },
		'~/components',
	],

	css: ['~/assets/css/main.css'],

	// The build date stands in for the ledger's GENERATED: "as of" and the
	// current year/month are fixed at generate time, so SSR and hydration agree.
	runtimeConfig: {
		public: { generatedAt: new Date().toISOString().slice(0, 10) },
	},

	app: {
		head: {
			htmlAttrs: { lang: 'en' },
			title: 'Gritts Books',
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
					href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500&display=swap',
				},
			],
		},
	},

	nitro: { prerender: { crawlLinks: true, routes: ['/', '/dashboard', '/books', '/styleguide'] } },

	vite: { plugins: [tailwindcss()] },

	shadcn: { prefix: '', componentDir: '@/components/ui' },
})
