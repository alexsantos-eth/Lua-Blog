// REACT
import { useEffect } from 'react'

// OBTENER PROMEDIO DE LIKES
export const useLikesAverage = (uid: string, cb: (average: string) => any) => {
	useEffect(() => {
		import('Utils/Firestore').then(({ db }) => {
			// DOCUMENTO
			const doc = db.collection('likes').doc(uid)

			// OBSERVER
			const unsubscribe = doc.onSnapshot(snap => {
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
		})
	}, [uid, cb])
}

// PLUGIN DE LIKES
export const useLikes = (uid: string, query: string, filledClass: string) => {
	useEffect(() => {
		// LIMPIAR/LLENAR LIKES
		const clearLikes = (likeList: NodeListOf<HTMLElement>) =>
			likeList.forEach((likeF: HTMLElement) => (likeF.classList.value = ''))
		const fillLikes = (likeList: NodeListOf<HTMLElement>, likeN: number) =>
			likeList.forEach((likeS: HTMLElement, index: number) => {
				if (index <= likeN) likeS.classList.value = filledClass
			})

		// EVITAR HOVER
		let likeHandler: boolean = false

		// EVENTOS
		const mouseover = (likeList: NodeListOf<HTMLElement>, likeN: number) => () => {
			if (!likeHandler) {
				clearLikes(likeList)
				fillLikes(likeList, likeN)
			}
		}

		const mouseout = (likeList: NodeListOf<HTMLElement>) => () => {
			if (!likeHandler) clearLikes(likeList)
		}

		const click = (likeList: NodeListOf<HTMLElement>, likeN: number) => () => {
			// CAMBIAR LIKES
			clearLikes(likeList)
			fillLikes(likeList, likeN)

			// GUARDAR EN LOCAL
			window.localStorage.setItem(`like-${uid}`, likeN.toString())

			// ENVIAR A FIREBASE
			import('Utils/Firestore').then(({ saveLikes }) => {
				saveLikes(uid, likeN + 1)
				likeHandler = true
			})
		}

		// AGREGAR EVENTOS
		const handleListeners = (remove?: boolean) => {
			// LIKES
			const likeList: NodeListOf<HTMLElement> = document.querySelectorAll(query) as NodeListOf<
				HTMLElement
			>

			// RECORRER LIKES
			likeList.forEach((like: HTMLElement) => {
				// OBTENER NUMERO DE LIKE
				const likeN: number = parseInt(like.getAttribute('data-like') || '', 10)

				// HOVER
				if (!remove) {
					like.addEventListener('mouseover', mouseover(likeList, likeN))
					like.addEventListener('mouseout', mouseout(likeList))
					like.addEventListener('click', click(likeList, likeN))
				} else {
					// CLONAR Y LIMPIAR
					const clone = like.cloneNode(true) as HTMLElement
					clone.classList.value = ''

					// REMPLAZAR NODOS
					like.replaceWith(clone)
				}
			})

			// LLENAR DESDE LOCAL
			fillLikes(likeList, parseInt(window.localStorage.getItem(`like-${uid}`) || '', 10))
		}

		// AGREGAR EVENTOS
		handleListeners()

		// QUITAR EVENTOS
		return () => handleListeners(true)
	}, [uid, filledClass, query])
}
