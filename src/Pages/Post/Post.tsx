// REACT
import React, {
	SetStateAction,
	useState,
	Dispatch,
	useContext,
	MouseEvent,
	useCallback,
} from 'react'

// NEXT
import { Link, useLocation } from 'react-router-dom'

// HERRAMIENTAS
import { formatDate, findByUID, getRelated } from 'Utils/PostTools'
import { useLikesAverage, useLikes } from 'Utils/LikesHook'

// CONTEXTO
import MainContext from 'Context/MainContext'

// COMPONENTES
import ScrollObserver from 'Components/ScrollObserver/ScrollObserver'
import ClipSkeleton from 'Components/ClipSkeleton/ClipSkeleton'
import SearchCard from 'Components/SearchCard/SearchCard'
import Meta from 'Components/Meta/Meta'
import { ChevronLeft, Twitter, Linkedin, Facebook, Link as LinkIcon, Star } from 'react-feather'
import Styles from './Post.module.scss'

// INTERFAZ DE ESTADO
interface PostState {
	likesAverage: string
}

// ESTADO INICIAL
const DefState: PostState = {
	likesAverage: '0',
}

const Post: React.FC = () => {
	// CONTEXTO
	const { posts, lang } = useContext(MainContext)

	// POST ACTUAL
	const uid: string = useLocation().pathname.substr(7)
	const sPost: IPostItem | undefined = findByUID(uid, posts)

	// ESTADO DEL POST
	const [state, setState]: [PostState, Dispatch<SetStateAction<PostState>>] = useState(DefState)
	const relatedPosts: IPostItem[] = getRelated(sPost, posts, uid)

	// OBTENER LIKES
	useLikesAverage(uid, useCallback((likesAverage: string) => setState({ likesAverage }), []))

	// PLUGIN DE LIKES
	useLikes(uid)

	// COMPARTIR
	const shareEvent = (ev: MouseEvent<HTMLAnchorElement>) => {
		ev.preventDefault()
		import('Utils/Tools').then(({ shareLink }) =>
			shareLink(
				ev,
				sPost ? sPost.title : '',
				`Mira este artículo sobre ${sPost ? sPost.tags.join(', ') : ['']}`
			)
		)
	}

	// COPIAR URL
	const copyPaths = (e: any) =>
		import('Utils/Tools').then(({ copyPath }) => copyPath(e, lang.postPage.toast))

	// META TAGS
	const title: string = sPost ? sPost.title : 'Error al cargar el artículo (404)'
	const description: string = sPost
		? sPost.description
		: 'Lo sentimos no hemos podido encontrar el post, intenta verificar la dirección o intenta nuevamente.'

	// COMPONENT
	return (
		<section>
			<Meta
				title={title}
				desc={description}
				banner={sPost ? sPost.banner.url : ''}
				url={`posts/${sPost ? sPost.url : ''}`}
				keys={['LUA', 'blog'].concat(sPost ? sPost.tags : [''])}
			/>
			<ScrollObserver />
			{sPost && (
				<div>
					<div className={Styles.content}>
						<Link to='/' title='Regresar' className={Styles.back}>
							<ChevronLeft />
						</Link>

						<div className={Styles.header}>
							<img src={sPost.banner.url} alt='Post Banner' className={Styles.banner} />
						</div>

						<div className={Styles.container}>
							<div className={Styles.contentText}>
								<h1>{title}</h1>
								<div className={Styles.head}>
									<span>
										{sPost.author} | {formatDate(new Date(sPost.sys.publishedAt), lang)}
									</span>
								</div>

								<div className={Styles.desc}>{sPost.description}</div>
								<div className={Styles.main}>{sPost.contentMd}</div>

								<h2 className={Styles.likesTitle}>
									{lang.postPage.likes}
									<span>{state.likesAverage}</span> <Star />
								</h2>
								<div className={Styles.likes}>
									<ul>
										{'likes'.split('').map((_char: string, key: number) => (
											<li key={key} data-like={key}>
												<Star data-like={key} />
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
												<Twitter />
											</a>
										</li>
										<li>
											<a
												href='https://www.linkedin.com/company/weareluastudio/'
												title='Linkedin - LUA Development Studio'
												target='_blank'
												rel='noreferrer noopener'>
												<Linkedin />
											</a>
										</li>
										<li>
											<a
												onClick={shareEvent}
												href='https://www.facebook.com/weareluastudio'
												title='Facebook - LUA Development Studio'
												target='_blank'
												rel='noreferrer noopener'>
												<Facebook />
											</a>
										</li>
										<li>
											<a onClick={copyPaths} href='#copy' title='Copiar URL'>
												<LinkIcon />
											</a>
										</li>
									</ul>
								</div>
							</div>
							<div className={Styles.index}>
								<div className={Styles.indexList}>
									<h2>{lang.postPage.subtitle}</h2>
								</div>
								{relatedPosts ? (
									relatedPosts.length > 0 && (
										<div className={Styles.related}>
											<h2>{lang.postPage.related}</h2>
											{relatedPosts.map((relatedPost: IPostItem, key: number) => (
												<SearchCard key={key} post={relatedPost} />
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
		</section>
	)
}

export default Post
