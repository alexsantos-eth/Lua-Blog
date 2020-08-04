const toCamelCase = (text: string) => text.replace(text.charAt(0), text.charAt(0).toUpperCase())

// COLORES
interface IPColor {
	name: string
	value: string
}

// COLORES PRIMARIOS
const primaryColors: IPColor[] = [
	{ name: '--orange', value: '#f07816' },
	{ name: '--pink', value: '#e60f71' },
	{ name: '--black', value: '#160f30' },
	{ name: '--white', value: '#fff' },
	{ name: '--bone', value: '#f5f5f5' },
	{ name: '--purple', value: '#481380' },
	{ name: '--deepOrange', value: '#ff5722' },
]

// COLORES INMUTABLES
const baseColors: IColor[] = [
	{
		name: '--primary',
		value: '#160F30',
		darkValue: '#fff',
	},
	{
		name: '--invertedPrimary',
		value: '#fff',
		darkValue: '#160F30',
	},
	{
		name: '--shadow',
		darkValue: 'rgba(0, 0, 0, .4)',
		value: 'rgba(255, 255, 255, .4)',
	},
]

// PERMUTACIÓN DE COLORES
const colorPer: IColor[] = []

// RECORRER COLORES
primaryColors.forEach((pColor: IPColor) => {
	// RECORRER COLORES
	primaryColors.forEach((pSColor: IPColor) =>
		colorPer.push({
			name:
				pColor.name === pSColor.name
					? pColor.name
					: `${pColor.name}${toCamelCase(pSColor.name.substr(2))}`,
			value: pColor.value,
			darkValue: pSColor.value,
		})
	)
})

// COLORES FINALES
const colors: IColor[] = baseColors.concat(colorPer)

// DARKMODE
export const isDark: boolean =
	window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

// EXPORTACIONES
export { colors }
