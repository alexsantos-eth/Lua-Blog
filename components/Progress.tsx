// PROGRESS
// @ts-ignore
import NProgress from 'nprogress'

// ROUTER
import Router from 'next/router'
import { useEffect } from 'react'

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

const RouteNProgress: React.SFC<RouteNProgressProps> = (props: RouteNProgressProps) => {
	let timer: number

	const routeChangeStart = () => {
		NProgress.set(props.startPosition || defaultProps.startPosition)
		NProgress.start()
	}

	const routeChangeEnd = () => {
		clearTimeout(timer)
		timer = setTimeout(() => {
			NProgress.done(true)
		}, props.stopDelayMs || defaultProps.stopDelayMs)
	}

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
				display: 'block';
				position: fixed;
				z-index: 1031;
				top: 15px;
				right: 15px;
			}

			#nprogress .spinner-icon {
				width: 18px;
				height: 18px;
				box-sizing: border-box;
				border: solid 2px transparent;
				border-top-color: ${props.color || defaultProps.color};
				border-left-color: ${props.color || defaultProps.color};
				border-radius: 50%;
				-webkit-animation: nprogresss-spinner 400ms linear infinite;
				animation: nprogress-spinner 400ms linear infinite;
			}

			.nprogress-custom-parent {
				overflow: hidden;
				position: relative;
			}

			.nprogress-custom-parent #nprogress .spinner,
			.nprogress-custom-parent #nprogress .bar {
				position: absolute;
			}

			@-webkit-keyframes nprogress-spinner {
				0% {
					-webkit-transform: rotate(0deg);
				}
				100% {
					-webkit-transform: rotate(360deg);
				}
			}

			@keyframes nprogress-spinner {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}
		`}</style>
	)
}

export default RouteNProgress
