// GLOBALES
import { colors } from 'LocalGlobals/Globals'

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
