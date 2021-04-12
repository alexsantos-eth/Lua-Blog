// REACT
import React, {
	RefObject,
	useContext,
	useEffect,
	useRef,
	memo,
	Dispatch,
	useState,
	ChangeEvent,
	SetStateAction,
	Suspense,
	lazy,
} from 'react'

// ROUTER
import {  RouteComponentProps, withRouter } from 'react-router-dom'

// ESTILOS
import Styles from './Navbar.module.scss'

// ICONOS
import { Moon, Sun, Search, X } from 'react-feather'

// ASSETS
import Logo from 'Assets/General/logo.png'

// COMPONENTES
import ScrollObserver from 'Components/ScrollObserver/ScrollObserver'
import ClipSkeleton from 'Components/ClipSkeleton/ClipSkeleton'

// CONTEXTO
import MainContext from 'Context/MainContext'

// LAZY
const SearchCard = lazy(() => import('Components/SearchCard/SearchCard'))

// INTERFAZ
interface NavProps extends RouteComponentProps {
	changeDarkMode: () => any
}

interface NavbarState {
	filterPosts: IPostItem[] | null
}

const defState: NavbarState = {
	filterPosts: null,
}

const Navbar: React.FC<NavProps> = (props: NavProps) => {
	// LENGUAJE
	const { lang, darkMode, posts } = useContext(MainContext)

	// ESTADOS
	defState.filterPosts = posts
	const [search, setPosts]: [NavbarState, Dispatch<SetStateAction<NavbarState>>] = useState(
		defState
	)

	// REFERENCIAS
	const drawerInp: RefObject<HTMLInputElement> = useRef(null)
	const inputRef: RefObject<HTMLInputElement> = useRef(null)
	const searchInp: RefObject<HTMLInputElement> = useRef(null)
	const navRef: RefObject<HTMLDivElement> = useRef(null)

	// ROUTER
	useEffect(() => {
		// OCULTAR DRAWER EN CAMBIO DE RUTA
		if (drawerInp.current) drawerInp.current.checked = false

		// CAMBIAR RENDER
		if (props.location.pathname !== '/' && !window.localStorage.getItem('waitFirestore'))
			window.localStorage.setItem('waitFirestore', '1')
	}, [props.location.pathname])

	// SCROLL
	useEffect(() => {
		const setScroll = async () => {
			const { scrollRAF } = await import('Utils/Tools')
			scrollRAF((scrollY: number) => {
				// CAMBIAR VARIABLE
				if (navRef.current && scrollY > 50)
					navRef.current.style.setProperty('--displayBackground', '1')
				else if (navRef.current) navRef.current.style.setProperty('--displayBackground', '0')
			})
		}
		setScroll()
	}, [])

	// BUSCAR
	const changeSearch = (ev: ChangeEvent<HTMLInputElement>) => {
		// NORMALIZAR ENTRADAS
		const nfd = (str: string) =>
			str
				.toLowerCase()
				.trim()
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '')

		// OBTENER DATOS
		const input: HTMLInputElement = ev.target as HTMLInputElement
		let filterPosts: IPostItem[] | null = null
		const val: string = input.value

		// FILTRAR POSTS
		filterPosts = posts.filter((post: IPostItem) => {
			if (
				nfd(post.contentMd).indexOf(nfd(val)) >= 0 ||
				nfd(post.description).indexOf(nfd(val)) >= 0 ||
				nfd(post.author).indexOf(nfd(val)) >= 0 ||
				post.tags.some((tag: string) => nfd(tag).includes(nfd(val))) ||
				nfd(post.title).indexOf(nfd(val)) >= 0 ||
				nfd(post.url).indexOf(nfd(val)) >= 0
			)
				return true
			else return false
		})

		// ACTUALIZAR ESTADOS
		setPosts({ filterPosts })
	}

	// CAMBIAR DARKMODE
	const changeDarkMode = () => props.changeDarkMode && props.changeDarkMode()

	// CERRAR DRAWER
	const linkActions = lang.navbar.routes.map((_route: string) => () =>
		drawerInp.current ? (drawerInp.current.checked = false) : null
	)
	linkActions[4] = () => null

	// PROPIEDADES DE BÚSQUEDA
	const maxLength: number =
		search.filterPosts && search.filterPosts?.length <= (window.innerWidth <= 1000 ? 2 : 3)
			? search.filterPosts?.length
			: window.innerWidth <= 1000
			? 2
			: 3

	// FOCUS INPUT AL ABRIR
	const focusInp = (ev: ChangeEvent<HTMLInputElement>) => {
		if (ev.target.checked && inputRef.current) {
			// ACTUALIZAR ESTADO Y FOCUS A INPUT
			inputRef.current.focus()
			setPosts({ filterPosts: posts })
		}

		// LIMPIAR INPUT
		else if (inputRef.current) inputRef.current.value = ''
	}

	return (
		<nav className={Styles.nav} ref={navRef}>
			<ScrollObserver uid={props.location.pathname} />
			<div className={Styles.navContent}>
				<input
					type='checkbox'
					className={Styles.showSearch}
					ref={searchInp}
					id='showSearch'
					onChange={focusInp}
				/>
				<input type='checkbox' className={Styles.showMenu} ref={drawerInp} id='showMenu' />
				<div className={Styles.logo}>
					<img src={Logo} alt='Logo' />
					<div id='nav-title'>
						<h1>LUA</h1>
						<p>Development Studio</p>
					</div>
				</div>
				<div className={Styles.sections} id='nav-sections'>
					<ul>
						{lang.navbar.routes.map((route: string, key: number) =>
							key < 6 ? (
								<li key={key}>
									{
										<a
											className={key === 5 ? Styles.talkBtn : undefined}
											onClick={linkActions[key]}
											rel='noopener noreferrer'
											target='_blank'
											href={
												key === 4
													? 'https://blog.wearelua.com'
													: `https://wearelua.com/${route.toLowerCase()}`
											}
											title={route}>
											{route}
										</a>
									}
								</li>
							) : null
						)}
					</ul>
				</div>
				<div className={Styles.btn} id='nav-btn'>
					<label htmlFor='showSearch' aria-label='Search icon'>
						<Search />
					</label>
					<button aria-label='Darkmode Icon' onClick={changeDarkMode}>
						{darkMode ? <Sun /> : <Moon />}
					</button>
					<a href='https://wearelua.com' className={Styles.talkBtn}>
						{lang.navbar.routes[5]}
					</a>
					<ul>
						<li>
							<button className={Styles.activeLangBtn}>ES</button>
						</li>
						<li>
							<button>EN</button>
						</li>
					</ul>
					<label className={Styles.menuBtn} id='nav-menuBtn' htmlFor='showMenu'>
						<span />
						<span />
						<span />
					</label>
				</div>
				<div className={Styles.searchBox} id='searchBox'>
					<div className={Styles.searchContainer}>
						<label htmlFor='searchInput' aria-label='Search icon'>
							<Search />
						</label>
						<input
							ref={inputRef}
							onChange={changeSearch}
							type='search'
							id='searchInput'
							placeholder={lang.navbar.searchPlaceholder}
						/>
						<label htmlFor='showSearch' aria-label='Close icon'>
							<X />
						</label>
					</div>
					<div
						style={{
							gridTemplateColumns: `repeat(${maxLength}, auto)`,
						}}>
						{search.filterPosts &&
							search.filterPosts.map((post: IPostItem, key: number) => (
								<Suspense key={`Search_${key}`} fallback={<ClipSkeleton />}>
									<SearchCard asLabel={searchInp.current} post={post} />
								</Suspense>
							))}
					</div>
				</div>
			</div>
		</nav>
	)
}

export default withRouter(memo(Navbar))
