// REACT
import { useEffect, useContext, MouseEvent } from 'react'

// PRISMIC
import { Document } from 'prismic-javascript/types/documents'

// NEXT
import { NextPageContext, NextPage } from 'next'
import Head from 'next/head'

// OBTENER DICCIONARIOS
import { fetchDictionary, htmlSerializer } from 'utils/Prismic'

// CONTEXTO
import { appContext } from 'context/appContext'

// COMPONENTES
import Meta from 'components/Meta'
import ScrollObserver from 'components/ScrollObserver'

// @ts-ignore
import { RichText } from 'prismic-reactjs'

// FRAMER
import { motion, Variants } from 'framer-motion'

// ROUTER
import { useRouter } from 'next/router'

// HERRAMIENTAS
import { saveDict } from 'utils/LocalDB'

// PROPIEDADES INICIALES
interface IDPageProps {
	dictionary: Document
}

// ANIMACIONES
const PostPageVariant: Variants = {
	init: { y: -100, opacity: 0 },
	in: { y: 0, opacity: 1, transition: { delay: 0.5 } },
}

// COMPONENTE
const Dictionary: NextPage<IDPageProps> = ({ dictionary }) => {
	// CONTEXTO
	const { setDict, lang } = useContext(appContext)

	// RUTA
	const router = useRouter()
	const path = router.asPath

	// GUARDAR DICCIONARIO
	useEffect(() => {
		// GUARDAR DICCIONARIO LOCALMENTE
		setDict(dictionary)
		saveDict(dictionary)

		// SCROLL
		const slices: NodeListOf<HTMLDivElement> = document.querySelectorAll('.slice')

		if (slices) {
			// OBTENER HASH
			const hashQuery: string = path.substr(path.indexOf('#') + 1)
			const hash: string | null = new URLSearchParams('sub=' + hashQuery).get('sub')

			// ELEMENTO A SCROLL
			let concept: HTMLDivElement | undefined

			// RECORRER SLICES
			slices.forEach((slice: HTMLDivElement) => {
				const cContent: HTMLDivElement = slice.childNodes[1] as HTMLDivElement
				if (hash && cContent.childNodes[0].textContent?.includes(hash)) concept = slice
			})

			// SCROLL Y CLASE
			if (concept) {
				concept.classList.add('active-concept')
				window.scrollTo({ top: concept.offsetTop - 20, behavior: 'smooth' })
			}
		}
	}, [path])

	// ORDENAR DICCIONARIO
	dictionary.data.body[0].items.sort(
		(a: ISlice, b: ISlice) => a.content[0].text > b.content[0].text
	)

	// GO BACK
	const goBack = (ev: MouseEvent<HTMLAnchorElement>) => {
		ev.preventDefault()
		router.back()
	}

	return (
		<section className='page dictionary'>
			<Head>
				<title>{lang.dictionaryPage.title}</title>
				<Meta
					title={lang.dictionaryPage.title}
					desc=''
					banner=''
					url='diccionario'
					keys={['LUA', 'blog', 'diccionario']}
				/>
			</Head>
			<ScrollObserver />
			<motion.div
				className='slices'
				initial='init'
				animate='in'
				exit='in'
				variants={PostPageVariant}>
				<a title='Regresar' href='/' className='post-page-back' onClick={goBack}>
					<i className='lni lni-chevron-left' />
				</a>

				<img src='/images/dictionary/dictionary.jpg' alt='Background' />
				<div className='slices-content'>
					<div className='slices-concepts'>
						{dictionary &&
							dictionary.data.body[0].items.map((item: ISlice, key: number) => (
								<div className='slice' key={key}>
									<img src={item.image.url} alt='Concept Icon' />
									<div className='content'>
										<RichText render={item.content} htmlSerializer={htmlSerializer} />
									</div>
								</div>
							))}
					</div>
					<div className='slices-index' />
				</div>
			</motion.div>

			<style jsx>{`
				.dictionary {
					display: flex;
					justify-content: center;
				}

				.slice {
					display: flex;
					width: 100%;
					align-items: center;
					padding: 20px;
					border-radius: 10px;
				}

				.slide:hover {
					background: var(--shadow);
					border-left: 5px solid var(--deepOrange);
				}

				.slice > img {
					width: 100px;
					height: 100px;
					min-width: 100px;
					min-height: 100px;
					object-fit: cover;
					border-radius: 10px;
					margin-right: 20px;
				}

				.slices-content {
					display: flex;
					justify-content: space-between;
					width: 100%;
					margin-bottom: 30px;
					font-size: 0.9em;
				}

				.slices-index {
					width: 300px;
					margin-left: 80px;
					height: 100%;
				}

				.slices-concepts {
					display: inline-grid;
					width: 100%;
					grid-template-columns: 1fr 1fr;
					column-gap: 30px;
					row-gap: 0px;
					margin-top: 30px;
				}

				.post-page-back {
					position: relative;
					margin-top: 10px;
					font-size: 1.5em;
					display: inline-flex;
					align-items: center;
					color: var(--postText);
					align-self: flex-start;
					margin-bottom: 20px;
				}

				.post-page-back::before {
					content: '';
					position: absolute;
					right: -10px;
					width: 26px;
					height: 2px;
					background: var(--postText);
				}
			`}</style>
			<style jsx global>{`
				.active-concept {
					background: var(--shadow);
					border-left: 5px solid var(--deepOrange);
				}

				.slices {
					display: flex;
					flex-direction: column;
					align-items: center;
					max-width: 1300px;
					width: calc(100% - 140px);
				}

				.slices > img {
					width: 100%;
					height: 300px;
					object-fit: cover;
					border-radius: 10px;
				}

				.slice > .content > h2 {
					margin-bottom: 10px;
					font-family: 'OpenSans';
					font-weight: 500;
					opacity: 0.9;
					color: var(--postText);
				}

				.slice > .content > p {
					font-family: 'OpenSans';
					color: var(--postText);
					font-size: 1.1em;
					opacity: 0.7;
					line-height: 20px;
				}
			`}</style>
		</section>
	)
}

// OBTENER DATOS DE PRISMIC
Dictionary.getInitialProps = async ({ res }: NextPageContext) => {
	// CONFIGURAR SPR VERCEL
	if (res) res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

	// OBTENER POSTS
	const dictionary: Document = await fetchDictionary()

	// CREAR PROPS
	const initProps: IDPageProps = { dictionary }

	// RETORNAR PROPS
	return initProps
}

export default Dictionary
