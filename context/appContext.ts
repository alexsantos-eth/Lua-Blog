// TIPOS DE DATOS
import { createContext } from 'react'

// JSON DE LENGUAJES
import Strings from '../lang/Strings.json'

// PRISMIC
import { Document } from 'prismic-javascript/types/documents'

// HOC GENERAL DE LA APLICACIÓN
interface AppContext {
	lang: ILangPackage
	darkMode: boolean
	setDocs: (docs: Document[]) => any
	setDict: (dic: Document | null) => any
	docs: Document[] | null
}

// CONTEXTO
const defaultAppContext: AppContext = {
	lang: Strings.es,
	darkMode: false,
	setDict: () => null,
	setDocs: () => null,
	docs: null,
}

// CREAR CONTEXTO
const appContext: React.Context<AppContext> = createContext(defaultAppContext)

// EXPORTAR
export { appContext }
