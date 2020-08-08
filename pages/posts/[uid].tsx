// REACT
import { useEffect, SetStateAction, useState, Dispatch, RefObject, useRef, useContext } from 'react'

// NEXT
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'

// PRISMIC
import { Document } from 'prismic-javascript/d.ts/documents'
import PrismicClient from 'prismic-configuration'

// ANIMACIONES
import { motion, Variants } from 'framer-motion'

// COMPONENTES
// @ts-ignore
import { RichText } from 'prismic-reactjs'
import Meta from 'components/Meta'

// HERRAMIENTAS
import { formateDate, saveLikes, getLikesAverage, calculateScrollDistance } from 'utils/Tools'
import { usePrismicData, findByUID } from 'utils/LocalDB'

// CONTEXTO
import { appContext } from 'context/appContext'
import { showToast } from 'utils/Fx'

// INTERFAZ DE ESTADO
interface PostState {
	likesAverage: string
	post: Document | undefined
	subtitles: NodeListOf<HTMLHeadingElement> | undefined
}

// PROPIEDADES INICIALES
interface PostProps {
	post: Document
}

// ANIMACIONES
const PostPageVariant: Variants = {
	init: { y: -100, opacity: 0 },
	in: { y: 0, opacity: 1, transition: { delay: 0.5 } },
}

// ESTADO INICIAL
const DefState: PostState = {
	likesAverage: '0',
	post: undefined,
	subtitles: undefined,
}

// ASSETS
const likeSrc: string = '/images/posts/like.png'
const likeSrcFilled: string = '/images/posts/like-filled.png'

const Post: NextPage<PostProps> = ({ post }) => {
	// CONTEXTO
	const { docs, lang } = useContext(appContext)

	// REFERENCIAS
	const progressScroll: RefObject<HTMLProgressElement> = useRef(null)

	// BUSCAR POR ID
	const uid: string = useRouter().asPath.substr(7)
	DefState.post = findByUID(uid, docs)

	// ESTADO DEL POST
	const [state, setState]: [PostState, Dispatch<SetStateAction<PostState>>] = useState(DefState)

	// HACER PETICIONES Y OFFLINE
	useEffect(() => {
		// LIKES
		const likeList: NodeListOf<HTMLImageElement> = document.querySelectorAll(
			'.post-page-likes > ul > li > img'
		) as NodeListOf<HTMLImageElement>

		// LIMPIAR/LLENAR LIKES
		const clearLikes = () => likeList.forEach((likeF: HTMLImageElement) => (likeF.src = likeSrc))
		const fillLikes = (likeN: number) =>
			likeList.forEach((likeS: HTMLImageElement, index: number) => {
				if (index <= likeN) likeS.src = likeSrcFilled
			})

		// EVITAR HOVER
		let likeHandler: boolean = false

		// LLENAR DESDE LOCAL
		fillLikes(parseInt(window.localStorage.getItem(`like-${uid}`) || '', 10))

		// RECORRER LIKES
		likeList.forEach((like: HTMLImageElement) => {
			// OBTENER NUMERO DE LIKE
			const likeN: number = parseInt(like.getAttribute('data-like') || '', 10)

			// HOVER
			like.addEventListener('mouseover', () => {
				if (!likeHandler) {
					clearLikes()
					fillLikes(likeN)
				}
			})

			// SALIDA
			like.addEventListener('mouseout', () => {
				if (!likeHandler) clearLikes()
			})

			// GUARDAR LIKE
			like.addEventListener('click', () => {
				clearLikes()
				fillLikes(likeN)
				window.localStorage.setItem(`like-${uid}`, likeN.toString())
				saveLikes(uid, likeN)
				likeHandler = true
			})
		})

		// SCROLL
		window.addEventListener('scroll', () => {
			if (progressScroll.current) progressScroll.current.value = window.scrollY
		})

		if (!post && !docs.length)
			usePrismicData(true).then((gPost: Document | undefined) => {
				// ACTUALIZAR DATOS
				setState({
					...state,
					post: gPost,
				})
			})

		// ACTUALIZAR PROGRESS BAR
		if (progressScroll.current) progressScroll.current.max = calculateScrollDistance()

		// OBTENER INDICES
		const subtitles: NodeListOf<HTMLHeadingElement> = document.querySelectorAll(
			'.post-page-main > h2'
		) as NodeListOf<HTMLHeadingElement>

		// ACTUALIZAR ESTADO
		setState({ ...state, subtitles })
	}, [uid])

	// OBTENER LIKES
	getLikesAverage(uid, [state.subtitles, state.post], (likesAverage: string) =>
		setState({ ...state, likesAverage })
	)

	// POST ACTUAL
	const sPost: Document | undefined = post || state.post

	// AVANZAR A SECCIONES
	const goTo = (h: HTMLHeadingElement) => {
		// OBTENER DIMENSIONES
		const scroll: number = h.getBoundingClientRect().top
		const navHeight: number = parseInt(
			getComputedStyle(document.body).getPropertyValue('--navHeight').replace('px', ''),
			10
		)

		// AVANZAR
		window.scrollTo({
			top: window.scrollY + (scroll - navHeight),
			behavior: 'smooth',
		})
	}

	// FUNCIONES PARA SCROLL
	const linkResolvers = state.subtitles
		? Array.from(state.subtitles).map((subtitle: HTMLHeadingElement) => () => goTo(subtitle))
		: []

	const copyPath = (e: any) => {
		// EVITAR LINK
		e.preventDefault()

		// COPIAR
		navigator.clipboard.writeText(window.location.href).then(() =>
			showToast({
				text: lang.postPage.toast,
			})
		)
	}

	// META TAGS
	const title: string = sPost
		? RichText.asText(sPost.data.title)
		: 'Error al cargar el articulo (404)'
	const description: string = sPost
		? sPost.data.description
		: 'Lo sentimos no hemos podido encontrar el post, intenta verificar la dirección o intenta nuevamente.'

	// COMPONENTE
	return (
		<section className='page post'>
			<progress ref={progressScroll} className='post-progress' value='0' />
			<Head>
				<title>{`${lang.navbar.title} - ${title}`}</title>
				<Meta
					title={`${lang.navbar} - ${title}`}
					desc={sPost ? RichText.asText(description) : description}
					banner={sPost?.data.banner.url || ''}
					url={`posts/${sPost?.uid || ''}`}
					keys={['miguel ángel gálvez', 'blog'].concat(sPost?.tags || [''])}
				/>
				<script async src='https://platform.twitter.com/widgets.js' />
			</Head>
			{sPost && (
				<motion.div initial='init' animate='in' exit='in' variants={PostPageVariant}>
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
								<div className='post-page-main'>{RichText.render(sPost.data.content)}</div>

								<h2 className='post-page-likes-title'>
									{lang.postPage.likes}
									<span>{state.likesAverage}</span> <img src={likeSrcFilled} alt='Like' />
								</h2>
								<div className='post-page-likes'>
									<ul>
										{'likes'.split('').map((_char: string, key: number) => (
											<li key={key} data-like={key}>
												<img src={likeSrc} alt='Like' data-like={key} />
											</li>
										))}
									</ul>
									<ul>
										<li>
											<a
												href='https://twitter.com/miguelgalvezag?lang=es'
												title='@miguelagalvez'
												target='_blank'>
												<i className='lni lni-twitter' />
											</a>
										</li>
										<li>
											<a href='#t' title='Title' target='_blank'>
												<i className='lni lni-linkedin' />
											</a>
										</li>
										<li>
											<a
												href='https://www.facebook.com/miguel.galvez.501151'
												title='Facebook/Miguel Ángel Gálvez'
												target='_blank'>
												<i className='lni lni-facebook' />
											</a>
										</li>
										<li>
											<a onClick={copyPath} href='#copy' title='Copiar URL' target='_blank'>
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
								<div className='post-page-index-twitter'>
									<a
										className='twitter-timeline'
										href='https://twitter.com/Miguelgalvezag?ref_src=twsrc%5Etfw'>
										<i className='lni lni-twitter' /> @Miguelgalvezag
									</a>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			)}
			<style jsx>{`
				.post-progress {
					appearance: none;
					border: none;
					outline: none;
					background: transparent;
					height: 3px;
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					z-index: 10;
				}

				.post-page-content {
					position: relative;
					max-width: 1300px;
					width: calc(100% - 140px);
					margin: 0 auto;
				}

				.post-page-content > * {
					color: var(--dark);
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
					background: var(--dark);
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
				}

				.post-page-content-text > h1 {
					font-weight: 600;
					font-size: 2em;
				}

				.post-page-head {
					margin: 10px 0;
				}

				.post-page-head > span {
					color: var(--darkBlue);
					font-weight: 500;
				}

				.post-page-container > .post-page-index {
					height: 100%;
					margin-left: 80px;
					display: flex;
					flex-direction: column;
					align-items: flex-end;
				}

				.post-page-index-list {
					top: 50px;
					border: 2px solid var(--lightBlue);
					box-shadow: 5px 5px 15px #416e8f40;
					border-radius: 10px;
					width: 300px;
					padding: 20px 50px;
					background: var(--white);
					margin-bottom: 30px;
				}

				.post-page-index-list > h2 {
					font-family: 'OpenSans';
					font-weight: 600;
					margin: 0;
					width: 100%;
					text-align: center;
					margin-bottom: 20px;
				}

				.post-page-index-list > ul {
					margin-left: 15px;
				}

				.post-page-index-list > ul > li::before {
					content: '• ';
					color: var(--lightBlue);
					font-size: 1.3em;
				}

				.post-page-index-list > ul > li > a {
					line-height: 40px;
					color: var(--lightBlue);
					font-size: 1.1em;
					font-family: 'OpenSans';
				}

				.post-page-footer {
					margin-top: 30px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					width: 470px;
				}

				.post-page-footer > img {
					border-radius: 100%;
				}

				.post-page-footer > span {
					color: var(--lightBlue);
					font-family: 'OpenSans';
					font-weight: 600;
					font-style: italic;
					font-size: 1em;
					width: 350px;
					display: block;
				}

				.post-page-likes-title{
					margin-top: 30px;
					margin-bottom: 10px;
					display: flex;
					align-items: center;
					font-family: 'OpenSans'
					color: var(--darkBlue);
					font-size: 1.1em;
				}

				.post-page-likes-title > span{
					font-weight: 600;
					margin:0 10px;
				}

				.post-page-likes-title > img{
					filter: invert(14%) sepia(95%) saturate(520%) hue-rotate(180deg) brightness(96%)
						contrast(87%);
					width: 20px;
					cursor: pointer;
				}

				.post-page-likes {
					width: 100%;
					margin-bottom: 50px;
					padding-bottom: 10px;
					border-bottom: 2px solid var(--darkBlue);
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

				.post-page-likes > ul:first-child > li {
					width: 50px;
				}

				.post-page-likes > ul:last-child > li {
					margin-left: 10px;
				}

				.post-page-likes > ul:last-child > li:nth-child(3){
					margin-left: 5px;
					margin-right: -5px;
				}

				.post-page-likes > ul:last-child > li > a {
					color: var(--darkBlue);
				}

				.post-page-likes > ul:last-child > li > a > i {
					font-size: 1.8em;
				}

				.post-page-likes > ul:first-child > li > img {
					filter: invert(14%) sepia(95%) saturate(520%) hue-rotate(180deg) brightness(96%)
						contrast(87%);
					width: 100%;
					cursor: pointer;
					padding: 0 10px;
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

					.post-page-likes > ul:first-child > li > img {
						padding: 0 5px;
					}

					.post-page-likes > ul:last-child > li > a > i {
						font-size: 1.5em;
					}
				}

				@media screen and (max-width: 460px) {
					.post-page-back::before {
						right: -14px;
					}
				}

				@media screen and (max-width: 360px) {
					.post-page-content {
						width: calc(100% - 60px);
					}
				}
			`}</style>
			<style jsx global>{`
				.post-page-desc > * {
					font-family: 'OpenSans';
					color: var(--dark);
					font-size: 1.1em;
				}

				.post-page-main > * {
					font-family: 'OpenSans';
					color: var(--dark);
					font-size: 1.1em;
				}

				.post-page-main > h2 {
					margin: 15px 0;
					font-size: 1.7em;
					font-weight: 600;
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
