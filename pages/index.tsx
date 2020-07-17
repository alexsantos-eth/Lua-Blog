// NEXT, REACT Y PRISMIC
import { Document } from 'prismic-javascript/types/documents'
import { NextPage, NextPageContext } from 'next'
import {
	useEffect,
	useContext,
	Dispatch,
	SetStateAction,
	useState,
	ChangeEvent,
	useCallback,
} from 'react'

// ROUTER
import Link from 'next/link'
import Head from 'next/head'

// COMPONENTES
import Meta from 'components/Meta'
import PostCard from 'components/PostCard'

// HERRAMIENTAS
import fetchPosts from 'utils/Prismic'
import { linkResolver, hrefResolver, getSortPopular } from 'utils/Tools'
import { saveDocs } from 'utils/LocalDB'

// PRISMIC REACT
// @ts-ignore
import { RichText } from 'prismic-reactjs'

// CONTEXTO
import { appContext } from 'context/appContext'

// ANIMACIONES
import { Variants, motion } from 'framer-motion'

// VARIANTES
const contentV: Variants = {
	initial: { x: -100, opacity: 0 },
	in: { x: 0, opacity: 1, transition: { delay: 0.5 } },
}

// ESTADO
interface IndexState {
	docs: Document[]
	popular: Document[]
	notSort: boolean
}

// PROPIEDADES INICIALES
interface PageProps {
	posts: Document[]
}

const Index: NextPage<PageProps> = ({ posts }) => {
	// CONTEXTO
	const { lang, setDocs } = useContext(appContext)

	// ESTADO INICIAL
	const DefState: IndexState = {
		docs: posts,
		popular: posts,
		notSort: true,
	}

	// ESTADO
	const [postsState, setPosts]: [IndexState, Dispatch<SetStateAction<IndexState>>] = useState(
		DefState
	)

	// GUARDAR DOCS EN LOCAL DB
	useEffect(() => {
		// OBTENER DOCUMENTOS DESTACADOS
		getSortPopular(posts).then((popular: Document[]) =>
			setPosts({ docs: postsState.docs, notSort: postsState.notSort, popular })
		)

		// GUARDAR POSTS
		saveDocs(posts)

		// CARGAR DESDE CACHE
		setDocs(posts)
	}, [postsState.docs, postsState.notSort])

	// CAMBIAR ENTRE DESTACADOS Y RECIENTES
	const changeDocs = useCallback(
		(ev: ChangeEvent<HTMLSelectElement>) => {
			// SELECCIONAR INPUT
			const select: HTMLSelectElement = ev.target as HTMLSelectElement
			const index: number = select.selectedIndex

			// CAMBIAR ESTADO
			setPosts({ ...postsState, notSort: index === 0 })
		},
		[postsState.docs, postsState.notSort]
	)

	return (
		<section className='page home'>
			<Head>
				<title>{lang.general.title}</title>
				<Meta title={lang.general.title} desc='' banner='' url='' keys={['LUA', 'blog']} />
			</Head>
			{postsState.docs && (
				<motion.div
					variants={contentV}
					initial='initial'
					animate='in'
					exit='initial'
					className='homeContainer'>
					<div className='selectPost'>
						<select onChange={changeDocs} id='selectPost'>
							<option>{lang.index.postTitle}</option>
							<option>{lang.index.postTitle_2}</option>
						</select>
						<i className='lni lni-chevron-down selectIcon' />
					</div>

					<div className='postsList'>
						{(postsState.notSort ? postsState.docs : postsState.popular).map(
							(doc: Document, key: number) => (
								<PostCard key={key} doc={doc} />
							)
						)}
					</div>

					<div className='postsC-container'>
						<div className='postsRecent postClip'>
							<h2>{lang.index.postTitle}</h2>
							<ul>
								{postsState.docs.map((doc: Document, key: number) => {
									if (key < 3)
										return (
											<li key={key}>
												<Link href={hrefResolver(doc)} as={linkResolver(doc)}>
													<a>{RichText.asText(doc.data.title)}</a>
												</Link>
											</li>
										)
								})}
							</ul>
						</div>

						<div className='bestPosts postClip'>
							<h2>{lang.index.postTitle_2}</h2>
							<ul>
								{postsState.popular.map((doc: Document, key: number) => {
									if (key < 3)
										return (
											<li key={key}>
												<Link href={hrefResolver(doc)} as={linkResolver(doc)}>
													<a>{RichText.asText(doc.data.title)}</a>
												</Link>
											</li>
										)
								})}
							</ul>
						</div>
					</div>
				</motion.div>
			)}
			<style jsx global>{`
				.homeContainer {
					display: flex;
					justify-content: space-between;
					position: relative;
					margin-top: 30px;
					width: 1100px;
				}

				@media screen and (max-width: 1200px) {
					.homeContainer {
						width: 1030px;
					}
				}

				@media screen and (max-width: 1100px) {
					.homeContainer {
						width: 930px;
					}
				}

				@media screen and (max-width: 1000px) {
					.homeContainer {
						width: 100%;
						margin-top: 0;
						flex-direction: column;
					}
				}
			`}</style>
			<style jsx>{`
				.page {
					display: flex;
					align-items: center;
					justify-content: center;
				}

				.postClip {
					position: relative;
					color: var(--postText);
					width: 300px;
					border-radius: 10px;
					padding: 10px 60px;
					box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.05);
					margin-bottom: 30px;
					overflow: hidden;
				}

				.postClip::before {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: var(--navbarBackground);
					z-index: -2;
					transition: background 0.3s ease-in-out;
				}

				.postClip::after {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: var(--shadow);
					z-index: -1;
				}

				.postClip > h2 {
					text-align: center;
					font-weight: 500;
					margin-bottom: 35px;
					margin-top: 10px;
					font-size: 1.4em;
				}

				.postClip > ul {
					list-style: initial;
				}

				.postClip > ul > li {
					margin-bottom: 20px;
				}

				.postClip > ul > li > a {
					color: var(--postText);
				}

				.selectIcon {
					color: var(--postText);
					font-size: 1.5em;
					margin-left: 5px;
				}

				.selectPost {
					display: none;
					align-items: center;
					margin-bottom: 30px;
				}

				select {
					appearance: none;
					border: none;
					outline: none;
					background: transparent;
					font-family: 'OpenSans';
					color: var(--postText);
					font-size: 2.3em;
					font-weight: 600;
					cursor: pointer;
				}

				@media screen and (max-width: 1000px) {
					.postClip {
						display: none;
					}

					.page {
						padding: 0 50px;
					}

					.selectPost {
						display: flex;
					}
				}

				@media screen and (max-width: 460px) {
					.page {
						padding: 0 30px;
					}
				}
			`}</style>
			<style jsx global>{`
				.postClip > ul > li > a {
					font-family: 'OpenSans';
					font-size: 1.1em;
					color: var(--dark);
				}
			`}</style>
		</section>
	)
}

// OBTENER DATOS DE PRISMIC
Index.getInitialProps = async ({ res }: NextPageContext) => {
	// CONFIGURAR SPR VERCEL
	if (res) res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

	// OBTENER POSTS
	const posts: Document[] = await fetchPosts()

	// CREAR PROPS
	const initProps: PageProps = { posts }

	// RETORNAR PROPS
	return initProps
}

export default Index
