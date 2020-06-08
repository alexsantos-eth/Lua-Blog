// REACT
import { useEffect, SetStateAction, useState, Dispatch } from 'react'

// NEXT
import { NextPage, NextPageContext } from 'next'
import Link from 'next/link'
import Head from 'next/head'

// PRISMIC
import { Document } from 'prismic-javascript/d.ts/documents'
import { usePrismicData } from 'utils/LocalDB'
import PrismicClient from 'prismic-configuration'

// ANIMACIONES
import { motion, Variants } from 'framer-motion'

// COMPONENTES
// @ts-ignore
import { RichText } from 'prismic-reactjs'
import Meta from 'components/Meta'

// HERRAMIENTAS
import { linkResolver } from 'Tools'

interface PostState {
	post: Document | undefined
}

// ANIMACIONES
const PostPageVariant: Variants = {
	init: { scale: 0.8 },
	in: { scale: 1, transition: { staggerChildren: 0.3 } },
	out: { x: 100, opacity: 0, transition: { staggerChildren: 0.3 } },
}

// ESTADO INICIAL
const DefState: PostState = {
	post: undefined,
}

const Post: NextPage = ({ post }: any) => {
	// ESTADO DEL POST
	const [state, setState]: [PostState, Dispatch<SetStateAction<PostState>>] = useState(DefState)

	// HACER PETICIONES Y OFFLINE
	useEffect(() => {
		// OBTENER DE QUERY Y OFFLINE
		usePrismicData(post ? post.uid : true).then((gPost: Document | undefined) => {
			if (!post) setState({ post: gPost })
		})
	}, [])

	// POST ACTUAL
	const sPost: Document | undefined = post || state.post

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
						<img src={sPost.data.banner.url} alt='Post Banner' className='post-banner' />
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
					padding: 35px 0;
				}

				.post-page-content {
					position: relative;
					margin: 0 auto;
					width: 90%;
					padding: 40px;
					box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
					border-radius: 15px;
					background: var(--postContent);
					overflow: hidden;
				}

				.post-banner {
					position: relative;
					left: 50%;
					transform: translateX(-50%);
					width: 70%;
					margin-bottom: 50px;
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

				@media screen and (max-width: 1024px) {
					.post-banner {
						width: 90%;
						margin-bottom: 30px;
					}
				}
				@media screen and (max-width: 460px) {
					.post-banner {
						width: 100%;
					}
					.post-page-content {
						padding: 20px;
					}
				}
			`}</style>
			<style jsx global>{`
				.post-page-content > .post-page-main {
					font-weight: 300;
					font-size: 1em;
					line-height: 20px;
					margin-bottom: 30px;
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
