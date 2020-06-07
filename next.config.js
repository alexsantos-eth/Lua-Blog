const withOffline = require('next-offline')

module.exports = withOffline({
	webpack(config) {
		config.module.rules.push({
			test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
			use: {
				loader: "url-loader",
				options: {
					limit: 100000
				}
			}
		});

		return config
	},
	workboxOpts: {
		swDest: process.env.NEXT_EXPORT
			? 'service-worker.js'
			: 'static/service-worker.js',
		runtimeCaching: [
			{
				urlPattern: /^https?.*/,
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'offlineCache',
					expiration: {
						maxEntries: 200
					}
				}
			},
			{
				urlPattern: /\.(?:png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				handler: 'CacheFirst',
				options: {
					cacheName: 'assets',
				},
			}
		]
	},
	experimental: {
		async rewrites() {
			return [
				{
					source: '/service-worker.js',
					destination: '/_next/static/service-worker.js',
				},
			]
		},
	},
	distDir: "build",
	poweredByHeader: false,
});
