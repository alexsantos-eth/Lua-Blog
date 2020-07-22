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
	useRef,
	MutableRefObject,
} from 'react'

// ROUTER
import Link from 'next/link'
import Head from 'next/head'

// COMPONENTES
import Meta from 'components/Meta'
import PostCard from 'components/PostCard'

// HERRAMIENTAS
import fetchPosts, { fetchDictionary, linkResolver } from 'utils/Prismic'
import IPostsDB, { saveDocs, saveDict, getPosts } from 'utils/LocalDB'
import getSortPopular from 'utils/Firestore'

// PRISMIC REACT
// @ts-ignore
import { RichText } from 'prismic-reactjs'

// CONTEXTO
import { appContext } from 'context/appContext'

// COMPONENTES
import ClipSkeleton from 'components/ClipSkeleton'
import SearchCard from 'components/SearchCard'

// ESTADO
interface IndexState {
	docs: Document[] | null
	popular: Document[] | null
	dictionary: Document | null
	notSort: boolean
}

// PROPIEDADES INICIALES
interface PageProps {
	posts: Document[]
}

// ESTADO INICIAL
const DefState: IndexState = {
	dictionary: null,
	docs: null,
	popular: null,
	notSort: true,
}

const Index: NextPage<PageProps> = ({ posts }) => {
	// CONTEXTO
	const { lang, setDocs, setDict } = useContext(appContext)

	// REFERENCIAS
	const stateRef: MutableRefObject<IndexState> = useRef(DefState)

	// ESTADO
	const [postsState, setPosts]: [IndexState, Dispatch<SetStateAction<IndexState>>] = useState(
		DefState
	)

	// GUARDAR DOCS EN LOCAL DB
	useEffect(() => {
		// GUARDAR POSTS
		saveDocs(posts)

		// CARGAR DESDE CACHE
		setDocs(posts)

		// GUARDAR REFERENCIAS
		stateRef.current.docs = posts

		// CARGAR DESDE INDEXED DB
		if (!posts || !window.navigator.onLine) {
			getPosts().then((iPost: IPostsDB[]) => {
				setPosts({ ...postsState, docs: iPost.map((post: IPostsDB) => post.post) })
			})
		}
	}, [])

	// FETCH DICCIONARIO
	useEffect(() => {
		fetchDictionary().then((dict: Document) => {
			// ORDENAR DICCIONARIO
			dict.data.body[0].items.sort((a: ISlice, b: ISlice) => a.content[0].text > b.content[0].text)

			// GUARDAR EN LOCAL
			setDict(dict)
			saveDict(dict)

			// GUARDAR EN REFERENCIA
			stateRef.current.dictionary = dict

			// ACTUALIZAR ESTADO
			setPosts({ ...postsState, dictionary: dict })
		})
	}, [])

	useEffect(() => {
		// OBTENER DOCUMENTOS DESTACADOS
		getSortPopular(posts).then((popular: Document[]) => {
			// REFERENCIA
			stateRef.current.popular = popular

			// ACTUALIZAR ESTADOS
			setPosts({ ...postsState, popular })
		})
	}, [])

	// CAMBIAR ENTRE DESTACADOS Y RECIENTES
	const changeDocs = useCallback(
		(ev: ChangeEvent<HTMLSelectElement>) => {
			// SELECCIONAR INPUT
			const select: HTMLSelectElement = ev.target as HTMLSelectElement
			const index: number = select.selectedIndex

			// CAMBIAR ESTADO
			setPosts({ ...postsState, notSort: index === 0 })
		},
		[postsState.docs]
	)

	return (
		<section className='page home'>
			<Head>
				<title>{lang.general.title}</title>
				<Meta
					title={lang.general.title}
					desc='Blog de tecnología escrito en TypeScript con NextJS, Firebase y continuos deploying con Vercel, el proyecto es OpenSource bajo una licencia GNU, contiene Linters y Prettier para el formato estándar.'
					banner=''
					url=''
					keys={['LUA', 'blog']}
				/>
			</Head>
			{postsState.docs && (
				<div className='homeContainer'>
					<div className='selectPost'>
						<select onChange={changeDocs} id='selectPost' aria-label='Order posts'>
							<option>{lang.index.postTitle}</option>
							<option>{lang.index.postTitle_2}</option>
						</select>
						<label htmlFor='selectPost' id='downIcon' className='lni lni-chevron-down selectIcon' />
					</div>

					{postsState.docs && (
						<div className='postsList'>
							{postsState.docs &&
								(postsState.notSort
									? postsState.docs
									: postsState.popular || postsState.docs
								).map((doc: Document, key: number) => <PostCard key={key} doc={doc} />)}
						</div>
					)}

					<div className='postsC-container'>
						<div className='postsRecent postClip'>
							<h2>{lang.index.postTitle}</h2>
							{postsState.docs.map((doc: Document, key: number) => {
								if (key < 3) return <SearchCard key={key} doc={doc} />
							})}
						</div>

						{postsState.popular ? (
							<div className='bestPosts postClip'>
								<h2>{lang.index.postTitle_2}</h2>
								{postsState.popular.map((doc: Document, key: number) => {
									if (key < 3) return <SearchCard key={key} doc={doc} />
								})}
							</div>
						) : (
							<ClipSkeleton />
						)}

						{postsState.dictionary ? (
							<div className='dicClip postClip'>
								<h2>{lang.index.postTitle_3}</h2>
								<ul>
									{postsState.dictionary.data.body[0].items.map((item: ISlice, key: number) => (
										<li key={key}>
											{postsState.dictionary && (
												<Link href={linkResolver(postsState.dictionary, item)}>
													<a>{item.content[0].text}</a>
												</Link>
											)}
										</li>
									))}
								</ul>
							</div>
						) : (
							<ClipSkeleton />
						)}
					</div>
				</div>
			)}
			<style jsx global>{`
				.homeContainer {
					display: flex;
					justify-content: space-between;
					position: relative;
					margin-top: 30px;
					width: 1100px;
				}

				.postClip > ul > li > a {
					font-family: 'OpenSans';
					font-size: 1.1em;
					color: var(--dark);
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
					padding: 10px 30px;
					box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.05);
					margin-bottom: 30px;
					overflow: hidden;
				}

				.postClip:last-child {
					padding: 10px 60px;
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
					font-family: 'Futura';
				}

				.postClip:last-child > ul {
					list-style: initial;
				}

				.postClip > ul > li {
					margin-bottom: 20px;
				}

				.postClip:last-child > ul > li {
					margin-bottom: 10px;
				}

				.postClip:last-child > ul > li:last-child {
					margin-bottom: 20px;
				}

				.postClip > ul > li > a {
					color: var(--postText);
					font-family: 'Futura';
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
				.postClip > a {
					display: block;
					width: 100% !important;
					box-shadow: none !important;
					margin-bottom: 20px;
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
