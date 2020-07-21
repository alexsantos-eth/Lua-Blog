// INSTANCIA DE FIREBASE Y BASE DE DATOS LOCAL
import firebase from '../keys/firebase'

// FIREBASE AUTH, FIREBASE FIRESTORE, FIREBASE CLOUD MESSAGING, CLOUD FUNCTIONS
import 'firebase/firestore'

// PRISMIC
import { Document } from 'prismic-javascript/types/documents'

// INSTANCIA
const db: firebase.firestore.Firestore = firebase.firestore()

// ENVIAR TOKEN A LA DB
export const sendToken = async (token: string) => {
	const tokens = await db.collection('tokens')
	return tokens.add({ upload: new Date().toUTCString(), token })
}

// INTERFAZ DE DOCUMENTOS DE FIRESTORE
interface LikeDoc {
	count: number[]
}

// OBTENER POSTS MAS POPULARES
const getSortPopular = async (docs: Document[]) => {
	// OBTENER DOCUMENTOS
	const docLikes = (await db.collection('likes').get()).docs

	// OBTENER IDS
	const docUID: string[] = docLikes
		.sort((a, b) => {
			// DOCUMENTOS
			const aTmp = a.data() as LikeDoc
			const bTmp = b.data() as LikeDoc

			// OBTENER PROMEDIOS
			const aAvrg = aTmp.count.reduce((aV, bV) => aV + bV) / aTmp.count.length
			const bAvrg = bTmp.count.reduce((aV, bV) => aV + bV) / bTmp.count.length

			// ORDENAR PROMEDIOS
			return bAvrg - aAvrg
		})
		.map((doc) => doc.id)

	// OBTENER DOCUMENTOS CON LIKES
	// @ts-ignore
	const pointedDocs: Document[] = docs
		.map((_lDoc: Document, index: number) => {
			// DOC TEMPORAL
			let tmpDoc: Document | undefined

			// RECORRER IDS
			docs.forEach((fDoc: Document) => {
				if (docUID[index] && fDoc.uid === docUID[index]) tmpDoc = fDoc
			})

			// RETORNAR DOC
			return tmpDoc
		})
		.filter(Boolean)

	// ORDENAR
	return pointedDocs
}

export default getSortPopular
