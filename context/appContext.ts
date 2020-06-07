// TIPOS DE DATOS
import React from 'react'

// JSON DE LENGUAJES
import LangsPackages from '../lang/Strings.json'

// HOC GENERAL DE LA APLICACIÓN
interface AppContext {
	lang: ILangPackage
	darkMode: boolean
	isEs: boolean
}
const defaultAppContext: AppContext = {
	lang: LangsPackages.es,
	darkMode: true,
	isEs: true,
}

const appContext: React.Context<AppContext> = React.createContext(defaultAppContext)

export { appContext }
