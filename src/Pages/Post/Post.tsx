// REACT
import React, { useContext, MouseEvent, Dispatch, SetStateAction, useState, useCallback } from 'react'

// NEXT
import { Link, useLocation } from 'react-router-dom'

// HERRAMIENTAS
import { formatDate, findByUID, getRelated } from 'Utils/PostTools'

// CONTEXTO
import MainContext from 'Context/MainContext'

// COMPONENTES
import Meta from 'Components/Meta/Meta'
import Serializer, { GetTitles } from 'Components/Serializer/Serializer'

// ICONOS
import { ChevronLeft, Twitter, Linkedin, Facebook, Link as LinkIcon, Star } from 'react-feather'

// ESTILOS
import Styles from './Post.module.scss'
import PostClip from 'Components/PostClip/PostClip'

// HOOKS
import { useLikes, useLikesAverage } from 'Utils/LikesHook'

// ESTADOS
interface PostState{
	likesAverage: string
}

const DefState:PostState = {
	likesAverage: '0'
}

const Post: React.FC = () => {
	// CONTEXTO
	const { posts, lang } = useContext(MainContext)

	// ESTADO
	const [postState, setState]:[PostState, Dispatch<SetStateAction<PostState>>] = useState(DefState)

	// POST ACTUAL
	const uid: string = useLocation().pathname.substr(7)
	const sPost: IPostItem | undefined = findByUID(uid, posts)

	// ESTADO DEL POST
	const relatedPosts: IPostItem[] = getRelated(sPost, posts, uid)
	const subtitles:string[] = GetTitles(sPost?.contentMd, false)
	const subsubtitles:string[] = GetTitles(sPost?.contentMd, true)

	// COMPARTIR
	const shareEvent = (ev: MouseEvent<HTMLAnchorElement>) => {
		if(navigator && navigator.share){
			ev.preventDefault()
			import('Utils/Tools').then(({ shareLink }) =>
				shareLink(
					ev,
					sPost ? sPost.title : '',
					`Mira este artículo sobre ${sPost ? sPost.tags.join(', ') : ['']}`
				)
			)
		}
	}

	// HOOKS DE LIKES
	useLikes(uid, `.${Styles.content} .${Styles.container} .${Styles.contentText} .${Styles.likes} ul:first-child li`, Styles.starFilled)
	useLikesAverage(uid, useCallback((likesAverage:string) => setState({likesAverage}), []))

	// COPIAR URL
	const copyPaths = (e: any) =>
		import('Utils/Tools').then(({ copyToClipboard }) => copyToClipboard(e, lang.postPage.toast))

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
									<span>{postState.likesAverage}</span> <Star />
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
																	subSubtitle?.startsWith(` ${(i + 1).toString()}.`) && (
																		<li key={`subSub-${ind}`}>
																			<a
																				href={`#${subSubtitle.replace(/ /g, '-').substr(5)}`}
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
							<PostClip title={lang.postPage.related} posts={relatedPosts}/>
							</div>
						</div>
					</div>
				</div>
			)}
		</section>
	)
}

export default Post
