// INSTANCIA DE FIREBASE Y BASE DE DATOS LOCAL
import firebase from '../keys/firebase'

// FIREBASE AUTH, FIREBASE FIRESTORE, FIREBASE CLOUD MESSAGING, CLOUD FUNCTIONS
import 'firebase/firestore'
import 'firebase/messaging'

// RESOLVER LINKS
import { Document } from 'prismic-javascript/d.ts/documents'

// CLIENT SIDE
import { showAlert, showToast } from './Fx'
import { useEffect } from 'react'
import { colors } from './Global'

// =============== GLOBALS ===============
const db: firebase.firestore.Firestore = firebase.firestore()
let fcmHandler: number = 0

// =========== NOTIFICACIONES ============
// INICIAR NOTIFICACIONES
export const initFCM = () => {
	const messaging = firebase.messaging()
	if (fcmHandler === 0)
		messaging?.usePublicVapidKey(
			'BDM98MXqg-XsmTo9DYFfSp1lN61_4NcfYyYiBuQ_2RWtAu0z7w6XaeVMgraUfsPGcBnOKDb_d6NebCI18UJCefQ'
		)
	fcmHandler++
	return messaging
}

// ENVIAR TOKEN A LA DB
export const sendToken = async (token: string) => {
	const tokens = await db.collection('tokens')
	return tokens.add({ upload: new Date().toUTCString(), token })
}

// CAMBIAR UN COLOR
const changeColor = (selectedColor: IColor, dark: boolean) => {
	// SELECCIONAR BODY
	const body: HTMLElement = document.body

	// CAMBIAR PROPIEDAD
	body.style.setProperty(selectedColor.name, dark ? selectedColor.darkValue : selectedColor.value)
}

// CAMBIAR TODOS
const toggleDarkMode = () => {
	// LEER VARIABLE GLOBAL
	const darkValue: boolean = window.localStorage.getItem('darkMode') === '1'

	// RECORRER CAMBIOS
	colors.forEach((color: IColor) => changeColor(color, darkValue))
}

// PEDIR PERMISO PARA NOTIFICAR
export const requestPush = () => {
	const messaging = initFCM()
	if (messaging)
		messaging
			.requestPermission()
			.then(async () => {
				// OBTENER TOKEN
				const token: string | undefined = await messaging?.getToken()

				// ENVIAR TOKEN AL SERVIDOR
				sendToken(token || '').then(() => window.localStorage.setItem('token', token || ''))
			})

			// NO EXISTE PERMISO DEL USUARIO
			.catch((err: Error) => {
				console.log('Unable to get permission to notify.', err)
			})
}

export const getRandomInt = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min)) + min

export const updateApp = () => {
	// ACTUALIZAR APP
	window.navigator.serviceWorker
		.getRegistration()
		.then((reg: ServiceWorkerRegistration | undefined) => {
			reg?.addEventListener('updatefound', () => {
				const worker = reg.installing
				worker?.addEventListener('statechange', () => {
					if (worker.state === 'installed') {
						showAlert({
							type: 'confirm',
							body: 'Hay una nueva actualización disponible, ¿deseas actualizar?',
							title: 'Nueva actualización',
							confirmBtn: 'Recargar',
							onConfirm: () => window.location.reload(),
						})
						worker.postMessage({ type: 'SKIP_WAITING' })
					}
				})
			})
		})
}

// OBTENER LINK CON UID
const linkResolver = (doc: Document) => {
	if (doc.type === 'page') return '/page/' + doc.uid
	else if (doc.type === 'post') return '/posts/' + doc.uid
	return '/'
}

// OBTENER URL CON UID
const hrefResolver = (doc: Document) => {
	if (doc.type === 'post') return '/posts/[uid]'
	else if (doc.type === 'page') return '/page/[uid]'
	else return '/'
}

// FORMATO PARA FECHAS
const formateDate = (date: string | null, author: string) => {
	// FECHA
	const pubDate: Date = new Date(date || '')

	// MESES Y DIAS
	const months: string[] = [
		'Enero',
		'Febrero',
		'Marzo',
		'Abril',
		'Mayo',
		'Junio',
		'Julio',
		'Agosto',
		'Septiembre',
		'Octubre',
		'Noviembre',
		'Diciembre',
	]
	const daysStr: string[] = [
		'Domingo',
		'Lunes',
		'Martes',
		'Miércoles',
		'Jueves',
		'Viernes',
		'Sábado',
	]

	// RETORNAR STRINGS
	return `${author} | ${daysStr[pubDate.getDay()]} ${pubDate.getDate()} de ${
		months[pubDate.getMonth()]
	} del ${pubDate.getFullYear()}, ${pubDate.getHours()}:${pubDate.getMinutes()} (GMT-6)`
}

interface LikeDoc {
	count: number[]
}

// GUARDAR LIKES
const saveLikes = async (uid: string, lCount: number) => {
	// OBTENER LIKES DE DOCUMENTO
	const likes = await (await db.collection('likes').doc(uid).get()).data()

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

	return db.collection('likes').doc(uid).set({ count: tmpCount })
}

// OBTENER PROMEDIO DE LIKES
const getLikesAverage = (uid: string, deps: any[], cb: (average: string) => any) => {
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

// OBTENER POSTS MAS POPULARES
const getSortPopular = async (docs: Document[]) => {
	// OBTENER DOCUMENTOS
	const docLikes = await (await db.collection('likes').get()).docs

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

const getDocHeight = () => {
	return Math.max(
		document.body.scrollHeight,
		document.documentElement.scrollHeight,
		document.body.offsetHeight,
		document.documentElement.offsetHeight,
		document.body.clientHeight,
		document.documentElement.clientHeight
	)
}

const calculateScrollDistance = () => {
	const windowHeight = window.innerHeight
	const docHeight = getDocHeight()

	const totalDocScrollLength = docHeight - windowHeight

	return totalDocScrollLength
}

// COPIAR AL PORTAPAPELES
const copyPath = (e: any, text: string) => {
	// EVITAR LINK
	e.preventDefault()

	// COPIAR
	navigator.clipboard.writeText(window.location.href).then(() => showToast({ text }))
}

const sendLikes = (uid: string, query?: string) => {
	// ASSETS
	const likeSrc: string = '/images/posts/like.png'
	const likeSrcFilled: string = '/images/posts/like-filled.png'

	useEffect(() => {
		// LIKES
		const likeList: NodeListOf<HTMLImageElement> = document.querySelectorAll(
			query || '.post-page-likes > ul > li > img'
		) as NodeListOf<HTMLImageElement>

		// LIMPIAR/LLENAR LIKES
		const clearLikes = () => likeList.forEach((likeF: HTMLImageElement) => (likeF.src = likeSrc))
		const fillLikes = (likeN: number) =>
			likeList.forEach((likeS: HTMLImageElement, index: number) => {
				if (index <= likeN) likeS.src = likeSrcFilled
			})

		// EVITAR HOVER
		let likeHandler: boolean = false

		// LLENAR DESDE LOCAL
		fillLikes(parseInt(window.localStorage.getItem(`like-${uid}`) || '', 10))

		// RECORRER LIKES
		likeList.forEach((like: HTMLImageElement) => {
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

const parseString = (str: string) =>
	str
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')

export {
	parseString,
	sendLikes,
	linkResolver,
	hrefResolver,
	formateDate,
	saveLikes,
	getLikesAverage,
	getSortPopular,
	calculateScrollDistance,
	toggleDarkMode,
	copyPath,
}
