// TIPOS DE DATOS Y HOOKS
import { useEffect, FC, Dispatch, SetStateAction, useState } from 'react'
import { showToast, toggleDarkMode, updateApp, requestPush, showAlert } from 'Tools'

// ANIMACIONES
import { AnimatePresence } from 'framer-motion'

// TEXTOS
import Strings from 'Strings'

// COMPONENTES
import Navbar from 'components/Navbar'
import RouteNProgress from 'components/Progress'

// CONTEXTO
import { appContext } from 'Ctx'
import { initDB } from 'utils/LocalDB'

// INTERFAZ DE ESTADO
interface LayoutState {
	darkMode: boolean
}

// ESTADO POR DEFECTO
const DefState: LayoutState = {
	darkMode: true,
}

const Layout: FC = (props: any) => {
	// ESTADO
	const [state, setState]: [LayoutState, Dispatch<SetStateAction<LayoutState>>] = useState(DefState)

	// OBTENER LENGUAJE
	const lang: ILangPackage = Strings['es']

	useEffect(() => {
		// INICIAR DB
		initDB()

		// ACTUALIZAR APP
		updateApp()

		// ESTADO DE CONEXIÓN
		const online = navigator.onLine

		// MOSTRAR ALERTA CUANDO RECUPERO LA CONEXIÓN
		window.addEventListener('online', () => showToast({ text: lang.Layout.toast.online }))
		// MOSTRAR ALERTA CUANDO PERDIÓ LA CONEXIÓN
		window.addEventListener('offline', () => showToast({ text: lang.Layout.toast.offline }))

		// DETECTAR CONEXIÓN AL ENTRAR
		if (!online) showToast({ text: lang.Layout.toast.online })

		// DARKMODE
		const drkLocal: string | null = window.localStorage.getItem('darkMode')
		if (!drkLocal) window.localStorage.setItem('darkMode', '1')
		// LEER CAMBIOS
		else {
			const darkMode: boolean = drkLocal === '1'
			toggleDarkMode()
			setState({ darkMode })
		}

		// PERMISO PARA NOTIFICACIONES
		if (!window.localStorage.getItem('token'))
			setTimeout(() => {
				showAlert({
					title: lang.Layout.alerts.title,
					body: lang.Layout.alerts.body,
					confirmBtn: lang.Layout.alerts.btn,
					type: 'confirm',
					onConfirm: requestPush,
				})
				requestPush()
			}, 3000)
	}, [])

	const changeDarkMode = () => {
		// OBTENER Y ASIGNAR
		const darkMode: boolean = window.localStorage.getItem('darkMode') === '1'
		window.localStorage.setItem('darkMode', darkMode ? '0' : '1')

		// CAMBIAR CSS
		toggleDarkMode()

		// ACTUALIZAR ESTADO
		setState({ darkMode: !darkMode })
	}

	return (
		<>
			<RouteNProgress />
			<Navbar changeDarkMode={changeDarkMode} darkMode={state.darkMode} />
			<AnimatePresence exitBeforeEnter>
				<appContext.Provider
					value={{
						lang,
						darkMode: state.darkMode,
						isEs: true,
					}}>
					<main>{props.children}</main>
				</appContext.Provider>
			</AnimatePresence>
		</>
	)
}

export default Layout
