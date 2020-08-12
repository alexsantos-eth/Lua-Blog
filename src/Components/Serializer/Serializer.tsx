// REACT
import React, { Suspense } from 'react'

// ROUTER
import { Link } from 'react-router-dom'

// PARSE HTML
import parse from 'html-react-parser'

// COMPONENTES
import ClipSkeleton from 'Components/ClipSkeleton/ClipSkeleton'
import Code from 'Components/Code/Code'

// TÍTULOS Y SUBTÍTULOS
export const GetTitles = (md?: string, sub?: boolean) => {
	if (md) {
		const lines: string[] = md ? md.split('\n') : ['']
		return lines
			.filter((line: string) => (sub ? line.startsWith('### ') : line.startsWith('## ')))
			.map((line: string) => (sub ? line.substr(3) : line.substr(2)))
	} else return ['']
}

// SERIALIZAR MARKDOWN
const Serializer = (md: string) => {
	// ENCONTRAR GRUPOS DE LISTAS Y BLOQUES
	let importHandler: boolean = false
	const isolate: RegExp = new RegExp(/(?=(?:[^```]*```[^```]*```)*[^```]*$)/)
	const joinRegexp = (exp: string | RegExp) =>
		new RegExp(new RegExp(exp).source + isolate.source, 'g')

	// EXPRESIONES REGULARES
	const italic = md.replace(joinRegexp(/\*(.+)\*/), '<em>$1</em>')
	const bold = italic.replace(joinRegexp(/__(.+)__/), '<strong>$1</strong>')
	const quote = bold.replace(joinRegexp(/(^> |\n> )(.+)/), '\n<blockquote>$1</blockquote>')
	const list = quote.replace(joinRegexp(/(^\* |\n\* )(.+)/), '\n<li>$2</li>')
	const h1 = list.replace(joinRegexp(/(^# |\n# )(.+)/), '\n<h1>$2</h1>')
	const h2 = h1.replace(joinRegexp(/(^## |\n## )(.+)/), '\n<h2>$2</h2>')
	const h3 = h2.replace(joinRegexp(/(^### |\n### )(.+)/), '\n<h3>$2</h3>')
	const anchor = h3.replace(
		joinRegexp(/\[(.*?)\]\((.*?)\)\((.*?)\)/),
		'<a href="$2" title="$3">$1</a>'
	)
	const br = anchor.replace(joinRegexp(/\n\n/), '\n<br></br>\n')
	const ul = br.replace(joinRegexp(/((\n?<li>.+<\/li>(\n?))+)/), '\n<ul>$1</ul>\n')
	const codeBlock = ul.replace(
		joinRegexp(/(```([a-z]*)(\n[\s\S]*?\n)```+)/),
		"<code lang='$2'><!-- $3 --></code>"
	)

	// PARSE
	const jsxArry: JSX.Element | JSX.Element[] = parse(codeBlock, {
		replace: domNode => {
			if (domNode.name === 'code') {
				// IMPORTAR ESTILOS UNA VEZ
				if (!importHandler) {
					importHandler = true
					require('Components/Code/Monokai.css')
				}

				// RETORNAR LAZY DE CODE
				return (
					<Suspense fallback={<ClipSkeleton />}>
						<Code
							codeStr={domNode.children ? domNode.children[0].data : ''}
							type={domNode.attribs ? domNode.attribs.lang : ''}
						/>
					</Suspense>
				)
			} else if (domNode.name === 'a' && !domNode.attribs?.href.includes('http'))
				return (
					<Link to={domNode.attribs?.href || '/'} title={domNode.attribs?.title || ''}>
						{domNode.children ? domNode.children[0].data : ''}
					</Link>
				)
		},
	})

	// RETORNAR ARRAY DE JSX
	return jsxArry
}

export default Serializer
