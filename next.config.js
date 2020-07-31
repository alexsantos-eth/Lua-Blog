const withOffline = require('next-offline')
const withCSS = require('@zeit/next-css')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = withCSS(
	withOffline({
		webpack(config) {
			config.module.rules.push({
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				use: {
					loader: 'url-loader',
					options: {
						limit: 100000,
					},
				},
			})

			if (config.resolve.plugins) config.resolve.plugins.push(new TsconfigPathsPlugin())
			else config.resolve.plugins = [new TsconfigPathsPlugin()]

			return config
		},
		workboxOpts: {
			swDest: process.env.NEXT_EXPORT ? 'service-worker.js' : 'static/service-worker.js',
			runtimeCaching: [
				{
					urlPattern: /^https?.*/,
					handler: 'StaleWhileRevalidate',
					options: {
						cacheName: 'offlineCache',
						expiration: {
							maxEntries: 200,
						},
					},
				},
				{
					urlPattern: /\.(?:png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
					handler: 'CacheFirst',
					options: {
						cacheName: 'assets',
					},
				},
			],
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
		target: 'serverless',
		distDir: 'build',
		poweredByHeader: false,
	})
)
