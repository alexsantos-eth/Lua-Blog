// REACT
import React from 'react'
import { render, hydrate } from 'react-dom'

// ESTILOS
import './index.scss'

// SERVICE WORKER
import * as sw from './serviceWorker'

// COMPONENTES
import App from 'Components/App/App'

// RENDER
const root: HTMLDivElement | null = document.getElementById('root') as HTMLDivElement
const app: JSX.Element = <App />

// RECARGAR
if (root.hasChildNodes()) hydrate(app, root)
else render(app, root)

// REGISTRAR
sw.register()
