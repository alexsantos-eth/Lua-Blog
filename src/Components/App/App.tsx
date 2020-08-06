import { BrowserRouter, Route, Switch } from 'react-router-dom'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import Index from 'Pages/Index/Index'
import MainContext from 'Context/MainContext'
import Navbar from 'Components/Navbar/Navbar'
import Posts from 'Data/Posts.json'
import Strings from 'Lang/Strings.json'

// ESTADO
interface AppState {
	lang: ILangPackage
	darkMode: boolean
}

// ESTADO POR DEFECTO
const DefState: AppState = {
	lang: Strings.es,
	darkMode: false,
}

const App: React.FC = () => {
	// ESTADO
	const [appState, setAppState]: [AppState, Dispatch<SetStateAction<AppState>>] = useState(DefState)

	// CAMBIAR DARKMODE
	const changeDarkMode = () => {
		// DARKMODE ACTUAL
		const currentDarkMode: boolean = window.localStorage.getItem('darkmode') === '1' || false

		// CAMBIAR EN LOCAL
		window.localStorage.setItem('darkmode', currentDarkMode ? '0' : '1')

		// CAMBIAR CSS
		import('Utils/Tools').then(({ toggleDarkMode }) => toggleDarkMode())

		// ACTUALIZAR ESTADO
		setAppState((prevState: AppState) => ({ ...prevState, darkMode: !currentDarkMode }))
	}

	// CAMBIAR DARKMODE DE INICIO
	useEffect(() => {
		// OBTENER VALOR ACTUAL
		const currentDark: boolean = window.localStorage.getItem('darkmode') === '1'

		// DETECTAR TEMA DE OS
		import('LocalGlobals/Globals').then(({ isDark }) =>
			isDark ? window.localStorage.setItem('darkmode', '1') : null
		)

		// CAMBIAR CSS
		import('Utils/Tools').then(({ toggleDarkMode }) => toggleDarkMode())

		// ACTUALIZAR APP
		setAppState({ lang: Strings.es, darkMode: currentDark })
	}, [])

	return (
		<MainContext.Provider value={{ ...appState, posts: Posts.postCollection.items }}>
			<BrowserRouter>
				<Switch>
					<Route exact path='/' component={Index} />
				</Switch>
				<Navbar changeDarkMode={changeDarkMode} />
			</BrowserRouter>
		</MainContext.Provider>
	)
}

export default App
