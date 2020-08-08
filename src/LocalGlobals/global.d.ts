// STRINGS
interface Lang {
	es: ILangPackage
}
interface ILangPackage {
	general: {
		title: string
		days: string[]
		months: string[]
	}
	navbar: {
		title: string
		searchPlaceholder: string
		routes: string[]
	}
	index: {
		postTitle: string
		postTitle_2: string
		postTitle_3: string
	}
	postPage: {
		subtitle: string
		related: string
		likes: string
		toast: string
		codeToast: string
		codeFooter: string
	}
	dictionaryPage: {
		title: string
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

// CONTENIDO DE SLICE
interface ISlice {
	image: any
	content: any
}

// INTERFAZ DE DOCUMENTOS DE FIRESTORE
interface LikeDoc {
	count: number[]
}

interface IPostItem {
	sys: {
		publishedAt: string
	}
	title: string
	tags: string[]
	url: string
	description: string
	author: string
	contentMd: string
	banner: {
		url: string
		title: string
	}
}

interface IPostsDB {
	post: IPostItem
	uid: string
}

// DB DE USUARIOS
interface IDictionaryDB {
	dict: any
	id: number
}

// DB DE COMENTARIOS
interface ICommentsDB {
	comments: any
	id: number
}

interface IUsersDB {
	user: any
	id: number
}
