// COMPONENTES
import Document, { Html, Main, Head, NextScript, DocumentContext } from 'next/document'

interface DocProps {
	lang: ILangPackage
	langCode: string
}

class LuaDoc extends Document<DocProps> {
	static async getInitialProps(ctx: DocumentContext) {
		// OBTENER PROPIEDADES INICIALES
		const initialProps = await Document.getInitialProps(ctx)

		// OBTENER CÓDIGO DEL LENGUAJE EN EL SERVIDOR O CLIENTE
		const lang: string | undefined = ctx.req
			? ctx.req.headers['accept-language']?.substr(0, 2)
			: process.browser
			? navigator.language.substr(0, 2)
			: 'es'

		// ASIGNAR EL CÓDIGO DEL LENGUAJE AL OBJETO JSON DE LOS TEXTOS
		return {
			...initialProps,
			langCode: lang || 'es',
		}
	}

	render() {
		return (
			<Html lang={this.props.langCode}>
				<Head>
					<meta name='author' content='LUA Development Studio' />
					<meta name='theme-color' content='#ff5722' />
					<meta name='Robots' content='follow' />
					<meta name='MobileOptimized' content='yes' />
					<meta name='HandheldFriendly' content='yes' />
					<meta name='mobile-web-app-capable' content='yes' />
					<meta name='apple-mobile-web-app-capable' content='yes' />
					<meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
					<link rel='shortcut icon' href='./favicon.ico' />
					<link rel='favicon' href='./favicon.ico' />
					<link rel='manifest' href='./manifest.json' />
					<meta name='msapplication-TileColor' content='#ffffff' />
					<meta name='msapplication-TileImage' content='/images/icons/ms-icon-144x144.png' />
					<link rel='apple-touch-icon' sizes='57x57' href='/images/icons/apple-icon-57x57.png' />
					<link rel='apple-touch-icon' sizes='60x60' href='/images/icons/apple-icon-60x60.png' />
					<link rel='apple-touch-icon' sizes='72x72' href='/images/icons/apple-icon-72x72.png' />
					<link rel='apple-touch-icon' sizes='76x76' href='/images/icons/apple-icon-76x76.png' />
					<link
						rel='apple-touch-icon'
						sizes='114x114'
						href='/images/icons/apple-icon-114x114.png'
					/>
					<link
						rel='apple-touch-icon'
						sizes='120x120'
						href='/images/icons/apple-icon-120x120.png'
					/>
					<link
						rel='apple-touch-icon'
						sizes='144x144'
						href='/images/icons/apple-icon-144x144.png'
					/>
					<link
						rel='apple-touch-icon'
						sizes='152x152'
						href='/images/icons/apple-icon-152x152.png'
					/>
					<link
						rel='apple-touch-icon'
						sizes='180x180'
						href='/images/icons/apple-icon-180x180.png'
					/>
					<link
						rel='icon'
						type='image/png'
						sizes='192x192'
						href='/images/icons/android-icon-192x192.png'
					/>
					<link rel='icon' type='image/png' sizes='32x32' href='/images/icons/favicon-32x32.png' />
					<link rel='icon' type='image/png' sizes='96x96' href='/images/icons/favicon-96x96.png' />
					<link rel='icon' type='image/png' sizes='16x16' href='/images/icons/favicon-16x16.png' />
					<meta property='og:type' content='website' />
					<meta name='twitter:card' content='summary_large_image' />
					<meta property='og:locale' content='es_GT' />
					<meta property='fb:app_id' content='1170302416648939' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default LuaDoc
