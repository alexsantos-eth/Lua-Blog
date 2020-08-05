// HERRAMIENTAS
import IPostsDB, { getPosts, saveDocs } from 'Utils/LocalDB'
import React, {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

import ClipSkeleton from 'Components/ClipSkeleton'
import MainContext from 'Context/MainContext'
import Meta from 'Components/Meta/Meta'
import PostCard from 'Components/PostCard/PostCard'
import SearchCard from 'Components/SearchCard'
import getSortPopular from 'Utils/Firebase'

// ESTADO
interface IndexState {
	posts: IPostItem[] | null
	popular: IPostItem[] | null
	notSort: boolean
}

// ESTADO INICIAL
const DefState: IndexState = {
	posts: null,
	popular: null,
	notSort: true,
}

const Index: React.FC = () => {
	// CONTEXTO
	const { lang, posts } = useContext(MainContext)

	// ESTADO
	const [postsState, setPosts]: [IndexState, Dispatch<SetStateAction<IndexState>>] = useState(
		DefState
	)

	// GUARDAR DOCS EN LOCAL DB
	useEffect(() => {
		// GUARDAR POSTS
		saveDocs(posts)

		// CARGAR DESDE INDEXED DB
		if (!posts || !window.navigator.onLine) {
			getPosts().then((iPost: IPostsDB[]) => {
				setPosts((prevState: IndexState) => ({
					...prevState,
					posts: iPost.map((post: IPostsDB) => post.post),
				}))
			})
		}
	}, [])

	useEffect(() => {
		// OBTENER DOCUMENTOS DESTACADOS
		getSortPopular(posts).then((popular: IPostItem[]) =>
			setPosts((prevState: IndexState) => ({ ...prevState, popular }))
		)
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
		[postsState.posts]
	)

	return (
		<section className='page home'>
			<Meta
				title={lang.general.title}
				desc='Blog de tecnología escrito en TypeScript con NextJS, Firebase y continuos deploying con Vercel, el proyecto es OpenSource bajo una licencia GNU, contiene Linters y Prettier para el formato estándar.'
				banner=''
				url=''
				keys={['LUA', 'blog']}
			/>
			{postsState.posts && (
				<div className='homeContainer'>
					<div className='selectPost'>
						<select onChange={changeDocs} id='selectPost' aria-label='Order posts'>
							<option>{lang.index.postTitle}</option>
							<option>{lang.index.postTitle_2}</option>
						</select>
						<label htmlFor='selectPost' id='downIcon' className='lni lni-chevron-down selectIcon' />
					</div>

					{postsState.posts && (
						<div className='postsList'>
							{postsState.posts &&
								(postsState.notSort ? postsState.posts : postsState.popular || postsState.docs).map(
									(post: IPostItem, key: number) => <PostCard key={key} post={post} />
								)}
						</div>
					)}

					<div className='postsC-container'>
						<div className='postsRecent postClip'>
							<h2>{lang.index.postTitle}</h2>
							{postsState.posts.map((post: IPostItem, key: number) => {
								if (key < 3) return <SearchCard key={key} post={post} />
							})}
						</div>

						{postsState.popular ? (
							<div className='bestPosts postClip'>
								<h2>{lang.index.postTitle_2}</h2>
								{postsState.popular.map((post: IPostItem, key: number) => {
									if (key < 3) return <SearchCard key={key} post={post} />
								})}
							</div>
						) : (
							<ClipSkeleton />
						)}
					</div>
				</div>
			)}
		</section>
	)
}

export default Index
