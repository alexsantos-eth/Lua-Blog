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

// LEER DE LOCAL
export const getPosts = async () => iLocalDB.posts.toArray()
