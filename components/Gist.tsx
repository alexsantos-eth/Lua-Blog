import { RefObject, useRef, useEffect, CSSProperties } from 'react'

// PROPIEDADES
interface GistProps {
	src: string
	theme?: 'monokai' | 'solarized-light'
	style?: CSSProperties
}

const getThemeID = (themeName: string) => {
	switch (themeName) {
		case 'monokai':
			return '848d6580'
		case 'solarized-light':
			return 'd49b91b3'
		default:
			return '848d6580'
	}
}

const Gist: React.FC<GistProps> = (props: GistProps) => {
	// ID DE GIST
	const id: string = props.src.substr(props.src.lastIndexOf('/') + 1).replace('.js', '')
	const url: string = 'https://gist.github.com/' + id + '.js'

	// REFERENCIA
	const frameRef: RefObject<HTMLIFrameElement> = useRef(null)

	useEffect(() => {
		// HTML
		const html: string = `<html><head><base target='_blank' /><link rel='stylesheet' href='https://cdn.rawgit.com/lonekorean/gist-syntax-themes/${getThemeID(
			props.theme || ''
		)}/stylesheets/${
			props.theme
		}.css' /></head><body onload="parent.document.getElementById('gist-${id}').style.height=document.body.scrollHeight + 'px'"><script src='${url}'></script></body></html>`

		// REFERENCIA DEL IFRAME
		const iframe = frameRef.current

		if (iframe) {
			// OBTENER CONTENIDO DEL IFRAME
			const doc = iframe.contentDocument || iframe.contentWindow?.window

			// ESCRIBIR HTML
			doc?.open()
			// @ts-ignore
			doc?.writeln(html)
			doc?.close()
		}
	}, [props.theme])

	return <iframe style={props.style} ref={frameRef} id={`gist-${id}`} />
}

export default Gist
