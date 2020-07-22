// REACT
import {
	useEffect,
	SetStateAction,
	useState,
	Dispatch,
	useRef,
	useContext,
	MutableRefObject,
	MouseEvent,
} from 'react'

// NEXT
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

// PRISMIC
import { Document } from 'prismic-javascript/types/documents'
import PrismicClient from 'prismic-configuration'

// COMPONENTES
// @ts-ignore
import { RichText } from 'prismic-reactjs'
import Meta from 'components/Meta'

// HERRAMIENTAS
import { formateDate, copyPath, goTo, shareLink } from 'utils/ToolsAux'
import { findByUID, usePrismicData, saveDocs } from 'utils/LocalDB'
import { useLikesAverage, useLikes } from 'utils/LikesHook'
import fetchPosts from 'utils/Prismic'

// CONTEXTO
import { appContext } from 'context/appContext'

// COMPONENTES
import ScrollObserver from 'components/ScrollObserver'
import HTMLSerializer from 'components/HTMLSerializer'
import ClipSkeleton from 'components/ClipSkeleton'
import SearchCard from 'components/SearchCard'

// INTERFAZ DE ESTADO
interface PostState {
	likesAverage: string
	post?: Document
	subtitles: NodeListOf<HTMLHeadingElement> | null
	subSubtitles: NodeListOf<HTMLHeadingElement> | null
	relatedPost: Document[] | null
}

// PROPIEDADES INICIALES
interface PostProps {
	post: Document
}

// ESTADO INICIAL
const DefState: PostState = {
	subSubtitles: null,
	subtitles: null,
	likesAverage: '0',
	relatedPost: null,
}

const Post: NextPage<PostProps> = ({ post }) => {
	// CONTEXTO
	const { docs, lang, setDocs, darkMode } = useContext(appContext)

	// REFERENCIAS
	const stateRef: MutableRefObject<PostState> = useRef(DefState)

	// BUSCAR POR ID
	const path: string = useRouter().asPath
	const uid: string = path.substr(7)
	const cPost = docs ? findByUID(uid, docs) : post
	DefState.post = cPost
	stateRef.current.post = cPost

	// ESTADO DEL POST
	const [state, setState]: [PostState, Dispatch<SetStateAction<PostState>>] = useState(DefState)

	useEffect(() => {
		// ENVIAR DOCUMENTOS
		setTimeout(() => {
			if (post || docs?.length === 0)
				fetchPosts().then((fDocs: Document[]) => {
					// GUARDAR EN LOCAL
					setDocs(fDocs)
					saveDocs(fDocs)
				})
		}, 3000)
	}, [])

	// PLUGIN DE LIKES
	useLikes(uid)

	useEffect(() => {
		// OBTENER INDICES
		const subtitles: NodeListOf<HTMLHeadingElement> = document.querySelectorAll(
			'.post-page-main > h2'
		) as NodeListOf<HTMLHeadingElement>

		const subSubtitles: NodeListOf<HTMLHeadingElement> = document.querySelectorAll(
			'.post-page-main > h3'
		) as NodeListOf<HTMLHeadingElement>

		// GUARDAR REFERENCIA
		stateRef.current.subtitles = subtitles
		stateRef.current.subSubtitles = subSubtitles

		// ACTUALIZAR ESTADO
		setState({ ...stateRef.current })
	}, [uid, state.post])

	useEffect(() => {
		// LEER DATOS LOCALES
		usePrismicData(uid).then((pDoc: Document | undefined) => {
			// ACTUALIZAR A CUALQUIER DOCUMENTO QUE HAYA DISPONIBLE
			// CARGAR DESDE DOCUMENTOS (CONTEXT API) SINO CON INDEXED DB SINO CON INITIAL PROPS
			const cachePost: Document | undefined = docs ? findByUID(uid, docs) : pDoc ? pDoc : sPost

			// ACTUALIZAR ESTADO
			stateRef.current.post = cachePost
			setState({ ...stateRef.current })
		})
	}, [uid])

	useEffect(() => {
		if (docs?.length) {
			// OBTENER TAGS
			const nPost = findByUID(uid, docs)
			const tags: string[] | undefined = nPost?.tags
			const relatedPost: Document[] = []

			// BUSCAR TAGS
			if (tags)
				docs?.forEach((doc: Document) => {
					if (doc.tags.some((tag) => tags.includes(tag)) && doc.uid !== uid) relatedPost.push(doc)
				})

			// ASIGNAR REFERENCIA
			stateRef.current.post = nPost
			stateRef.current.relatedPost = relatedPost

			// ACTUALIZAR ESTADO
			setState({ ...stateRef.current })
		}
	}, [docs, uid])

	// tslint:disable-next-line: only-arrow-functions
	function uidSerializer<T>(
		type: any,
		element: any,
		content: string | null,
		children: T,
		key: number
	) {
		return HTMLSerializer(type, element, content, children, key, darkMode)
	}

	// SCROLL PARA SUB TÍTULOS
	useEffect(() => {
		if (state.subSubtitles?.length && state.subtitles?.length) {
			// OBTENER HASH
			const hashQuery: string = path.substr(path.indexOf('#') + 1)
			const hash: string | null = new URLSearchParams('sub=' + hashQuery).get('sub')

			// SUBTITULO
			let subElement: HTMLHeadingElement | null = null

			// BUSCAR SUBTITULO
			state.subtitles?.forEach((subTitle: HTMLHeadingElement) => {
				if (hash && subTitle.textContent?.includes(hash)) subElement = subTitle
			})

			state.subSubtitles?.forEach((subSubtitle: HTMLHeadingElement) => {
				if (hash && subSubtitle.textContent?.includes(hash)) subElement = subSubtitle
			})

			// HACER SCROLL
			if (subElement) goTo(subElement)
		}
	}, [uid, state.subSubtitles, state.subtitles])

	// OBTENER LIKES
	useLikesAverage(uid, [uid], (likesAverage: string) => {
		stateRef.current.likesAverage = likesAverage
		setState({ ...stateRef.current })
	})

	// FUNCIONES PARA SCROLL
	const linkResolvers = state.subtitles
		? Array.from(state.subtitles).map((subtitle: HTMLHeadingElement) => () => goTo(subtitle))
		: []
	const subLinkResolvers = state.subSubtitles
		? Array.from(state.subSubtitles).map((subSubtitle: HTMLHeadingElement) => () =>
				goTo(subSubtitle)
		  )
		: []

	// POST ACTUAL
	const sPost: Document | undefined = post || state.post

	// COMPARTIR
	const shareEvent = (ev: MouseEvent<HTMLAnchorElement>) =>
		shareLink(
			ev,
			RichText.asText(sPost.data.title),
			`Mira este artículo sobre ${sPost.tags.join(', ')}`
		)

	// COPIAR URL
	const copyPaths = (e: any) => copyPath(e, lang.postPage.toast)

	// META TAGS
	const title: string = sPost
		? RichText.asText(sPost.data.title)
		: 'Error al cargar el artículo (404)'
	const description: string = sPost
		? sPost.data.description
		: 'Lo sentimos no hemos podido encontrar el post, intenta verificar la dirección o intenta nuevamente.'

	// COMPONENT
	return (
		<section className='page post'>
			<Head>
				<title>{title}</title>
				<Meta
					title={title}
					desc={sPost ? RichText.asText(description) : description}
					banner={sPost?.data.banner.url || ''}
					url={`posts/${sPost?.uid || ''}`}
					keys={['LUA', 'blog'].concat(sPost?.tags || [''])}
				/>
			</Head>
			<ScrollObserver />
			{sPost && (
				<div>
					<div className='post-page-content'>
						<Link as='/' href='/' passHref>
							<a title='Regresar' className='post-page-back'>
								<i className='lni lni-chevron-left' />
							</a>
						</Link>

						<div className='post-page-header'>
							<img src={sPost.data.banner.url} alt='Post Banner' className='post-banner' />
						</div>

						<div className='post-page-container'>
							<div className='post-page-content-text'>
								<h1>{title}</h1>
								<div className='post-page-head'>
									<span>{formateDate(sPost.first_publication_date, sPost.data.author)}</span>
								</div>

								<div className='post-page-desc'>{RichText.render(description)}</div>
								<div className='post-page-main'>
									<RichText render={sPost.data.content} htmlSerializer={uidSerializer} />
								</div>

								<h2 className='post-page-likes-title'>
									{lang.postPage.likes}
									<span>{state.likesAverage}</span> <i className='lni lni-star-filled' />
								</h2>
								<div className='post-page-likes'>
									<ul>
										{'likes'.split('').map((_char: string, key: number) => (
											<li key={key} data-like={key}>
												<i className='lni lni-star' data-like={key} />
											</li>
										))}
									</ul>
									<ul>
										<li>
											<a
												href='https://twitter.com/weareluastudio?lang=es'
												title='@weareluastudio'
												target='_blank'
												rel='noreferrer noopener'>
												<i className='lni lni-twitter' />
											</a>
										</li>
										<li>
											<a
												href='https://www.linkedin.com/company/weareluastudio/'
												title='Linkedin - LUA Development Studio'
												target='_blank'
												rel='noreferrer noopener'>
												<i className='lni lni-linkedin' />
											</a>
										</li>
										<li>
											<a
												onClick={shareEvent}
												href='https://www.facebook.com/weareluastudio'
												title='Facebook - LUA Development Studio'
												target='_blank'
												rel='noreferrer noopener'>
												<i className='lni lni-facebook' />
											</a>
										</li>
										<li>
											<a onClick={copyPaths} href='#copy' title='Copiar URL' target='_blank'>
												<i className='lni lni-link' />
											</a>
										</li>
									</ul>
								</div>
							</div>
							<div className='post-page-index'>
								<div className='post-page-index-list'>
									<h2>{lang.postPage.subtitle}</h2>
									<ul>
										{state.subtitles &&
											Array.from(state.subtitles).map((subtitle: HTMLHeadingElement, i: number) => (
												<li key={`sub-${i}`}>
													<a
														href={`#${subtitle.textContent}`}
														title={subtitle.textContent || ''}
														onClick={linkResolvers[i]}>
														{subtitle.textContent}
													</a>
													<ul>
														{state.subSubtitles &&
															Array.from(state.subSubtitles).map(
																(subSubtitle: HTMLHeadingElement, ind: number) =>
																	subSubtitle.textContent?.startsWith(`${(i + 1).toString()}.`) && (
																		<li key={`subSub-${ind}`}>
																			<a
																				href={`#${subSubtitle.textContent}`}
																				title={subSubtitle.textContent || ''}
																				onClick={subLinkResolvers[ind]}>
																				{subSubtitle.textContent}
																			</a>
																		</li>
																	)
															)}
													</ul>
												</li>
											))}
									</ul>
								</div>
								{state.relatedPost ? (
									state.relatedPost.length > 0 && (
										<div className='post-page-related'>
											<h2>{lang.postPage.related}</h2>
											{state.relatedPost.map((relatedPost: Document, key: number) => (
												<SearchCard key={key} doc={relatedPost} />
											))}
										</div>
									)
								) : (
									<ClipSkeleton />
								)}
							</div>
						</div>
					</div>
				</div>
			)}
			<style jsx>{`
				.post-page-content {
					position: relative;
					max-width: 1300px;
					width: calc(100% - 140px);
					margin: 0 auto;
				}

				.post-page-content > * {
					color: var(--postText);
					font-family: 'OpenSans';
				}

				.post-page-back {
					position: relative;
					margin-top: 10px;
					font-size: 1.5em;
					display: inline-flex;
					align-items: center;
				}

				.post-page-back::before {
					content: '';
					position: absolute;
					right: -10px;
					width: 26px;
					height: 2px;
					background: var(--postText);
				}

				.post-page-header {
					width: 100%;
					height: 350px;
					margin: 20px 0;
				}

				.post-page-header > img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					border-radius: 10px;
				}

				.post-page-container {
					display: flex;
					justify-content: space-between;
				}

				.post-page-content-text {
					width: 100%;
					margin-bottom: 30px;
				}

				.post-page-content-text > h1 {
					font-family: 'Manrope';
					font-weight: 500;
					font-size: 2em;
				}

				.post-page-head {
					margin: 10px 0;
				}

				.post-page-head > span {
					color: var(--postText);
					font-weight: 500;
					font-family: 'Manrope';
					opacity: 0.6;
				}

				.post-page-container > .post-page-index {
					height: 100%;
					margin-left: 80px;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
				}

				.post-page-index > div {
					position: relative;
					color: var(--postText);
					width: 300px;
					border-radius: 10px;
					padding: 10px 60px;
					box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.05);
					margin-bottom: 30px;
					overflow: hidden;
				}

				.post-page-index > .post-page-related {
					padding: 10px 30px;
				}

				.post-page-index > div::before {
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

				.post-page-index > div::after {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: var(--shadow);
					z-index: -1;
				}

				.post-page-index > div > h2 {
					text-align: center;
					font-weight: 500;
					margin-bottom: 35px;
					margin-top: 10px;
					font-size: 1.4em;
					font-family: 'Futura';
				}

				.post-page-index > div > ul {
					list-style: initial;
				}

				.post-page-index > div > ul > li {
					margin-bottom: 20px;
				}

				.post-page-index > div > ul > li > a {
					color: var(--postText);
					font-family: 'Futura';
				}

				.post-page-index > div > ul > li > ul {
					margin-left: 20px;
				}

				.post-page-index > div > ul > li > ul > li {
					line-height: 25px;
				}

				.post-page-index > div > ul > li > ul > li > a {
					color: var(--postText);
					opacity: 0.8;
					font-family: 'Futura';
				}

				.post-page-likes-title {
					margin-top: 30px;
					margin-bottom: 10px;
					display: flex;
					align-items: center;
					font-family: 'Manrope';
					color: var(--postText);
					font-size: 1.1em;
					opacity: 0.7;
					font-weight: 400;
				}

				.post-page-likes-title > span {
					font-weight: 500;
					margin: 0 10px;
				}

				.post-page-likes-title > i {
					cursor: pointer;
				}

				.post-page-likes {
					width: 100%;
					margin-bottom: 30px;
					padding-bottom: 10px;
					border-bottom: 2px solid var(--postText);
					display: flex;
					align-items: center;
					justify-content: space-between;
				}

				.post-page-likes > ul:first-child {
					display: flex;
					margin-left: -5px;
				}

				.post-page-likes > ul:last-child {
					display: flex;
				}

				.post-page-likes > ul:last-child > li {
					margin-left: 10px;
				}

				.post-page-likes > ul:last-child > li:nth-child(3) {
					margin-left: 5px;
					margin-right: -5px;
				}

				.post-page-likes > ul:last-child > li > a {
					color: var(--postText);
				}

				.post-page-likes > ul:last-child > li > a > i {
					font-size: 1.8em;
				}

				@media screen and (max-width: 1000px) {
					.post-page-container > .post-page-index {
						margin-left: 30px;
					}
				}

				@media screen and (max-width: 950px) {
					.post-page-container > .post-page-index {
						display: none;
					}

					.post-page-content {
						width: calc(100% - 100px);
					}
				}

				@media screen and (max-width: 760px) {
					.post-page-footer > span {
						width: 330px;
					}

					.post-page-likes > ul:first-child > li {
						width: 45px;
					}

					.post-page-back::before {
						right: -12px;
					}
				}

				@media screen and (max-width: 700px) {
					.post-page-header {
						height: 300px;
					}
				}

				@media screen and (max-width: 600px) {
					.post-page-header {
						height: 200px;
					}
				}

				@media screen and (max-width: 500px) {
					.post-page-footer > img {
						width: 70px;
					}

					.post-page-header {
						height: 150px;
					}

					.post-page-footer {
						width: 100%;
						justify-content: flex-start;
					}

					.post-page-footer > span {
						font-size: 0.9em;
						width: 250px;
						margin-left: 20px;
					}

					.post-page-likes > ul:first-child > li {
						width: 30px;
					}

					.post-page-likes > ul:last-child > li > a > i {
						font-size: 1.5em;
					}
				}

				@media screen and (max-width: 460px) {
					.post-page-back::before {
						right: -14px;
					}
					.post-page-content {
						width: calc(100% - 60px);
					}
				}
			`}</style>
			<style jsx global>{`
				.post-page-desc > * {
					font-family: 'OpenSans';
					color: var(--postText);
					font-weight: 400;
					font-size: 1.2em;
					line-height: 20px;
					opacity: 0.7;
				}

				.post-page-main > * {
					font-family: 'OpenSans';
					color: var(--postText);
					font-size: 1.1em;
					opacity: 0.7;
					line-height: 20px;
				}

				.post-page-main h2 {
					margin: 15px 0;
					font-size: 1.7em;
					opacity: 0.9;
					font-weight: 400;
				}

				.post-page-main h3 {
					margin: 15px 0;
					font-size: 1.4em;
					opacity: 0.9;
					font-weight: 400;
				}

				.post-page-main a {
					color: var(--deepOrange);
					opacity: 1;
				}

				.post-page-main strong,
				.post-page-main strong a {
					font-weight: bold;
					opacity: 1;
				}

				.post-page-main ul,
				.post-page-main ol {
					margin: 20px 30px;
				}

				.post-page-main ul {
					list-style: disc;
				}

				.post-page-main ol {
					list-style: decimal;
				}

				.post-page-main div {
					opacity: 1;
				}

				.post-page-main iframe {
					width: 100%;
					opacity: 1;
					border: none;
					outline: none;
					margin: 25px 0;
					margin-bottom: 15px;
				}

				.post-page-main iframe + iframe,
				.post-page-main iframe + iframe + iframe,
				.post-page-main iframe + iframe + iframe + iframe,
				.post-page-main iframe + iframe + iframe + iframe + iframe {
					margin-top: 0;
				}

				.post-page-likes > ul:first-child > li i {
					font-size: 1.6em;
					cursor: pointer;
					padding: 0 10px;
				}

				.post-page-index > .post-page-related > a {
					width: 100%;
					box-shadow: none;
					margin-bottom: 20px;
				}

				@media screen and (max-width: 500px) {
					.post-page-likes > ul:first-child > li > i {
						padding: 0 5px;
					}
				}
			`}</style>
		</section>
	)
}

Post.getInitialProps = async ({ res, req }: NextPageContext) => {
	// CONFIGURAR SPR VERCEL
	if (res) res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate')

	// OBTENER PARAMS
	const param: string = req?.url?.substr(req?.url?.lastIndexOf('/') + 1) || ''

	// OBTENER DOCUMENTO POR UID
	const post: Document = await PrismicClient.getByUID('post', param, {})

	// RETORNAR POST Y PREVIEW
	return { post }
}

export default Post
