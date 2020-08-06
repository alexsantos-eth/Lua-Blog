import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import Styles from './ClipSkeleton.module.scss'

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
		<div className={Styles.container}>
			<span style={{ width: `${Math.min(state[0] * 100 + 40, 100)}%` }} />
			<ul>
				<li style={{ width: `calc(${Math.min(state[1] * 100 + 40, 100)}% - 12px)` }} />
				<li style={{ width: `calc(${Math.min(state[2] * 100 + 40, 100)}% - 12px)` }} />
				<li style={{ width: `calc(${Math.min(state[3] * 100 + 40, 100)}% - 12px)` }} />
			</ul>
		</div>
	)
}

export default ClipSkeleton
