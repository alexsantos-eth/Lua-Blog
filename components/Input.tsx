// HOOKS PARA REFERENCIA
import { useRef, FC, RefObject, MouseEvent } from 'react'

// VARIABLES GLOBALES
let visible: boolean = true

const Input: FC<InputProps> = (props: InputProps) => {
	// REFERENCIA AL INPUT ACTUAL
	const inp: RefObject<HTMLInputElement> = useRef(null)

	// AGREGAR COLOR A LABEL, HR, I CERCANOS AL INPUT
	const fx = () => {
		const label: HTMLElement = inp.current?.nextSibling as HTMLElement
		const hr: HTMLElement = label?.nextSibling as HTMLElement
		const i: HTMLElement = hr?.nextSibling as HTMLElement

		if (label && inp.current?.value.length === 0 && hr && i) {
			label.classList.toggle('aLabel')
			label.classList.toggle('dLabel')
			hr.classList.toggle('hrActive')
			hr.classList.toggle('hrDisabled')
			i.classList.toggle('iActive')
			i.classList.toggle('iDisabled')
		}
	}

	// BOTÓN DE MOSTRAR Y OCULTAR PARA INPUT DE CLAVE
	const visibles = (e: MouseEvent<HTMLSpanElement>) => {
		const el: HTMLSpanElement = e?.target as HTMLSpanElement
		if (visible && el) {
			el.textContent = 'visibility_off'
			inp.current?.setAttribute('type', 'text')
			visible = !visible
		} else if (el) {
			el.textContent = 'visibility'
			inp.current?.setAttribute('type', 'password')
			visible = !visible
		}
	}

	// ENVIAR LOS DATOS DEL INPUT A LA VALUE()
	const getText = () =>
		props.value({
			name: props.name,
			text: inp.current?.value.trim(),
		})

	// ASIGNAR VALOR POR DEFECTO
	if (inp.current && props.defValue) {
		fx()
		inp.current.value = props.defValue.toString()
		getText()
	}

	return (
		<>
			<div className='in'>
				<input
					ref={inp}
					type={props.type}
					id={props.name}
					name={props.name}
					onFocus={fx}
					onBlur={fx}
					onChange={getText}
					autoComplete=''
				/>
				<label htmlFor={props.name} className='dLabel'>
					{props.label}
				</label>
				<hr className='hrDisabled' />
				<i className={`iDisabled lni lni-${props.icon}`} />
				{props.type === 'password' ? <span onClick={visibles} className='lni lni-eye' /> : ''}
			</div>
			<span>{props.helper}</span>

			<style jsx>{`
				.in {
					position: relative;
					width: auto;
					height: auto;
					margin-top: 20px;
					display: flex;
					flex-direction: row-reverse;
					align-items: center;
				}

				.in i {
					transition: color 0.2s ease-in-out;
					position: absolute;
					left: 0;
					margin-top: -1px;
				}

				.in + span {
					position: relative;
					top: 5px;
					opacity: 0.7;
					margin-bottom: 30px;
					font-family: 'OpenSans';
					font-size: 13px;
					color: var(--postText);
				}

				.in > label {
					font-family: 'Manrope';
					position: absolute;
					transition: all 0.2s ease-in-out;
					font-weight: 500;
				}

				.in > span {
					font-family: 'OpenSans';
					position: absolute;
					right: 20px;
					color: var(--postText);
				}

				.dLabel {
					color: var(--postText);
					transform: translate(0, 0);
					font-size: 15px;
					left: 35px;
				}

				.in > input {
					appearance: none;
					font-size: 15px;
					color: var(--postText);
					background: transparent;
					box-shadow: none;
					outline: none;
					font-family: 'OpenSans' !important;
					border: none !important;
					border-bottom: 1.5px solid var(--postText) !important;
					padding: 15px 0 15px 35px;
					width: 100%;
					font-weight: 500;
					position: relative;
				}

				.in > input:-webkit-autofill + label {
					transform: translate(0, -200%);
					font-size: 13px;
					left: 0;
					color: var(--deepOrange);
				}

				.in > input:-webkit-autofill ~ hr {
					transform: scaleX(1);
				}

				.in > input:-webkit-autofill ~ i {
					color: var(--deepOrange);
				}

				.iActive {
					color: var(--deepOrange);
				}

				.iDisabled {
					color: var(--postText);
				}

				.in > hr {
					content: '';
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
					height: 1.5px;
					background: var(--deepOrange);
					transition: transform 0.4s ease-in-out;
					margin: 0;
					z-index: 3;
				}

				.hrDisabled {
					transform: scaleX(0);
				}

				.hrActive {
					transform: scaleX(1);
				}

				.aLabel {
					transform: translate(0, -200%);
					font-size: 13px;
					left: 0;
					color: var(--deepOrange);
				}
			`}</style>
		</>
	)
}

export default Input
