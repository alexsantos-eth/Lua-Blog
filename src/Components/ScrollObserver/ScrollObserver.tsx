// REACT
import React, { RefObject, useEffect, useRef } from 'react'

import Styles from './ScrollObserver.module.scss'

const ScrollObserver: React.FC = () => {
	// REFERENCIA
	const progressScroll: RefObject<HTMLProgressElement> = useRef(null)

	// CAMBIAR CON SCROLL
	useEffect(() => {
		const element: HTMLProgressElement | null = progressScroll.current

		// ANIMAR SCROLL
		const setScroll = async () => {
			const { scrollRAF, calculateScrollDistance } = await import('Utils/Tools')

			// ACTUALIZAR PROGRESS BAR
			if (element) element.max = calculateScrollDistance()

			scrollRAF((scrollY: number) => {
				// ANIMAR
				if (element) element.value = scrollY
			})
		}

		setScroll()
	}, [])

	return <progress ref={progressScroll} className={Styles.progress} value='0' />
}

export default ScrollObserver
