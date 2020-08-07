// REACT
import React, { RefObject, useRef, useEffect } from 'react'

// TEMA
import './Monokai.css'

// PLUGINS
import 'prismjs/plugins/match-braces/prism-match-braces.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'

interface CodeProps {
	codeStr: string
	type: string
}

const Code: React.FC<CodeProps> = (props: CodeProps) => {
	// REFERENCIAS
	const codeRef: RefObject<HTMLElement> = useRef(null)

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
		<pre className='line-numbers'>
			<span className='code-title'>{props.type.toUpperCase()}</span>
			<code ref={codeRef} className={`match-braces rainbow-braces language-${props.type}`}>
				{props.codeStr.trim()}
			</code>
		</pre>
	)
}

export default Code
