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
	const darkValue: boolean = window.localStorage.getItem('darkmode') === '1'

	// RECORRER CAMBIOS
	import('LocalGlobals/Globals').then(({ colors }) =>
		colors.forEach((color: IColor) => changeColor(color, darkValue))
	)
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

// USAR RAF PARA SCROLL
export const scrollRAF = (cb: (scrollY: number) => any) => {
	// GLOBALES
	let latestKnownScrollY: number = 0
	let ticking: boolean = false

	// ANIMAR SCROLL
	const update = () => {
		// DETENER RECARGA
		ticking = false

		// ANIMAR
		cb(latestKnownScrollY)
	}

	// VERIFICAR RECARGA
	const requestTick = () => {
		// RAF
		if (!ticking) requestAnimationFrame(update)

		// HABILITAR RECARGA
		ticking = true
	}

	// EVENTO
	const onScroll = () => {
		// ASIGNAR ULTIMO VALOR DE SCROLL ANTES DE RECARGA
		latestKnownScrollY = window.scrollY

		// RECARGAR FRAME
		requestTick()
	}

	// AGREGAR EVENTO
	window.addEventListener('scroll', onScroll, false)
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

// COPIAR AL PORTAPAPELES
export const copyPath = (e: any, text: string) => {
	// EVITAR LINK
	e.preventDefault()

	// COPIAR
	import('Utils/Fx').then(({ showToast }) =>
		navigator.clipboard.writeText(window.location.href).then(() => showToast({ text }))
	)
}
