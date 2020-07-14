// REACT
import { useEffect } from 'react'

// PROGRESS
// @ts-ignore
import NProgress from 'nprogress'

// ROUTER
import Router from 'next/router'

// INTERFAZ
interface RouteNProgressProps {
	startPosition?: number
	stopDelayMs?: number
	color?: string
	height?: number
}

// VALORES POR DEFECTO
const defaultProps: RouteNProgressProps = {
	startPosition: 0.3,
	stopDelayMs: 200,
	color: 'var(--deepOrange)',
	height: 3,
}

const RouteNProgress: React.FC<RouteNProgressProps> = (props: RouteNProgressProps) => {
	// TIMER
	let timer: number

	// CAMBIAR CON RUTA
	const routeChangeStart = () => {
		NProgress.set(props.startPosition || defaultProps.startPosition)
		NProgress.start()
	}

	// FINALIZAR PROGRESS
	const routeChangeEnd = () => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			NProgress.done(true)
		}, props.stopDelayMs || defaultProps.stopDelayMs)
	}

	// AGREGAR EVENTOS
	useEffect(() => {
		Router.events.on('routeChangeStart', routeChangeStart)
		Router.events.on('routeChangeComplete', routeChangeEnd)
		Router.events.on('routeChangeError', routeChangeEnd)
	}, [])

	return (
		<style jsx global>{`
			#nprogress {
				pointer-events: none;
			}

			#nprogress .bar {
				background: ${props.color || defaultProps.color};
				position: fixed;
				z-index: 1031;
				top: 0;
				left: 0;
				width: 100%;
				height: ${props.height || defaultProps.height}px;
			}

			#nprogress .peg {
				display: block;
				position: absolute;
				right: 0px;
				width: 100px;
				height: 100%;
				box-shadow: 0 0 10px ${props.color || defaultProps.color},
					0 0 5px ${props.color || defaultProps.color};
				opacity: 1;
				-webkit-transform: rotate(3deg) translate(0px, -4px);
				-ms-transform: rotate(3deg) translate(0px, -4px);
				transform: rotate(3deg) translate(0px, -4px);
			}

			#nprogress .spinner {
				position: fixed;
				z-index: 1031;
				top: 15px;
				right: 15px;
			}

			.nprogress-custom-parent {
				overflow: hidden;
				position: relative;
			}

			.nprogress-custom-parent #nprogress .spinner,
			.nprogress-custom-parent #nprogress .bar {
				position: absolute;
			}
		`}</style>
	)
}

export default RouteNProgress
