// COMPONENTES
import Gist from 'components/Gist'

// @ts-ignore
import { RichText, Elements } from 'prismic-reactjs'

// SERIALIZAR JSX
// tslint:disable-next-line: only-arrow-functions
function htmlSerializer<T>(
	type: Elements[keyof Elements],
	element: any,
	content: string | null,
	children: T,
	key: number,
	darkMode: boolean
) {
	switch (type) {
		case Elements.paragraph:
			if (element.text === '') return <br key={key} />
			else return <p key={key}>{children}</p>
		case Elements.embed:
			if (element.oembed.embed_url.includes('gist.github.com'))
				return (
					<Gist
						key={key}
						src={element.oembed.embed_url}
						theme={darkMode ? 'monokai' : 'solarized-light'}
					/>
				)
			else {
				// @ts-ignore
				return <iframe title='Embedded' key={key} src={element.oembed.embed_url} loading='lazy' />
			}
		case Elements.hyperlink:
			return (
				<a
					key={key}
					target={element.data.target}
					href={element.data.url}
					rel='noreferrer noopener'
					title={content || ''}>
					{children}
				</a>
			)
	}
}

export default htmlSerializer
