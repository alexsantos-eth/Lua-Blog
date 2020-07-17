// REACT
import {
	useEffect,
	Dispatch,
	SetStateAction,
	useState,
	ComponentProps,
	MutableRefObject,
	useRef,
	useCallback,
} from 'react'

// ANIMACIONES
import { AnimatePresence } from 'framer-motion'

// TEXTOS
import Strings from 'lang/Strings.json'

// COMPONENTES
import RouteNProgress from 'components/Progress'
import Navbar from 'components/Navbar'

// CONTEXTO
import { appContext } from 'context/appContext'

// HERRAMIENTAS
import { requestPush, initFCM, toggleDarkMode } from 'utils/Tools'
import { showAlert, showToast } from 'utils/Fx'

// PRISMIC
import { Document } from 'prismic-javascript/types/documents'

// ESTADO
interface AppState {
	docs: Document[] | null
	darkMode: boolean
}

// ESTADO POR DEFECTO
const DefState: AppState = {
	docs: null,
	darkMode: false,
}

const Layout: React.FC = (props: ComponentProps<React.FC>) => {
	// STRINGS
	const lang: ILangPackage = Strings.es

	// ESTADO
	const [state, setDocs]: [AppState, Dispatch<SetStateAction<AppState>>] = useState(DefState)

	// REFERENCIAS
	const docsRef: MutableRefObject<Document[] | null> = useRef(null)

	useEffect(() => {
		// INICIAR FCM
		initFCM()

		// NO MOSTRAR MENSAJE DE PWA
		window.addEventListener('beforeinstallprompt', (e) => e.preventDefault())

		// ESTADO DE CONEXIÓN
		const online = navigator.onLine

		// MOSTRAR ALERTA CUANDO RECUPERO LA CONEXIÓN
		window.addEventListener('online', () => showToast({ text: lang.layout.toast.online }))

		// MOSTRAR ALERTA CUANDO PERDIÓ LA CONEXIÓN
		window.addEventListener('offline', () => showToast({ text: lang.layout.toast.offline }))

		// DETECTAR CONEXIÓN AL ENTRAR
		if (!online) showToast({ text: lang.layout.toast.offline })

		// PERMISO PARA NOTIFICACIONES
		setTimeout(() => {
			if (!window.localStorage.getItem('token'))
				showAlert({
					title: lang.layout.alerts.title,
					body: lang.layout.alerts.body,
					confirmBtn: lang.layout.alerts.btn,
					type: 'confirm',
					onConfirm: requestPush,
				})
		}, 3000)
	}, [])

	useEffect(() => {
		// OBTENER VALOR ACTUAL
		const currentDark: boolean = window.localStorage.getItem('darkMode') === '1'

		// CAMBIAR CSS
		toggleDarkMode()

		// ACTUALIZAR APP
		setDocs({ docs: docsRef.current, darkMode: currentDark })
	}, [docsRef.current])

	// ACTUALIZAR DOCUMENTOS
	const updateDocs = (docs: Document[]) => {
		docsRef.current = docs
		setDocs({ darkMode: state.darkMode, docs })
	}

	// CAMBIAR DARKMODE
	const changeDarkMode = useCallback(() => {
		// OBTENER VALOR ACTUAL
		const currentDark: boolean = window.localStorage.getItem('darkMode') === '1'

		// CAMBIAR NUEVO VALOR
		window.localStorage.setItem('darkMode', currentDark ? '0' : '1')

		// CAMBIAR CSS
		toggleDarkMode()

		// ACTUALIZAR APP
		setDocs({ docs: docsRef.current, darkMode: !currentDark })
	}, [docsRef.current])

	return (
		<>
			<RouteNProgress />
			<AnimatePresence exitBeforeEnter>
				<appContext.Provider
					value={{
						lang,
						docs: state.docs,
						setDocs: updateDocs,
						darkMode: state.darkMode,
					}}>
					<Navbar docs={state.docs} darkMode={state.darkMode} changeDarkMode={changeDarkMode} />
					<main>{props.children}</main>
				</appContext.Provider>
			</AnimatePresence>
		</>
	)
}

export default Layout
