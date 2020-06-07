// COMPONENTES
import Layout from 'Layout'

// APP
import { AppProps } from 'next/app'

// ESTILOS
import 'styles/MainStyles.css'
import 'styles/Icons.css'

const LuaBlogApp = ({ Component, pageProps, router }: AppProps) => {
	// COMPONENTE
	return (
		<Layout>
			<Component {...pageProps} key={router.route} />
		</Layout>
	)
}

export default LuaBlogApp
