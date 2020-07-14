// TIPOS DE DATOS
import React from 'react'

// JSON DE LENGUAJES
import Strings from '../lang/Strings.json'

// PRISMIC
import { Document } from 'prismic-javascript/d.ts/documents'

// HOC GENERAL DE LA APLICACIÓN
interface AppContext {
	lang: ILangPackage
	darkMode: boolean
	setDocs: (docs: Document[]) => any
	docs: Document[]
}

// CONTEXTO
const defaultAppContext: AppContext = {
	lang: Strings.es,
	darkMode: false,
	setDocs: () => null,
	docs: [],
}

// CREAR CONTEXTO
const appContext: React.Context<AppContext> = React.createContext(defaultAppContext)

// EXPORTAR
export { appContext }
