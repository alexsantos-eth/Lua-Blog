// REACT
import React, {
	ChangeEvent,
	Dispatch,
	SetStateAction,
	useContext,
	useState,
	useEffect,
	lazy,
	Suspense,
} from 'react'

// ICONOS
import { ChevronDown } from 'react-feather'

// ESTILOS
import Styles from './Index.module.scss'

// CONTEXTO
import MainContext from 'Context/MainContext'

// COMPONENTES
import Meta from 'Components/Meta/Meta'
import ClipSkeleton from 'Components/ClipSkeleton/ClipSkeleton'
import PostClip from 'Components/PostClip/PostClip'

// LAZY COMPONENTS
const PostCard = lazy(() => import('Components/PostCard/PostCard'))

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

// CARGA INICIAL
let localPopular: IPostItem[] | null = null

const Index: React.FC = () => {
	// CONTEXTO
	const { lang, posts } = useContext(MainContext)

	// ESTADO
	DefState.posts = posts
	DefState.popular = window.innerWidth <= 600 ? localPopular || posts : localPopular
	const [postsState, setPosts]: [IndexState, Dispatch<SetStateAction<IndexState>>] = useState(
		DefState
	)

	// FIRESTORE
	useEffect(() => {
		// TIEMPO EN MOVIL
		const eta: number = window.innerWidth <= 600 ? 7000 : 1000

		// ONLOAD
		const onload = () => {
			// DIFERIR CARGA DE FIRESTORE
			setTimeout(
				() =>
					import('Utils/Firestore').then(({ getSortPopular }) => {
						getSortPopular(posts).then(popular => {
							localPopular = popular
							setPosts((prevState: IndexState) => ({ ...prevState, popular }))
						})
					}),

				// TIEMPO APROXIMADO DE CARGA
				localPopular === null ? eta : 0
			)
		}

		// CARGAR FIRESTORE DESPUES DEL PRIMER RENDEREIZADO
		if (window.localStorage.getItem('waitFirestore') === '1') onload()

		// AGREGAR EVENTO
		window.addEventListener('load', onload)

		// QUITAR EVENTO
		return () => window.removeEventListener('load', onload)
	}, [posts])

	// CAMBIAR ENTRE DESTACADOS Y RECIENTES
	const changeDocs = (ev: ChangeEvent<HTMLSelectElement>) => {
		// SELECCIONAR INPUT
		const select: HTMLSelectElement = ev.target as HTMLSelectElement
		const index: number = select.selectedIndex

		// CAMBIAR ESTADO
		setPosts((prevState: IndexState) => ({ ...prevState, notSort: index === 0 }))
	}

	return (
		<section className={`${Styles.page} home`}>
			<Meta
				title={lang.general.title}
				desc='Creamos experiencias digitales e integramos tecnología escalable de alto rendimiento con el objetivo de acelerar el crecimiento de negocios, empresas y startups al rededor del mundo.'
				banner='https://blog.wearelua.com/images/banner.jpg'
				url=''
				keys={'Diseño web, E-commerce, Apps móviles, Inteligencia Artificial, Consultoría IT, Software, Estudio de Desarrollo'.split(
					', '
				)}
			/>
			{postsState.posts && (
				<div className={Styles.homeContainer}>
					<div className={Styles.selectPost}>
						<select onChange={changeDocs} id='selectPost' aria-label='Order posts'>
							<option>{lang.index.postTitle}</option>
							<option>{lang.index.postTitle_2}</option>
						</select>
						<label
							htmlFor='selectPost'
							id='downIcon'
							style={{ left: `${postsState.notSort ? '-25px' : '0px'}` }}
							className={Styles.selectIcon}>
							<ChevronDown color='var(--primary)' />
						</label>
					</div>

					{postsState.posts && (
						<div>
							{postsState.posts &&
								(postsState.notSort
									? postsState.posts
									: postsState.popular || postsState.posts
								).map((post: IPostItem, key: number) => (
									<Suspense key={key} fallback={<ClipSkeleton />}>
										<PostCard post={post} />
									</Suspense>
								))}
						</div>
					)}

					<div className={Styles.loadContainer}>
						<PostClip title={lang.index.postTitle} posts={posts} />
						<PostClip title={lang.index.postTitle_2} posts={postsState.popular} />
					</div>
				</div>
			)}
		</section>
	)
}

export default Index
