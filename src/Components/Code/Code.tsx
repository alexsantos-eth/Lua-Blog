import React, { RefObject, useRef, useEffect } from 'react'
import './Monokai.css'

interface CodeProps {
	codeStr: string
	type: string
}

const Code: React.FC<CodeProps> = (props: CodeProps) => {
	// REFERENCIAS
	const codeRef: RefObject<HTMLElement> = useRef(null)

	// HIGHLIGHT
	useEffect(() => {
		import('prismjs').then(Prism => {
			if (codeRef.current) Prism.highlightElement(codeRef.current, true)
		})
	}, [])

	return (
		<pre>
			<code ref={codeRef} className={`language-${props.type}`}>
				{props.codeStr}
			</code>
		</pre>
	)
}

export default Code
