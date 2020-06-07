// INTERFAZ
interface NavProps {
	changeDarkMode: () => any
	darkMode: boolean
}

const Navbar: React.FC<NavProps> = (props: NavProps) => {
	// CAMBIAR DARKMODE
	const changeDarkMode = () => props.changeDarkMode()

	return (
		<nav>
			<div id='nav-logo'>
				<img src='/images/general/logo.png' alt='Logo' />
				<div id='nav-title'>
					<h1>LUA</h1>
					<p>Development Studio</p>
				</div>
			</div>
			<div id='nav-btns'>
				<span>
					<i className='lni lni-search-alt' />
				</span>
				<span onClick={changeDarkMode}>
					<i className={`lni lni-${props.darkMode ? 'sun' : 'night'}`} />
				</span>
				<span>
					<i className='lni lni-travel' />
				</span>
			</div>
			<style jsx>{`
				nav {
					position: relative;
					z-index: 5;
					width: 100%;
					padding: 15px 25px;
					display: flex;
					justify-content: space-between;
					align-items: center;
					color: var(--postText);
					border-radius: 10px 10px 0 0;
					box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.05);
					overflow: hidden;
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

				nav > #nav-logo {
					display: flex;
					align-items: center;
				}

				nav > #nav-logo > img {
					width: 40px;
				}

				nav > #nav-logo > div {
					width: 73px;
					color: var(--postText);
					margin-left: 15px;
					font-size: 0.8em;
				}

				nav > #nav-btns {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr;
					grid-template-rows: 1fr;
					column-gap: 15px;
					font-size: 1.3em;
				}

				nav > #nav-btns > span {
					cursor: pointer;
				}
				@media screen and (max-width: 460px) {
					nav {
						width: 100%;
						border-radius: 0px;
						top: 0;
						left: 0;
						transform: none;
					}
				}
			`}</style>
		</nav>
	)
}

export default Navbar
