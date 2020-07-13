// INTERFAZ
interface NavProps {
	changeDarkMode?: () => any
	darkMode?: boolean
}

const Navbar: React.FC<NavProps> = (props: NavProps) => {
	// CAMBIAR DARKMODE
	const changeDarkMode = () => props.changeDarkMode && props.changeDarkMode()

	return (
		<nav>
			<input type='checkbox' id='showMenu' />
			<div id='nav-logo'>
				<img src='/images/general/logo.png' alt='Logo' />
				<div id='nav-title'>
					<h1>LUA</h1>
					<p>Development Studio</p>
				</div>
			</div>
			<div id='nav-sections'>
				<ul>
					<li>
						<a href='https://wearelua.com/' title='Inicio' className='disable-route'>
							Inicio
						</a>
					</li>
					<li>
						<a href='https://wearelua.com/nosotros' title='Nosotros' className='disable-route'>
							Nosotros
						</a>
					</li>
					<li>
						<a href='https://wearelua.com/soluciones' title='Soluciones' className='disable-route'>
							Soluciones
						</a>
					</li>
					<li>
						<a href='https://wearelua.com/equipo' title='Equipo' className='disable-route'>
							Equipo
						</a>
					</li>
					<li>
						<a href='/' title='Blog' className='enable-route'>
							Blog
						</a>
					</li>
					<li>
						<a href='https://wearelua.com/hablemos' className='btn talkBtn'>
							Hablemos
						</a>
					</li>
				</ul>
			</div>
			<div id='nav-btns'>
				<span>
					<i className='lni lni-search-alt' />
				</span>
				<span onClick={changeDarkMode}>
					<i className={`lni lni-${props.darkMode ? 'sun' : 'night'}`} />
				</span>
				<a href='https://wearelua.com/hablemos' className='btn talkBtn'>
					Hablemos
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
			<style jsx>{`
				#showMenu {
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
					height: 25px;
				}
				nav > #nav-btns > ul > li > button.active-langBtn {
					font-weight: 500;
					font-size: 1em;
				}
				nav > #nav-btns > span {
					cursor: pointer;
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
					}
					nav > #nav-sections > ul > li > .talkBtn {
						display: inline-flex;
						width: 140px;
						border-color: var(--navCTA);
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
			`}</style>
		</nav>
	)
}

export default Navbar
