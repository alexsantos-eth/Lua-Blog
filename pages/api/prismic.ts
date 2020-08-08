// CLIENTE DE PRISMIC
import Prismic from 'prismic-javascript'
import PrismicClient from 'prismic-configuration'

// TIPOS
import ApiSearchResponse from 'prismic-javascript/d.ts/ApiSearchResponse'
import { NextApiRequest, NextApiResponse } from 'next'
import { Document } from 'prismic-javascript/d.ts/documents'

// @ts-ignore
import { RichText } from 'prismic-reactjs'

// FUNCIONES
export default (req: NextApiRequest, res: NextApiResponse) => {
	// OBTENER CLAVE
	const secret: string | null = req.body.secret

	// VERIFICAR CLAVE
	if (secret === 'LU43!#5PostP') {
		// OBTENER DOCUMENTOS
		PrismicClient.query(Prismic.Predicates.at('document.type', 'post'), {
			orderings: '[document.first_publication_date desc]',
			pageSize: 1,
		}).then((response: ApiSearchResponse) => {
			// DOCUMENTO
			const doc: Document = response.results[0]

			// MENSAJE
			const data = {
				title: RichText.asText(doc.data.title),
				message: RichText.asText(doc.data.description),
				url: doc.uid,
			}

			// ENVIAR NOTIFICACIONES
			fetch('https://us-central1-luadevstudio-blog.cloudfunctions.net/sendPush', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
				mode: 'cors',
				cache: 'default',
			}).then(() => {
				res.send('Successfully send push message')
			})
		})
	} else res.status(300).send('Error: secret not valid')
}
