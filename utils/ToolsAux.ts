// UI
import { showAlert, showToast } from './Fx'
import { colors } from './Global'

// FORMATO PARA FECHAS
export const formateDate = (date: string | null, author: string) => {
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

export const updateApp = () => {
	// ACTUALIZAR APP
	if (window.navigator.serviceWorker) {
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
}

export const parseString = (str: string) =>
	str
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')

// CAMBIAR UN COLOR
const changeColor = (selectedColor: IColor, dark: boolean) => {
	// SELECCIONAR BODY
	const body: HTMLElement = document.body

	// CAMBIAR PROPIEDAD
	body.style.setProperty(selectedColor.name, dark ? selectedColor.darkValue : selectedColor.value)
}

// CAMBIAR TODOS
export const toggleDarkMode = () => {
	// LEER VARIABLE GLOBAL
	const darkValue: boolean = window.localStorage.getItem('darkMode') === '1'

	// RECORRER CAMBIOS
	colors.forEach((color: IColor) => changeColor(color, darkValue))
}

// CALCULAR PIXELS
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

// CALCULAR ALTURA MAXIMA
export const calculateScrollDistance = () => {
	// CALCULAR ALTO
	const windowHeight = window.innerHeight
	const docHeight = getDocHeight()

	// CALCULAR ESPACIO DE SCROLL
	const totalDocScrollLength = docHeight - windowHeight

	// RETORNAR TOTAL
	return totalDocScrollLength
}

// COPIAR AL PORTAPAPELES
export const copyPath = (e: any, text: string) => {
	// EVITAR LINK
	e.preventDefault()

	// COPIAR
	navigator.clipboard.writeText(window.location.href).then(() => showToast({ text }))
}

// AVANZAR A SECCIONES
export const goTo = (h: HTMLHeadingElement | null) => {
	// OBTENER DIMENSIONES
	const scroll: number = h?.getBoundingClientRect().top || 0
	const navHeight: number = parseInt(
		getComputedStyle(document.body).getPropertyValue('--navHeight').replace('px', ''),
		10
	)

	// AVANZAR
	window.scrollTo({
		top: window.scrollY + (scroll - navHeight - 10),
		behavior: 'smooth',
	})
}

// COMPARTIR EN FACEBOOK
export const shareLink = (ev: any, title: string, text: string) => {
	// VERIFICAR SI ESTA DISPONIBLE LA API
	if (navigator.share) {
		// EVITAR LINK
		ev.preventDefault()

		// COMPARTIR
		navigator
			.share({
				title,
				text,
				url: window.location.href,
			})
			.then(() => console.log('Successfully share'))
			.catch((error: Error) => console.log('Error sharing', error))
	}
}
