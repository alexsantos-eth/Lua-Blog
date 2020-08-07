// REACT
import React, { useContext, MouseEvent, lazy, Suspense } from 'react'

// NEXT
import { Link, useLocation } from 'react-router-dom'

// HERRAMIENTAS
import { formatDate, findByUID, getRelated } from 'Utils/PostTools'

// CONTEXTO
import MainContext from 'Context/MainContext'

// COMPONENTES
import ScrollObserver from 'Components/ScrollObserver/ScrollObserver'
import Serializer, { GetTitles } from 'Components/Serializer/Serializer'
import ClipSkeleton from 'Components/ClipSkeleton/ClipSkeleton'
import { ChevronLeft, Twitter, Linkedin, Facebook, Link as LinkIcon, Star } from 'react-feather'
import Styles from './Post.module.scss'
import Meta from 'Components/Meta/Meta'

const SearchCard = lazy(() => import('Components/SearchCard/SearchCard'))

const Post: React.FC = () => {
	// CONTEXTO
	const { posts, lang } = useContext(MainContext)

	// POST ACTUAL
	const uid: string = useLocation().pathname.substr(7)
	const sPost: IPostItem | undefined = findByUID(uid, posts)

	// ESTADO DEL POST
	const relatedPosts: IPostItem[] = getRelated(sPost, posts, uid)
	const subtitles:string[] = GetTitles(sPost?.contentMd, false)
	const subsubtitles:string[] = GetTitles(sPost?.contentMd, true)

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
	const desc: string = sPost
		? sPost.description
		: 'Lo sentimos no hemos podido encontrar el post, intenta verificar la dirección o intenta nuevamente.'

	// COMPONENT
	return (
		<section>
			<Meta
				title={title}
				desc={desc}
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
								<div className={Styles.main}>{Serializer(sPost.contentMd)}</div>

								<h2 className={Styles.likesTitle}>
									{lang.postPage.likes}
									<span>{0}</span> <Star />
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
									<ul>
										{subtitles &&
											Array.from(subtitles).map((subtitle: string, i: number) => (
												<li key={`sub-${i}`}>
													<a
														href={`#${subtitle.replace(/ /g, '-').substr(4)}`}
														title={subtitle}>
														{subtitle}
													</a>
													<ul>
														{subsubtitles &&
															Array.from(subsubtitles).map(
																(subSubtitle: string, ind: number) =>
																	subSubtitle?.startsWith(`${(i + 1).toString()}.`) && (
																		<li key={`subSub-${ind}`}>
																			<a
																				href={`#${subtitle.replace(/ /g, '-').substr(5)}`}
																				title={subSubtitle}>
																				{subSubtitle}
																			</a>
																		</li>
																	)
															)}
													</ul>
												</li>
											))}
									</ul>
								</div>
								{relatedPosts ? (
									relatedPosts.length > 0 && (
										<div className={Styles.related}>
											<h2>{lang.postPage.related}</h2>
											{relatedPosts.map((relatedPost: IPostItem, key: number) => (
												<Suspense key={key} fallback={<ClipSkeleton/>}>
													<SearchCard post={relatedPost} />
												</Suspense>
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
