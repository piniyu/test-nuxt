// https://nuxt.com/docs/api/configuration/nuxt-config
// import path from 'path'
// import fs from 'fs'
export default defineNuxtConfig({
	devtools: { enabled: true },
	app: {
		baseURL:
			process.env.NODE_ENV === 'production'
				? process.env.PRODUCTION_NUXT_APP_BASE_URL
				: '/',
	},
	devServer: {
		https: {
			key: './server.key',
			cert: './server.crt',
		},
	},
})
