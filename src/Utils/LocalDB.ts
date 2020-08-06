// BASE DE DATOS LOCAL
import Dexie from 'dexie'

export class LocalDB extends Dexie {
	// DECLARAR TABLAS
	posts: Dexie.Table<IPostsDB, string>
	users: Dexie.Table<IUsersDB, number>
	dict: Dexie.Table<IDictionaryDB, number>
	comments: Dexie.Table<ICommentsDB, number>

	// CONSTRUCTOR
	constructor() {
		super('localDB')

		// CREAR STORES
		this.version(1).stores({
			posts: 'uid, post',
			users: 'id, users',
			comments: 'id, comments',
			dict: 'id, dict',
		})

		// CREAR TABLAS
		this.posts = this.table('posts')
		this.users = this.table('users')
		this.comments = this.table('comments')
		this.dict = this.table('dict')
	}
}

// INSTANCIA DE BASE DE DATOS
const iLocalDB = new LocalDB()

export const initDB = () => iLocalDB.open()

// ACCIONES EN BASE LOCAL
// LIMPIAR POSTS
export const clearDocs = async () => iLocalDB.posts.clear()

// AGREGAR TODOS LOS POSTS
export const saveDocs = async (posts: IPostItem[]) => {
	// POSTS DE DOCUMENT[]
	const postsDB: IPostsDB[] = posts.map((item: IPostItem) => {
		return {
			uid: item.url || '',
			post: item,
		}
	})

	// GUARDAR
	iLocalDB.posts.bulkPut(postsDB)
}

// AGREGAR POST A LOCAL
export const pushDoc = async (post: IPostItem, uid: string) => iLocalDB.posts.put({ uid, post })

// LEER DE LOCAL
export const getPosts = async () => iLocalDB.posts.toArray()

// LEER UN POST
export const getPost = async (uid: string) => iLocalDB.posts.get(uid)

export const findByUID = (uid: string, items: IPostItem[]) => {
	// DOCUMENTO
	let doc: IPostItem | undefined

	// RECORRER DOCUMENTOS
	items.forEach((sDoc: IPostItem) => {
		if (sDoc.url === uid) doc = sDoc
	})

	// RETORNAR DOCUMENTO
	return doc
}
