// NEXT, REACT Y PRISMIC
import { Document } from 'prismic-javascript/d.ts/documents'
import { NextPage, NextPageContext } from 'next'
import { useEffect, useContext } from 'react'

// LOCAL DB
import { setDocs } from 'utils/LocalDB'

// COMPONENTES
import { motion, Variants } from 'framer-motion'
import Category from 'components/Category'
import Header from 'components/Header'
import Meta from 'components/Meta'
import fetchPosts from 'Prismic'
import Head from 'next/head'

// CONTEXTO
import { appContext } from 'Ctx'

// VARIANTES
const genVariant = (mode: boolean) => {
	const v: Variants = {
		init: { x: 100 * (mode ? 1 : -1), opacity: 0 },
		in: { x: 0, opacity: 1, transitionDuration: '0.4s' },
		out: { x: 100 * (mode ? 1 : -1), opacity: 0, transitionDuration: '0.4s' },
	}

	return v
}

const Index: NextPage = ({ posts }: any) => {
	// CONTEXTO
	const { lang } = useContext(appContext)

	// META TAGS
	const title: string = lang.Index.title
	const desc: string = lang.Index.description

	// GUARDAR DOCS EN LOCAL DB
	useEffect(() => {
		setDocs(posts)
	}, [])

	return (
		<section className='page home'>
			<Head>
				<title>{title}</title>
				<Meta title={title} desc={desc} banner='' url='' keys={['wearelua', 'blog', 'react']} />
			</Head>
			{posts && (
				<motion.div
					initial='init'
					animate='in'
					exit='out'
					variants={{
						out: { transition: { staggerChildren: 0.3 } },
						in: { transition: { staggerChildren: 0.3 } },
					}}>
					<motion.div variants={genVariant(true)}>
						<Header doc={posts[0]} />
					</motion.div>
					<motion.div variants={genVariant(false)}>
						<Category
							top
							reverse
							desc='Encuentra artículos sobre librerías, frameworks, ES6, novedades y mas'
							img='/images/svgs/javascript.svg'
							name='JavaScript'
							icon='javascript'
							doc={posts[1]}
						/>
						<Category
							desc='Encuentra artículos sobre librerías, frameworks, ES6, novedades y mas'
							img='/images/svgs/javascript.svg'
							name='JavaScript'
							icon='javascript'
							doc={posts[1]}
						/>
					</motion.div>
				</motion.div>
			)}
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
	const initProps: any = { posts }

	// RETORNAR PROPS
	return initProps
}

export default Index
