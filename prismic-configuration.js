// DEPENDENCIAS
import * as Prismic from 'prismic-javascript'

// ENDPOINT Y CLIENTE
const apiEndpoint = 'https://lua-blog.prismic.io/api/v2'
const PrismicClient = Prismic.client(apiEndpoint)

export default PrismicClient
