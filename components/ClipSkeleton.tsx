import { useEffect, Dispatch, SetStateAction, useState } from 'react'

const ClipSkeleton: React.FC = () => {
	// ESTADO
	const [state, setRandom]: [number[], Dispatch<SetStateAction<number[]>>] = useState([0])

	// ANIMACIONES
	useEffect(() => {
		// INTERVALO
		const interval = setInterval(() => {
			const random: number = Math.random()
			const random1: number = Math.random()
			const random2: number = Math.random()
			const random3: number = Math.random()

			// ACTUALIZAR
			setRandom([random, random1, random2, random3])
		}, 400)

		// LIMPIAR INTERVALO
		return () => clearInterval(interval)
	}, [])

	return (
		<div>
			<span />
			<ul>
				<li />
				<li />
				<li />
			</ul>
			<style jsx>{`
				div {
					position: relative;
					width: 300px;
					border-radius: 10px;
					padding: 25px 50px;
					box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.05);
					margin-bottom: 30px;
					overflow: hidden;
				}

				div::before {
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

				div::after {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					background: var(--shadow);
					z-index: -1;
				}

				span,
				ul li {
					position: relative;
					display: block;
					background: var(--postText);
					height: 17px;
					border-radius: 20px;
					opacity: 0.6;
					transition: width 0.4s ease-in-out;
				}

				span {
					width: ${Math.min(state[0] * 100 + 40, 100)}%;
				}

				ul {
					margin-top: 30px;
					display: grid;
					grid-template-rows: auto auto auto;
					row-gap: 15px;
				}

				ul li {
					left: 12px;
					opacity: 0.4;
				}

				ul li:first-child {
					width: calc(${Math.min(state[1] * 100 + 40, 100)}% - 12px);
				}

				ul li:nth-child(2) {
					width: calc(${Math.min(state[2] * 100 + 40, 100)}% - 12px);
				}

				ul li:last-child {
					width: calc(${Math.min(state[3] * 100 + 40, 100)}% - 12px);
				}

				ul li::before {
					content: '';
					position: absolute;
					top: 50%;
					left: -14px;
					border-radius: 100%;
					transform: translateY(-50%);
					height: 7px;
					width: 7px;
					background: var(--postText);
				}
			`}</style>
		</div>
	)
}

export default ClipSkeleton
