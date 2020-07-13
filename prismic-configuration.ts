// DEPENDENCIAS
import * as Prismic from 'prismic-javascript'
import { DefaultClient } from 'prismic-javascript/d.ts/client'

// ENDPOINT Y CLIENTE
const apiEndpoint: string = 'https://lua-blog.prismic.io/api/v2'
const PrismicClient: DefaultClient = Prismic.client(apiEndpoint)

export default PrismicClient
