import React from 'react'
import 'prismjs'

// @ts-ignore
import PrismCode from 'react-prism'
import 'prismjs/themes/prism-tomorrow.css'

interface CodeProps {
	codeStr: string
	type: string
}

const Code: React.FC<CodeProps> = (props: CodeProps) => {
	return <PrismCode className={`language-${props.type}`}>{props.codeStr}</PrismCode>
}

export default Code
