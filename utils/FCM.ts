// FIRESTORE
import { sendToken } from './Firestore'

// INSTANCIA DE FIREBASE Y BASE DE DATOS LOCAL
import firebase from '../keys/firebase'

// FIREBASE AUTH, FIREBASE FIRESTORE, FIREBASE CLOUD MESSAGING, CLOUD FUNCTIONS
import 'firebase/messaging'

// =============== GLOBALS ===============
let fcmHandler: number = 0

// INICIAR NOTIFICACIONES
export const initFCM = () => {
	try {
		const messaging = firebase.messaging()
		if (fcmHandler === 0)
			messaging?.usePublicVapidKey(
				'BDM98MXqg-XsmTo9DYFfSp1lN61_4NcfYyYiBuQ_2RWtAu0z7w6XaeVMgraUfsPGcBnOKDb_d6NebCI18UJCefQ'
			)
		fcmHandler++
		return messaging
	} catch (err) {
		console.log(err)
	}
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
