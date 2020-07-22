// REACT
import { useRef, RefObject } from 'react'

// ROUTER
import Router from 'next/router'

const Progress: React.FC = () => {
	// REFERENCIA
	const progressRef: RefObject<HTMLSpanElement> = useRef(null)

	// TEMPORIZADOR
	let timer: any

	// TERMINAR
	Router.events.on('routeChangeComplete', () => {
		if (progressRef.current) {
			// LIMPIAR INTERVALO
			clearInterval(timer)

			// AUMENTAR AL 100%
			progressRef.current.style.transform = 'scaleX(1)'

			// REINICIAR ESTILOS
			setTimeout(() => {
				if (progressRef.current) {
					progressRef.current.style.transition = 'none'
					progressRef.current.style.transform = 'scaleX(0)'
				}
			}, 500)
		}
	})

	// INICIAR
	Router.events.on('routeChangeStart', () => {
		if (progressRef.current) {
			// AGREGAR TRANSICIONES
			progressRef.current.style.transition = 'transform 0.5s ease-in-out'

			// CONTADOR DE AVANCE
			let count: number = 0
			timer = setInterval(() => {
				// AUMENTAR PORCENTAJE
				if (progressRef.current) progressRef.current.style.transform = `scaleX(${++count / 100})`
			}, 500)
		}
	})

	return (
		<>
			<div>
				<span ref={progressRef} />
			</div>
			<style jsx>{`
				div {
					border: none;
					outline: none;
					background: transparent;
					height: 3px;
					position: fixed;
					top: 0;
					left: 0;
					width: 100%;
					z-index: 6;
				}
				span {
					display: block;
					height: 100%;
					width: 100%;
					background: var(--deepOrange);
					transform: scaleX(0);
					transform-origin: left center;
					transition: transform 0.5s ease-in-out;
				}
			`}</style>
		</>
	)
}

export default Progress
