// REACT
import React, { RefObject, useRef, useEffect, useContext, MouseEvent } from 'react'

// PLUGINS
import 'prismjs/plugins/match-braces/prism-match-braces.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

// ICONOS
import { Copy } from 'react-feather'
import MainContext from 'Context/MainContext'

interface CodeProps {
	codeStr: string
	type: string
}

const Code: React.FC<CodeProps> = (props: CodeProps) => {
	// CONTEXTO
	const { lang } = useContext(MainContext)

	// REFERENCIAS
	const codeRef: RefObject<HTMLElement> = useRef(null)

	// COPIAR CÓDIGO
	const copyCode = (e: MouseEvent<HTMLOrSVGElement>) => {
		import('Utils/Tools').then(({ copyToClipboard }) =>
			copyToClipboard(e, lang.postPage.codeToast, codeRef.current?.textContent || '')
		)
	}

	// HIGHLIGHT
	useEffect(() => {
		const highlight = async () => {
			// PRISM
			const Prism = await import('prismjs')

			// PLUGINS
			require('prismjs/plugins/line-numbers/prism-line-numbers')
			require('prismjs/plugins/match-braces/prism-match-braces')

			// TSX
			if (props.type === 'tsx' || props.type === 'jsx') {
				require('prismjs/components/prism-typescript')
				require('prismjs/components/prism-jsx')
				require('prismjs/components/prism-tsx')
			} else require(`prismjs/components/prism-${props.type}`)

			// HIGHLIGHT
			if (codeRef.current) Prism.highlightElement(codeRef.current, false)
		}

		highlight()
	}, [props.type])

	return (
		<div className='codeBlock'>
			<span className='code-title'>{props.type.toUpperCase()}</span>
			<pre className='line-numbers'>
				<code ref={codeRef} className={`match-braces rainbow-braces language-${props.type}`}>
					{props.codeStr.trim()}
				</code>
			</pre>
			<Copy style={{marginBottom:props.codeStr.split('\n').length === 3?'15px':'22px'}} className='codeIcon' onClick={copyCode} />
			<span className='codeFooter'>{lang.postPage.codeFooter}</span>
		</div>
	)
}

export default Code
