// CLIENTE DE PRISMIC
import ApiSearchResponse from 'prismic-javascript/types/ApiSearchResponse'
import Prismic from 'prismic-javascript'
import PrismicClient from '../prismic-configuration'

const fetchPosts = async () => {
	// LEER API
	const response: ApiSearchResponse = await PrismicClient.query(
		Prismic.Predicates.at('document.type', 'post'),
		{ orderings: '[document.first_publication_date desc]' }
	)

	// RETORNAR DOCUMENTOS
	return response.results
}

export default fetchPosts
