// REACT
import { useEffect } from 'react'

// FIRESTORE
import { db, saveLikes } from './Firestore'

// OBTENER PROMEDIO DE LIKES
export const useLikesAverage = (uid: string, deps: any[], cb: (average: string) => any) => {
	useEffect(() => {
		// DOCUMENTO
		const doc = db.collection('likes').doc(uid)

		// OBSERVER
		const unsubscribe = doc.onSnapshot((snap) => {
			// OBTENER LIKES DE DOCUMENTO
			const likes = snap.data()

			// PROMEDIO
			let average: number = 0

			if (likes) {
				// OBTENER CONTADORES
				const lDoc: LikeDoc = likes as LikeDoc

				// TOTAL Y PROMEDIO
				average = lDoc.count.reduce((a: number, b: number) => a + b) / lDoc.count.length
			}

			cb(average.toFixed(2))
		})

		return () => unsubscribe()
	}, deps)
}

// PLUGIN DE LIKES
export const useLikes = (uid: string, query?: string) => {
	useEffect(() => {
		// LIKES
		const likeList: NodeListOf<HTMLElement> = document.querySelectorAll(
			query || '.post-page-likes > ul > li > i'
		) as NodeListOf<HTMLImageElement>

		// LIMPIAR/LLENAR LIKES
		const clearLikes = () =>
			likeList.forEach((likeF: HTMLElement) => (likeF.classList.value = 'lni lni-star'))
		const fillLikes = (likeN: number) =>
			likeList.forEach((likeS: HTMLElement, index: number) => {
				if (index <= likeN) likeS.classList.value = 'lni lni-star-filled'
			})

		// EVITAR HOVER
		let likeHandler: boolean = false

		// LLENAR DESDE LOCAL
		fillLikes(parseInt(window.localStorage.getItem(`like-${uid}`) || '', 10))

		// RECORRER LIKES
		likeList.forEach((like: HTMLElement) => {
			// OBTENER NUMERO DE LIKE
			const likeN: number = parseInt(like.getAttribute('data-like') || '', 10)

			// HOVER
			like.addEventListener('mouseover', () => {
				if (!likeHandler) {
					clearLikes()
					fillLikes(likeN)
				}
			})

			// SALIDA
			like.addEventListener('mouseout', () => {
				if (!likeHandler) clearLikes()
			})

			// GUARDAR LIKE
			like.addEventListener('click', () => {
				// CAMBIAR LIKES
				clearLikes()
				fillLikes(likeN)

				// GUARDAR EN LOCAL
				window.localStorage.setItem(`like-${uid}`, likeN.toString())

				// ENVIAR A FIREBASE
				saveLikes(uid, likeN + 1)
				likeHandler = true
			})
		})
	}, [])
}
