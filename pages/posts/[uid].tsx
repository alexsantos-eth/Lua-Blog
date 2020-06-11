// REACT
import { useEffect, SetStateAction, useState, Dispatch, RefObject, useRef } from 'react'

// NEXT
import { NextPage, NextPageContext } from 'next'
import Link from 'next/link'
import Head from 'next/head'

// PRISMIC
import { Document } from 'prismic-javascript/d.ts/documents'
import { usePrismicData } from 'utils/LocalDB'
import PrismicClient from 'prismic-configuration'

// ANIMACIONES
import { motion, Variants, useViewportScroll } from 'framer-motion'

// COMPONENTES
// @ts-ignore
import { RichText } from 'prismic-reactjs'
import Meta from 'components/Meta'

// HERRAMIENTAS
import { linkResolver } from 'Tools'

interface PostState {
	post: Document | undefined
	subtitles: NodeListOf<HTMLHeadingElement> | undefined
}

// ANIMACIONES
const PostPageVariant: Variants = {
	init: { y: -100 },
	in: { y: 0, transition: { staggerChildren: 0.3 } },
	out: { y: -100, transition: { staggerChildren: 0.3 } },
}

const Post: NextPage = ({ post }: any) => {
	// ESTADO INICIAL
	const DefState: PostState = {
		post,
		subtitles: undefined,
	}

	// SCROLL
	const { scrollY } = useViewportScroll()

	// REFERENCIAS
	const progressScroll: RefObject<HTMLProgressElement> = useRef(null)

	// ESTADO DEL POST
	const [state, setState]: [PostState, Dispatch<SetStateAction<PostState>>] = useState(DefState)

	// HACER PETICIONES Y OFFLINE
	useEffect(() => {
		// OBTENER DE QUERY Y OFFLINE
		if (!post)
			usePrismicData(post ? post.uid : true).then((gPost: Document | undefined) => {
				// ACTUALIZAR DATOS
				setState({
					...state,
					post: gPost,
				})
			})

		window.addEventListener('scroll', () => {
			if (progressScroll.current) progressScroll.current.value = window.scrollY
		})
	}, [])

	useEffect(() => {
		if (state.post) {
			// OBTENER INDICES
			const subtitles: NodeListOf<HTMLHeadingElement> = document.querySelectorAll(
				'.post-page-main > h2'
			) as NodeListOf<HTMLHeadingElement>

			// ACTUALIZAR ESTADO
			setState({ ...state, subtitles })
		}
	}, [state.post])

	// POST ACTUAL
	const sPost: Document | undefined = post || state.post

	// AVANZAR A SECCIONES
	const goTo = (h: HTMLHeadingElement) => {
		// OBTENER DIMENSIONES
		const scroll: number = h.getBoundingClientRect().top
		const margin: number = window.innerWidth <= 400 ? 80 : 95

		// AVANZAR
		window.scrollTo({
			top: window.scrollY + (scroll - (margin + 15)),
			behavior: 'smooth',
		})
	}

	// FUNCIONES PARA SCROLL
	const linkResolvers = state.subtitles
		? Array.from(state.subtitles).map((subtitle: HTMLHeadingElement) => () => goTo(subtitle))
		: []

	// META TAGS
	const title: string = sPost
		? RichText.asText(sPost.data.title)
		: 'Error al cargar el articulo (404)'
	const description: any = sPost
		? sPost.data.description
		: 'Lo sentimos no hemos podido encontrar el post, intenta verificar la dirección o intenta nuevamente.'

	// COMPONENTE
	return (
		<section className='page post'>
			<progress ref={progressScroll} className='post-progress' value='0' max={scrollY.get()} />
			<Head>
				<title>{title}</title>
				<Meta
					title={title}
					desc={sPost ? RichText.asText(description) : description}
					banner={sPost?.data.banner.url || ''}
					url={`posts/${sPost?.uid || ''}`}
					keys={['wearelua', 'blog'].concat(sPost?.tags || [''])}
				/>
			</Head>
			{sPost && (
				<motion.div initial='init' animate='in' exit='out' variants={PostPageVariant}>
					<div className='post-page-content'>
						<Link as='/' href='/' passHref>
							<a className='btn'>
								<i className='lni lni-arrow-left' />
								Regresar
							</a>
						</Link>

						<div className='post-page-header'>
							<img src={sPost.data.banner.url} alt='Post Banner' className='post-banner' />
							<div className='indexList'>
								<h2>Tabla de contenido</h2>
								<ul>
									{state.subtitles &&
										Array.from(state.subtitles).map((subtitle: HTMLHeadingElement, i: number) => (
											<li key={i}>
												<a
													href={`#${subtitle.textContent}`}
													title={subtitle.textContent || ''}
													onClick={linkResolvers[i]}>
													{subtitle.textContent}
												</a>
											</li>
										))}
								</ul>
							</div>
						</div>

						<h1>{title}</h1>
						<div className='post-page-head'>
							<RichText render={sPost.data.author} linkResolver={linkResolver} />
							<i />
							<span>{sPost.data.date}</span>
						</div>
						<div className='post-page-desc'>{RichText.render(description)}</div>
						<div className='post-page-main'>{RichText.render(sPost.data.content)}</div>
					</div>
				</motion.div>
			)}
			<style jsx>{`
				.post {
					padding: 50px;
				}

				.post-progress {
					appearance: none;
					height: 3px;
					width: 100%;
					background: transparent;
					position: fixed;
					top: var(--navHeight);
					left: 0;
					z-index: 5;
					border: none;
					padding: 0;
					outline: none;
				}

				.post-page-content {
					position: relative;
					margin: 0 auto;
					width: 100%;
					padding: 40px;
					box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
					border-radius: 15px;
					background: var(--postContent);
					overflow: hidden;
				}

				.post-page-header {
					position: relative;
					width: 100%;
					margin-bottom: 50px;
					display: flex;
					justify-content: space-between;
					align-items: center;
				}

				.indexList {
					width: 35%;
					position: relative;
					padding: 0 0 0 25px;
					margin-left: 25px;
					font-size: 18px;
				}

				.indexList::before {
					content: '';
					position: absolute;
					top: 50%;
					left: 0;
					width: 3px;
					height: 110%;
					transform: translateY(-50%);
					background: var(--pink);
				}

				.indexList > h2 {
					width: 100%;
					color: var(--postText);
					font-size: 1.5em;
					margin-bottom: 10px;
					font-family: 'Manrope';
				}

				.indexList > ul {
					margin-left: 25px;
				}

				.indexList > ul > li {
					position: relative;
				}

				.indexList > ul > li::before {
					content: '';
					width: 7px;
					height: 7px;
					position: absolute;
					left: -15px;
					top: 50%;
					transform: translateY(-50%);
					border-radius: 100%;
					background: var(--postText);
				}

				.indexList > ul > li > a {
					color: var(--postText);
					text-decoration: none;
					line-height: 25px;
					font-size: 1.1em;
					font-family: 'Futura';
				}

				.post-banner {
					position: relative;
					width: 65%;
					border-radius: 10px;
				}

				.post-page-content::before {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: rgba(255, 255, 255, 0.1);
					z-index: 1;
				}

				.post-page-content > * {
					position: relative;
					z-index: 2;
				}

				.post-page-content > a {
					padding: 0;
					width: 80px;
					height: auto;
					display: flex;
					text-decoration: none;
					align-items: center;
					justify-content: space-between;
					border-radius: 10px;
					background: transparent;
					box-shadow: none;
					color: var(--postText);
					margin-bottom: 30px;
				}

				.post-page-content > a > i {
					margin-right: 10px;
				}

				.post-page-content > h1 {
					font-size: 3em;
					font-weight: bold;
					color: var(--postText);
				}

				.post-page-content > .post-page-desc {
					font-size: 1.2em;
					line-height: 20px;
					opacity: 0.8;
					margin-bottom: 30px;
					font-family: 'OpenSans';
					color: var(--postText);
				}

				.post-page-content > p > strong {
					font-weight: 400;
				}

				.post-page-content > .post-page-head {
					margin: 10px 0;
					display: flex;
					width: 100%;
					font-family: 'Futura';
					font-size: 0.9em;
					align-items: center;
					justify-content: flex-start;
					color: var(--postText);
				}

				.post-page-content > .post-page-head > p > strong {
					font-weight: bold;
				}

				.post-page-content > .post-page-head > i {
					position: relative;
					margin: 0 10px;
					width: 25px;
					height: 2.5px;
					background: var(--postText);
					z-index: 2;
				}

				@media screen and (max-width: 850px) {
					.post-page-header {
						flex-direction: column;
					}

					.post-banner {
						width: 100%;
					}

					.indexList {
						margin-left: 0;
						margin-top: 54px;
						width: auto;
					}
				}

				@media screen and (max-width: 500px) {
					.post {
						padding: 20px;
					}
				}

				@media screen and (max-width: 460px) {
					.post-banner {
						width: 100%;
					}
					.post-page-content {
						padding: 20px;
					}

					.indexList {
						font-size: 14px;
					}
				}
			`}</style>
			<style jsx global>{`
				.post-page-content > .post-page-main {
					font-weight: 300;
					font-size: 1em;
					line-height: 20px;
					color: var(--postMain);
				}

				.post-page-content > .post-page-main > h2 {
					font-size: 1.3em;
					margin: 10px 0;
				}

				@media screen and (max-width: 760px) {
					.post-page-content > .post-page-main {
						font-size: 14px;
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
