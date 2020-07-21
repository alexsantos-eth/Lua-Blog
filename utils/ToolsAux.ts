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
