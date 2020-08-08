// REACT
import React, { RefObject, useEffect, useRef } from 'react'

import Styles from './ScrollObserver.module.scss'

// PROPIEDADES
interface ScrollProps {
	uid: string
}

const ScrollObserver: React.FC<ScrollProps> = (props: ScrollProps) => {
	// REFERENCIA
	const progressScroll: RefObject<HTMLProgressElement> = useRef(null)

	// CAMBIAR CON SCROLL
	useEffect(() => {
		const element: HTMLProgressElement | null = progressScroll.current

		// ALTO MÁXIMO
		const setMax = async () => {
			// SCROLL MAX
			const { scrollRAF, calculateScrollDistance } = await import('Utils/Tools')

			// ACTUALIZAR PROGRESS BAR
			if (element) element.max = calculateScrollDistance()
			return scrollRAF
		}

		// ANIMAR SCROLL
		const setScroll = async () => {
			const scrollRAF = await setMax()

			scrollRAF((scrollY: number) => {
				// ANIMAR
				if (element) element.value = scrollY
			})
		}

		// RE CALCULAR ALTO
		if (props.uid)
			setTimeout(() => {
				setMax()
			}, 500)

		setScroll()
	}, [props.uid])

	return <progress ref={progressScroll} className={Styles.progress} value='0' />
}

export default ScrollObserver
