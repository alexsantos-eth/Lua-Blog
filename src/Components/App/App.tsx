// REACT Y ROUTER
import React, { Dispatch, SetStateAction, useEffect, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// CONTEXTO
import MainContext from 'Context/MainContext'

// DATA
import Posts from 'Data/Posts.json'
import Strings from 'Lang/Strings.json'

// PAGINAS Y LAZY
const Post = lazy(() => import('Pages/Post/Post'))
const Index = lazy(() => import('Pages/Index/Index'))
const NotFound = lazy(() => import('Pages/Error/NotFound'))
const Navbar = lazy(() => import('Components/Navbar/Navbar'))

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
		const isDark: boolean =
			window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
		if (isDark) window.localStorage.setItem('darkmode', '1')

		// CAMBIAR CSS
		import('Utils/Tools').then(({ toggleDarkMode }) => toggleDarkMode())

		// ACTUALIZAR APP
		setAppState({ lang: Strings.es, darkMode: currentDark })
	}, [])

	return (
		<MainContext.Provider value={{ ...appState, posts: Posts.postCollection.items }}>
			<Suspense
				fallback={
					<h1 style={{ textAlign: 'center', marginTop: '-30px' }}>Espera un momento ...</h1>
				}>
				<BrowserRouter>
					<Switch>
						<Route exact path='/' component={Index} />
						<Route exact path='/posts/:uid' component={Post} />
						<Route component={NotFound} />
					</Switch>

					<Navbar changeDarkMode={changeDarkMode} />
				</BrowserRouter>
			</Suspense>
		</MainContext.Provider>
	)
}

export default App
