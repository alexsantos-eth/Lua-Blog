import { useEffect } from 'react'

// PROPIEDADES
interface Props {
	title: string
	desc: string
	keys: string[]
	banner: string
	url: string
}

const useMetas = (props: Props) => {
	useEffect(() => {
		// SELECCIONAR METAS Y LINK
		const title = document.querySelector('title')
		const metas = document.querySelectorAll('meta[data-refresh=true]')
		const linkCanonical = document.querySelector('link[data-refresh=true]')

		if (linkCanonical && title && metas) {
			// ASIGNAR LINK Y TITULO
			linkCanonical.setAttribute('href', `https://bloq.wearelua.com/${props.url}`)
			title.textContent = props.title

			// RECORRER METAS
			metas.forEach((meta: Element, key: number) => {
				// METAS DE TITULO
				if (key < 5) meta.setAttribute('content', props.title)
				// METAS DE DESCRIPCIONES
				else if (key >= 5 && key < 8) meta.setAttribute('content', props.desc)
				// METAS DE IMÁGENES
				else if (key >= 8 && key < 11)
					meta.setAttribute(
						'content',
						props.banner === '' ? 'https://bloq.wearelua.com/images/banner.jpg' : props.banner
					)
				// METAS DE URLS
				else if (key >= 11 && key < 13)
					meta.setAttribute('content', `https://bloq.wearelua.com/${props.url}`)
				// METAS DE KEYWORDS
				else meta.setAttribute('content', props.keys.join(', '))
			})
		}
	}, [props])
}

export default useMetas
