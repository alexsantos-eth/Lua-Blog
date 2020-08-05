// FIREBASE AUTH, FIREBASE FIRESTORE, FIREBASE CLOUD MESSAGING, CLOUD FUNCTIONS
import 'firebase/firestore'

// INSTANCIA DE FIREBASE Y BASE DE DATOS LOCAL
import firebase from '../keys/firebase'

// INSTANCIA
export const db: firebase.firestore.Firestore = firebase.firestore()

// ENVIAR TOKEN A LA DB
export const sendToken = async (token: string) => {
	const tokens = await db.collection('tokens')
	return tokens.add({ upload: new Date().toUTCString(), token })
}

// OBTENER POSTS MAS POPULARES
const getSortPopular = async (docs: IPostItem[]) => {
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
		.map(doc => doc.id)

	// OBTENER DOCUMENTOS CON LIKES
	// @ts-ignore
	const pointedDocs: IPostItem[] = docs
		.map((_lDoc: IPostItem, index: number) => {
			// DOC TEMPORAL
			let tmpDoc: IPostItem | undefined

			// RECORRER IDS
			docs.forEach((fDoc: IPostItem) => {
				if (docUID[index] && fDoc.url === docUID[index]) tmpDoc = fDoc
			})

			// RETORNAR DOC
			return tmpDoc
		})
		.filter(Boolean)

	// ORDENAR
	return pointedDocs
}

// GUARDAR LIKES
export const saveLikes = async (uid: string, lCount: number) => {
	// OBTENER LIKES DE DOCUMENTO
	const likes = (await db
		.collection('likes')
		.doc(uid)
		.get()).data()

	// VERIFICAR SI EXISTEN LIKES
	let tmpCount: number[] = [lCount]

	if (likes) {
		// OBTENER CONTADORES
		const lDoc: LikeDoc = likes as LikeDoc

		// ASIGNAR NUEVO CONTADOR
		tmpCount = lDoc.count

		// AUMENTAR CONTADOR
		tmpCount.push(lCount)
	}

	return db
		.collection('likes')
		.doc(uid)
		.set({ count: tmpCount })
}

export default getSortPopular
