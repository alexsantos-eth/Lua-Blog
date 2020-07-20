// REACT
import { RefObject, useRef, useEffect } from 'react'

// ROUTER
import { useRouter } from 'next/router'

// HERRAMIENTAS
import { calculateScrollDistance } from 'utils/Tools'

const ScrollObserver: React.FC = () => {
	// REFERENCIA
	const progressScroll: RefObject<HTMLProgressElement> = useRef(null)

	// RUTA
	const path = useRouter().asPath

	// CAMBIAR LONGITUD
	useEffect(() => {
		// ACTUALIZAR PROGRESS BAR
		if (progressScroll.current) progressScroll.current.max = calculateScrollDistance()

		// ACTUALIZAR EN CARGA
		setTimeout(() => {
			if (progressScroll.current) progressScroll.current.max = calculateScrollDistance()
		}, 3000)
	}, [path])

	// CAMBIAR CON SCROLL
	useEffect(() => {
		// VALOR DE SCROLL
		const scrollChange = () => {
			if (progressScroll.current) progressScroll.current.value = window.scrollY
		}

		// EVENTO
		window.addEventListener('scroll', scrollChange)

		// QUITAR EVENTO
		return () => window.removeEventListener('scroll', scrollChange)
	}, [])

	return (
		<>
			<progress ref={progressScroll} className='post-progress' value='0' />
			<style jsx>{`
				.post-progress {
					appearance: none;
					border: none;
					outline: none;
					background: transparent;
					height: 3px;
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					z-index: 5;
				}
			`}</style>
		</>
	)
}

export default ScrollObserver
