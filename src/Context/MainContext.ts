import { Context, createContext } from 'react'

import Posts from 'Data/Posts.json'
import Strings from 'Lang/Strings.json'

// KEYS
interface ContextProps {
	lang: ILangPackage
	darkMode: boolean
	posts: IPostItem[]
}

// VALOR POR DEFECTO
const DefContext: ContextProps = {
	lang: Strings.es,
	darkMode: true,
	posts: Posts.postCollection.items,
}

// CONTEXTO
const MainContext: Context<ContextProps> = createContext(DefContext)

export default MainContext
