// STRINGS
interface Lang {
	es: ILangPackage
}
interface ILangPackage {
	general: {
		title: string
	}
	navbar: {
		title: string
		searchPlaceholder: string
		routes: string[]
	}
	index: {
		postTitle: string
		postTitle_2: string
	}
	postPage: {
		subtitle: string
		likes: string
		toast: string
	}

	layout: ILayoutStrings
}

interface ILayoutStrings {
	toast: {
		offline: string
		online: string
	}
	alerts: {
		title: string
		btn: string
		body: string
	}
}

interface IColor {
	name: string
	value: string
	darkValue: string
}
