import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Moon, Sun } from 'react-feather'
import React, { RefObject, useContext, useEffect, useRef, memo } from 'react'

import Logo from 'Assets/General/logo.png'
import MainContext from 'Context/MainContext'
import ScrollObserver from 'Components/ScrollObserver/ScrollObserver'
import Styles from './Navbar.module.scss'

// INTERFAZ
interface NavProps extends RouteComponentProps {
	changeDarkMode: () => any
}

const Navbar: React.FC<NavProps> = (props: NavProps) => {
	// LENGUAJE
	const { lang, darkMode } = useContext(MainContext)

	// REFERENCIAS
	const drawerInp: RefObject<HTMLInputElement> = useRef(null)
	const navRef: RefObject<HTMLDivElement> = useRef(null)

	// ROUTER
	useEffect(() => {
		// OCULTAR DRAWER EN CAMBIO DE RUTA
		if (drawerInp.current) drawerInp.current.checked = false
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

	// CAMBIAR DARKMODE
	const changeDarkMode = () => props.changeDarkMode && props.changeDarkMode()

	// HACER SCROLL HACIA ARRIBA
	const scrollToTop = () => {
		if (drawerInp.current) drawerInp.current.checked = false
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	// CERRAR DRAWER
	const linkActions = lang.navbar.routes.map((_route: string) => () =>
		drawerInp.current ? (drawerInp.current.checked = false) : null
	)
	linkActions[4] = () => null

	return (
		<nav className={Styles.nav} ref={navRef}>
			<ScrollObserver />
			<div className={Styles.navContent}>
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
									{key === 0 ? (
										<Link to='/#!' title={route} onClick={scrollToTop}>
											{route}
										</Link>
									) : (
										<a
											className={key === 5 ? Styles.talkBtn : undefined}
											onClick={linkActions[key]}
											rel={key === 4 ? 'noopener noreferrer' : undefined}
											target={key === 4 ? '_blank' : undefined}
											href={
												key === 4
													? 'https://blog.wearelua.com'
													: `${key === 0 ? '#!' : '#!' + route.toLowerCase()}`
											}
											title={route}>
											{route}
										</a>
									)}
								</li>
							) : null
						)}
					</ul>
				</div>
				<div className={Styles.btn} id='nav-btn'>
					<button aria-label='Darkmode Icon' onClick={changeDarkMode}>
						{darkMode ? <Sun /> : <Moon />}
					</button>
					<a href={`#!${lang.navbar.routes[5].toLowerCase()}`} className={Styles.talkBtn}>
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
			</div>
		</nav>
	)
}

export default withRouter(memo(Navbar))
