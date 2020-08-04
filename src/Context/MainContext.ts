import { Context, createContext } from 'react'

// STRINGS
import Strings from 'Lang/Strings.json'

// KEYS
interface ContextProps {
	lang: ILangPackage
	darkMode: boolean
}

// VALOR POR DEFECTO
const DefContext: ContextProps = { lang: Strings.es, darkMode: false }

// CONTEXTO
const MainContext: Context<ContextProps> = createContext(DefContext)

export default MainContext
