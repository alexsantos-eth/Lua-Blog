// =========== UI ============
// MOSTRAR TOAST
interface IToast {
	text: string
	actionText?: string
	onHide?: () => any
	action?: (e: MouseEvent) => void
	fixed?: boolean
}
export const showToast = (data: IToast) => {
	const allToast: NodeListOf<HTMLDivElement> = document.querySelectorAll('.toast') as NodeListOf<
		HTMLDivElement
	>
	const div: HTMLDivElement = document.createElement('div') as HTMLDivElement
	const span: HTMLDivElement = document.createElement('span') as HTMLDivElement
	const btn: HTMLButtonElement = document.createElement('button') as HTMLButtonElement

	// LIMPIAR TODOS LOS TOAST ANTERIORES
	allToast.forEach((el: HTMLDivElement) => document.body.removeChild(el))

	// AGREGAR CLASE
	div.classList.add('toast')
	if (data.actionText) div.classList.add('actionToast')

	// AGREGAR TEXTOS Y ACCIONES
	span.textContent = data.text
	btn.textContent = data.actionText || ''

	// EVENTO DE CLICK EN EL BOTÓN ACCIÓN
	btn.addEventListener('click', (e: MouseEvent) => {
		if (data.action) data.action(e)
		div.style.transform = 'translateY(100%)'
		setTimeout(() => {
			try {
				document.body.removeChild(div)
			} catch (err) {
				console.log(err)
			}
			if (data.onHide) data.onHide()
		}, 5300)
	})

	// AGREGAR DIV AL BODY
	div.appendChild(span)
	if (data.actionText) div.appendChild(btn)
	document.body.appendChild(div)

	// ANIMAR HACIA ARRIBA
	setTimeout(() => {
		div.style.transform = 'translateY(0)'
	}, 10)

	// NO ELIMINAR SI ES UN MENSAJE FIJO
	if (!data.fixed) {
		setTimeout(() => {
			div.style.transform = 'translateY(100%)'
		}, 5000)

		setTimeout(() => {
			try {
				document.body.removeChild(div)
			} catch (err) {
				console.log(err)
			}
			if (data.onHide) data.onHide()
		}, 5300)
	}
}

// MOSTRAR ALERTAS
interface AlertProps {
	type: 'confirm' | 'window' | 'alert' | 'input' | 'error'
	onHide?: () => any
	onConfirm?: () => any
	title: string
	body: string
	confirmBtn?: string
	cancelBtn?: string
	customElements?: string
	fixed?: boolean
}

export const showAlert = (props: AlertProps) => {
	// CREAR ELEMENTOS
	const alertContainer: HTMLDivElement = document.createElement('div')
	const alertShadow: HTMLDivElement = document.createElement('div')
	const alertContent: HTMLDivElement = document.createElement('div')
	const alertBody: HTMLDivElement = document.createElement('div')
	const actions: HTMLUListElement = document.createElement('ul')
	const liCancel: HTMLLIElement = document.createElement('li')
	const liConfirm: HTMLLIElement = document.createElement('li')
	const h1: HTMLHeadingElement = document.createElement('h1')
	const p: HTMLParagraphElement = document.createElement('p')
	const cancelBtn: HTMLButtonElement = document.createElement('button')
	const confirmBtn: HTMLButtonElement = document.createElement('button')

	// ASIGNAR CLASES
	alertContainer.classList.add('alertContainer')
	alertShadow.classList.add('alertShadow')
	alertContent.classList.add('alertContent')
	alertBody.classList.add('alertBody')
	actions.classList.add('alertActions')
	cancelBtn.classList.add('cancelBtn', 'waves', 'waves-dark')
	confirmBtn.classList.add('primary', 'waves')

	// ASIGNAR TEXTOS
	h1.textContent = props.title
	p.textContent = props.body
	cancelBtn.textContent = props.cancelBtn || 'Cancelar'
	confirmBtn.textContent = props.confirmBtn || 'Aceptar'

	// ASIGNAR EVENTOS
	const hideAlert = () => {
		alertShadow.style.pointerEvents = 'none'
		cancelBtn.style.pointerEvents = 'none'
		confirmBtn.style.pointerEvents = 'none'
		alertContainer.style.opacity = '0'
		setTimeout(() => {
			try {
				document.body.removeChild(alertContainer)
				if (props.onHide) props.onHide()
			} catch (err) {
				console.log(err)
			}
		}, 400)
	}

	if (!props.fixed) alertShadow.addEventListener('click', hideAlert)
	cancelBtn.addEventListener('click', hideAlert)
	confirmBtn.addEventListener('click', () => {
		if (props.onConfirm) props.onConfirm()
		hideAlert()
	})

	if (props.type === 'confirm') cancelBtn.style.display = 'block'

	// ASIGNAR AL DOM
	liConfirm.appendChild(confirmBtn)
	liCancel.appendChild(cancelBtn)
	actions.appendChild(liCancel)
	actions.appendChild(liConfirm)
	alertBody.appendChild(h1)
	alertBody.appendChild(p)
	if (props.customElements) {
		const ct: HTMLDivElement = document.createElement('div') as HTMLDivElement
		ct.innerHTML = props.customElements
		alertBody.appendChild(ct)
	}
	alertContent.appendChild(alertBody)

	if (props.type !== 'window') alertContent.appendChild(actions)

	alertContainer.appendChild(alertShadow)
	alertContainer.appendChild(alertContent)
	document.body.appendChild(alertContainer)
}
