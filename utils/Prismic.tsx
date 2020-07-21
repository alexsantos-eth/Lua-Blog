// CLIENTE DE PRISMIC
import ApiSearchResponse from 'prismic-javascript/types/ApiSearchResponse'
import Prismic from 'prismic-javascript'
import PrismicClient from '../prismic-configuration'
import { Document } from 'prismic-javascript/types/documents'

const fetchPosts = async () => {
	// LEER API
	const response: ApiSearchResponse = await PrismicClient.query(
		Prismic.Predicates.at('document.type', 'post'),
		{ orderings: '[document.first_publication_date desc]' }
	)

	// RETORNAR DOCUMENTOS
	return response.results
}

// DICCIONARIO
const fetchDictionary = async () => {
	// LEER API
	const response: Document = await PrismicClient.getSingle('dictionary', {})

	// RETORNAR DOCUMENTO
	return response
}

// OBTENER LINK CON UID
const linkResolver = (doc: Document, item?: ISlice) => {
	if (doc.type === 'dictionary') return '/diccionario#' + item?.content[0].text
	else if (doc.type === 'post') return '/posts/' + doc.uid
	return '/'
}

// OBTENER URL CON UID
const hrefResolver = (doc: Document) => {
	if (doc.type === 'post') return '/posts/[uid]'
	else if (doc.type === 'page') return '/page/[uid]'
	else return '/'
}

export default fetchPosts
export { fetchDictionary, linkResolver, hrefResolver }
