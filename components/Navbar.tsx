// CONTEXTO
import {
	useContext,
	Dispatch,
	SetStateAction,
	useState,
	ChangeEvent,
	useEffect,
	RefObject,
	useRef,
} from 'react'
import { appContext } from 'context/appContext'

// PRISMIC
import { Document } from 'prismic-javascript/types/documents'
import SearchCard from './SearchCard'
import { useRouter } from 'next/router'

// @ts-ignore
import { RichText } from 'prismic-reactjs'
import { parseString } from 'utils/Tools'

// INTERFAZ
interface NavProps {
	docs: Document[] | null
	changeDarkMode?: () => any
	darkMode?: boolean
}

// ESTADO
interface INavState {
	foundDocs: Document[] | null
}

const Navbar: React.FC<NavProps> = (props: NavProps) => {
	// LENGUAJE
	const { lang } = useContext(appContext)

	// ESTADO
	const defNavState: INavState = { foundDocs: props.docs }
	const [navState, setState]: [INavState, Dispatch<SetStateAction<INavState>>] = useState(
		defNavState
	)

	// REFERENCIAS
	const searchInp: RefObject<HTMLInputElement> = useRef(null)
	const drawerInp: RefObject<HTMLInputElement> = useRef(null)

	// ROUTER
	useEffect(() => {
		if (searchInp.current && drawerInp.current)
			searchInp.current.checked = drawerInp.current.checked = false
	}, [useRouter().asPath])

	// CAMBIAR DARKMODE
	const changeDarkMode = () => props.changeDarkMode && props.changeDarkMode()

	// BUSCAR DOCUMENTOS
	const searchDocs = (ev: ChangeEvent<HTMLInputElement>) => {
		// LEER INPUT
		const input: HTMLInputElement = ev.target as HTMLInputElement
		const val: string = parseString(input.value)

		if (props.docs?.length) {
			// DOCUMENTOS ENCONTRADOS
			const tmpDocs: Document[] | null = []

			// FOR EN LUGAR DE FOREACH O MAP PARA VELOCIDAD
			// tslint:disable-next-line: prefer-for-of
			for (let i = 0; i < props.docs.length; i++) {
				// DOCUMENTO
				const doc: Document = props.docs[i]

				// INDEX OF EN LUGAR DE INCLUDES O MATCH
				if (
					parseString(RichText.asText(doc.data.title)).indexOf(val) >= 0 ||
					parseString(doc.data.author).indexOf(val) >= 0 ||
					parseString(RichText.asText(doc.data.description)).indexOf(val) >= 0 ||
					parseString(RichText.asText(doc.data.content)).indexOf(val) >= 0
				)
					tmpDocs.push(doc)
			}

			// ACTUALIZAR DOCUMENTOS
			setState({ foundDocs: tmpDocs })
		}
	}

	// ACTUALIZAR DOCS
	useEffect(() => {
		setState({ foundDocs: props.docs })
	}, [props.docs])

	return (
		<nav>
			<input type='checkbox' id='showMenu' ref={drawerInp} />
			<input type='checkbox' id='showSearch' ref={searchInp} />
			<div id='nav-logo'>
				<img src='/images/general/logo.png' alt='Logo' />
				<div id='nav-title'>
					<h1>LUA</h1>
					<p>Development Studio</p>
				</div>
			</div>
			<div id='nav-sections'>
				<ul>
					{lang.navbar.routes.map((route: string, key: number) => (
						<li key={key}>
							<a
								href={key === 4 ? '/' : `https://wearelua.com/${route === 'Inicio' ? '' : route}`}
								title={route}
								className={
									key === 5 ? 'btn talkBtn' : key === 4 ? 'enable-route' : 'disable-route'
								}>
								{route}
							</a>
						</li>
					))}
				</ul>
			</div>
			<div id='nav-btns'>
				<label htmlFor='showSearch'>
					<i className='lni lni-search-alt' />
				</label>
				<span onClick={changeDarkMode}>
					<i className={`lni lni-${props.darkMode ? 'sun' : 'night'}`} />
				</span>
				<a href='https://wearelua.com/hablemos' className='btn talkBtn'>
					{lang.navbar.routes[5]}
				</a>
				<ul>
					<li>
						<button className='active-langBtn'>ES</button>
					</li>
					<li>
						<button>EN</button>
					</li>
				</ul>
				<label id='nav-menuBtn' htmlFor='showMenu'>
					<span />
					<span />
					<span />
				</label>
			</div>
			<div className='searchBox'>
				<div className='searchInp'>
					<i className='lni lni-search-alt' />
					<input type='search' placeholder={lang.navbar.searchPlaceholder} onChange={searchDocs} />
					<label htmlFor='showSearch' className='lni lni-close' />
				</div>
				<div className='foundDocs'>
					{navState.foundDocs?.map((doc: Document, key: number) => (
						<SearchCard doc={doc} key={key} />
					))}
				</div>
			</div>
			<style jsx>{`
				#showMenu,
				#showSearch {
					display: none;
				}
				nav {
					position: fixed;
					top: 0;
					left: 0;
					z-index: 5;
					width: 100%;
					padding: 20px 50px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: var(--postText);
					overflow: hidden;
					box-shadow: 0 5px 5px rgba(0, 0, 0, 0.05);
					--cols: ${(props.docs?.length || 0) < 4 ? props.docs?.length || 0 : 4};
				}
				nav::before {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: var(--navbarBackground);
					z-index: -2;
					transition: background 0.3s ease-in-out;
				}
				nav::after {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: var(--shadow);
					z-index: -1;
				}
				#nav-menuBtn {
					width: 40px;
					height: 25px;
					border-radius: 0;
					box-shadow: none;
					display: none;
					grid-template-columns: 1fr;
					grid-template-rows: repeat(3, 4px);
					row-gap: 7px;
					align-content: center;
					justify-items: flex-end;
					transition: transform 0.3s ease-in-out 0.3s;
				}
				#nav-menuBtn > span {
					width: 100%;
					height: 100%;
					border-radius: 100px;
					background: var(--postText);
					transition: all 0.3s ease-in-out;
				}
				#nav-menuBtn > span:nth-child(1) {
					width: 90%;
				}
				#nav-menuBtn > span:nth-child(3) {
					width: 70%;
				}
				nav > #nav-logo {
					display: flex;
					align-items: center;
				}
				nav > #nav-logo > img {
					width: 50px;
				}
				nav > #nav-logo > div {
					width: 92px;
					color: var(--postText);
					margin-left: 15px;
					font-size: 1em;
					font-weight: 400;
					font-family: 'Manrope';
				}
				nav > #nav-logo > div > h1 {
					font-size: 1.1em;
				}
				nav > #nav-logo > div > p {
					font-weight: 200;
				}
				nav > #nav-sections {
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
				}
				nav > #nav-sections > ul {
					width: 100%;
					display: grid;
					grid-template-columns: auto auto auto auto auto;
					grid-template-rows: 1fr;
					align-items: center;
					column-gap: 30px;
				}
				nav > #nav-sections > ul > li > a {
					color: var(--postText);
					font-family: 'Futura';
					font-size: 1.05em;
					text-decoration: none;
					font-weight: 200;
					position: relative;
				}
				nav > #nav-sections > ul > li > a.enable-route {
					font-weight: 300;
				}
				nav > #nav-sections > ul > li > a.enable-route::before {
					content: '';
					position: absolute;
					top: 50%;
					left: -5px;
					width: calc(100% + 10px);
					transform: translateY(-50%);
					height: 2px;
					background: var(--postText);
				}
				nav > #nav-sections > ul > li > .talkBtn {
					display: none;
				}
				nav > #nav-btns {
					display: grid;
					grid-template-columns: auto auto auto auto;
					grid-template-rows: 1fr;
					align-items: center;
					column-gap: 15px;
					font-size: 1.3em;
				}
				.talkBtn {
					border: 2px solid var(--postText);
					font-size: 0.8em;
					font-family: 'Futura';
					width: 130px;
					box-shadow: none;
					border-radius: 8px;
				}
				nav > #nav-btns > ul {
					display: flex;
				}
				nav > #nav-btns > span:nth-child(2) {
					transform: scale(1.2) rotateY(180deg);
				}
				nav > #nav-btns > ul > li:nth-child(1) {
					border-right: 2px solid var(--postText);
					padding-right: 7.5px;
				}
				nav > #nav-btns > ul > li:nth-child(2) {
					padding-left: 7.5px;
				}
				nav > #nav-btns > ul > li > button {
					box-shadow: none;
					width: auto;
					display: inline-block;
					font-size: 0.8em;
					font-family: 'Futura';
					background: transparent;
					height: 25px;
				}
				nav > #nav-btns > ul > li > button.active-langBtn {
					font-weight: 500;
					font-size: 1em;
				}
				nav > #nav-btns > label {
					cursor: pointer;
				}

				.searchBox {
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					background: linear-gradient(to bottom, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7));
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: flex-start;
					padding-top: 22px;
					opacity: 0;
					transform: scale(0);
					transition: opacity 0.3s ease-in-out, transform 0s linear 0.3s;
					z-index: 10;
				}

				.searchInp {
					display: flex;
					align-items: center;
				}

				.searchBox > .searchInp > input {
					appearance: none;
					border: none;
					outline: none;
					background: #fff;
					border-radius: 100px;
					font-size: 1.2em;
					width: 570px;
					color: var(--deepBlue);
					padding: 10px 20px;
				}

				.searchBox > .searchInp > label {
					font-size: 1.5em;
					margin-left: 15px;
					cursor: pointer;
					color: #fff;
				}

				.searchBox > .searchInp > i {
					font-size: 1.5em;
					margin-right: 15px;
					cursor: pointer;
					color: #fff;
				}

				.foundDocs {
					margin-top: 30px;
					display: grid;
					grid-template-columns: repeat(var(--cols), auto);
					grid-template-rows: repeat(3, auto);
					column-gap: 30px;
					row-gap: 30px;
				}

				#showSearch:checked ~ .searchBox {
					opacity: 1;
					transform: scale(1);
					transition: opacity 0.3s ease-in-out, transform 0s linear 0s;
				}

				@media screen and (max-width: 1380px) {
					nav {
						--cols: ${(props.docs?.length || 0) < 3 ? props.docs?.length || 0 : 3};
					}
				}

				@media screen and (max-width: 1150px) {
					nav > #nav-sections {
						position: relative;
						left: 0;
						transform: none;
					}
				}
				@media screen and (max-width: 1024px) {
					nav > #nav-sections > ul {
						column-gap: 20px;
					}
				}
				@media screen and (max-width: 965px) {
					nav {
						font-size: 14px;
						padding: 15px 40px;
						--cols: ${(props.docs?.length || 0) < 2 ? props.docs?.length || 0 : 2};
					}
					nav > #nav-sections {
						position: fixed;
						left: unset;
						right: -100vw;
						top: 0;
						width: 249.933px;
						height: 100vh;
						background: var(--navbarBackground);
						box-shadow: -10px 0 10px rgba(0, 0, 0, 0.1);
						transition: transform 0.6s ease-in-out 0.3s;
					}
					#nav-menuBtn {
						display: grid;
					}
					#showMenu:checked ~ #nav-sections {
						transition: transform 0.6s ease-in-out;
						transform: translateX(-100vw);
					}
					#showMenu:checked ~ #nav-btns > #nav-menuBtn {
						width: 33px;
						height: 25px;
						position: relative;
						left: -3px;
					}
					#showMenu:checked ~ #nav-btns > #nav-menuBtn > span:nth-child(1) {
						width: 100%;
						transform: rotate(-45deg);
						transform-origin: top right;
					}
					#showMenu:checked ~ #nav-btns > #nav-menuBtn > span:nth-child(2) {
						width: 0;
					}
					#showMenu:checked ~ #nav-btns > #nav-menuBtn > span:nth-child(3) {
						width: 100%;
						transform: rotate(45deg);
						transform-origin: bottom right;
					}
					nav > #nav-btns {
						position: relative;
						z-index: 3;
					}
					nav > #nav-sections > ul {
						grid-template-columns: auto;
						grid-template-rows: auto auto auto auto auto;
						column-gap: 0px;
						row-gap: 60px;
						text-align: center;
						position: relative;
						margin-top: calc((var(--navHeight) / 2) - 20px);
						top: 50%;
						transform: translateY(-50%);
					}
					nav > #nav-sections::after {
						content: '';
						position: absolute;
						left: calc(249.933px - 100vw);
						top: 0;
						width: 100vw;
						height: 100vh;
						z-index: -2;
						background: var(--navbarBackground);
						opacity: 0;
						transition: opacity 0.3s ease-in-out;
					}
					#showMenu:checked ~ #nav-sections::after {
						transition: opacity 0.3s ease-in-out 0.6s;
						opacity: 0.7;
					}
					.talkBtn:nth-child(3) {
						display: none;
					}
					nav > #nav-sections > ul > li > a {
						font-size: 15px;
						font-weight: 500;
					}
					nav > #nav-sections > ul > li > .talkBtn {
						display: inline-flex;
						width: 140px;
						border-color: var(--navCTA);
					}
				}
				@media screen and (max-width: 600px) {
					nav {
						--cols: 1;
					}

					.foundDocs {
						column-gap: 0;
						row-gap: 30px;
					}
					.searchBox > .searchInp > input {
						width: 270px;
					}
				}
				@media screen and (max-width: 460px) {
					nav {
						padding: 15px 20px;
					}
					nav > #nav-sections {
						width: 209.933px;
					}
					nav > #nav-sections::after {
						left: calc(209.933px - 100vw);
					}
				}
				@media screen and (max-width: 400px) {
					nav > #nav-logo > img {
						width: 50px;
					}
					nav > #nav-logo > div {
						display: none;
					}
				}

				@media screen and (max-width: 360px) {
					.searchBox > .searchInp > input {
						width: 200px;
					}
					.foundDocs {
						grid-template-columns: calc(100% - 60px);
						justify-content: center;
						row-gap: 30px;
					}
				}
			`}</style>
		</nav>
	)
}

export default Navbar
