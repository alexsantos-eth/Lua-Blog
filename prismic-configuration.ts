// DEPENDENCIAS
import Prismic from 'prismic-javascript'
import { DefaultClient } from 'prismic-javascript/types/client'

// ENDPOINT Y CLIENTE
const apiEndpoint: string = 'https://lua-blog.prismic.io/api/v2'
const repo: string = 'lua-blog'
const PrismicClient: DefaultClient = Prismic.client(apiEndpoint)

export default PrismicClient
export { apiEndpoint, repo }
