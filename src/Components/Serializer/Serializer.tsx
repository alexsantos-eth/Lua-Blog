// REACT
import React, { Suspense } from 'react'
import {Link} from 'react-router-dom'

// COMPONENTES
import ClipSkeleton from 'Components/ClipSkeleton/ClipSkeleton';

// BLOQUES
const Code = React.lazy(() => import('Components/Code/Code'));

// TÍTULOS Y SUBTÍTULOS
export const GetTitles = (md?: string, sub?: boolean) => {
	if(md){
	const lines: string[] = md?.split('\n')
	return lines.filter((line: string) => (sub ? line.startsWith('### ') : line.startsWith('## '))).map((line:string) => sub?line.substr(3):line.substr(2))
	} else return ['']
}

// SERIALIZAR MARKDOWN
const Serializer = (md: string) => {
	// SEPARAR LINEAS
	const lines: string[] = md.split('\n')

	// TEMPORALES
	let codeTagToggle: boolean = false
	let tempCodeString: string = ''
	let codeLang: string = ''
	let codeCounts: number = 0

	// RENDER JSX[]
	const render: (JSX.Element | null)[] = lines.map((line: string, key: number) => {

		// CODE
		if (line.startsWith('```')) {
			if (!codeTagToggle) codeLang = line.substr(3)
			codeTagToggle = !codeTagToggle
			codeCounts++
		}

		// ABRIR FRAGMENT
		if (codeTagToggle) {
			tempCodeString += lines[key + 1] + '\n'
			return null
		}

		// CERRAR FRAGMENTO
		else if (tempCodeString.length) {
			// GUARDAR Y RECORTAR FRAGMENTO
			const codeCopy: string = tempCodeString.substr(0, tempCodeString.lastIndexOf('```'))
			tempCodeString = ''

			// RETORNAR ELEMENTO
			return (
				<Suspense key={`Post_${key}_pre`} fallback={<ClipSkeleton style={{margin: '40px 0'}}/>}>
					<Code codeStr={codeCopy} type={codeLang}/>
				</Suspense>
			)
		}

		// BREAKS
		else if (line === '') return <br key={`Post_${key}_br`} />

		// HEADINGS
		else if (line.startsWith('# ')) return <h1 id={line.replace(/ /g, '-').substr(5)} key={`Post_${key}_h1`}>{line.substr(3)}</h1>
		else if (line.startsWith('## ')) return <h2 id={line.replace(/ /g, '-').substr(6)} key={`Post_${key}_h2`}>{line.substr(3)}</h2>
		else if (line.startsWith('### ')) return <h3 id={line.replace(/ /g, '-').substr(8)} key={`Post_${key}_h3`}>{line.substr(3)}</h3>

		// LINKS
		else if(line.includes('](')){
			// GLOBALES
			const index:(string | JSX.Element)[] = []
			let tmpAnchors:string= ''

			// OBTENER INDEX DE TODAS LAS OCURRENCIAS
			line.split('').forEach((char:string, indexS:number) => {
				// BUSCAR LINK
				if(char === '[') {
					// RECORTAR HREF
					const lineS:string = line.substr(indexS)
					const linkHref:string = lineS.substr(0, lineS.indexOf(']') + 1)

					// ASIGNAR A TEMPORAL
					tmpAnchors = linkHref
				}

				else if(char === '(') {
					// RECORTAR TEXTO DE LINK
					const lineS:string = line.substr(indexS)
					const linkText =  lineS.substr(0, lineS.indexOf(')') + 1)

					// OBTENER VALORES
					const linkProps = {
						key:`Post_${indexS}_anchorPIndex`,
						title: linkText.slice(1, -1),
						anchor: tmpAnchors.slice(1, -1)
					}
					// CREAR ANCHOR
					const a = linkProps.anchor.includes('http') ?
					<a {...linkProps}>{linkProps.title}</a>
					: <Link to={linkProps.anchor} {...linkProps}>{linkProps.title}</Link>

					// UNIR TEXTO
					tmpAnchors += linkText
					const nText = line.substr(line.indexOf(tmpAnchors) + tmpAnchors.length, lineS.indexOf('[') >= 0 ? lineS.indexOf('[') - linkText.length: undefined)

					// ASIGNAR ELEMENTOS
					index.push(a)
					index.push(nText)
				}
			})

			// RENDERIZAR P CON LINKS
			return <p key={`Post_${key}_anchorP`}>{index}</p>
		}

		// TEXT
		else if (line.startsWith('__'))
			return (
				<strong key={`Post_${key}_strong`}>{line.substr(2, line.lastIndexOf('__') - 2)}</strong>
			)

		else if(typeof parseInt(line.charAt(0), 10) === 'number' && line.indexOf('. ') === 1) return <li key={`Post_${key}_li`}>{line.substr(3)}</li>

		// DEVOLVER UN P PARA CUALQUIER ELEMENTO NO RECONOCIDO
		else return <p key={`Post_${key}_p`}>{line}</p>
	})

	// IMPORTAR ESTILOS DE CODE SOLO SI ES NECESARIO
	if(codeCounts > 0) require('Components/Code/Monokai.css')

	// RETORNAR ARRAY
	return render
}

export default Serializer
