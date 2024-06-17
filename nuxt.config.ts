// https://nuxt.com/docs/api/configuration/nuxt-config
// import path from 'path'
// import fs from 'fs'
export default defineNuxtConfig({
	devtools: { enabled: true },
	app: {
		baseURL: '/test-nuxt/',
	},
	devServer: {
		https: {
			key: './server.key',
			cert: './server.crt',
		},
	},
})
