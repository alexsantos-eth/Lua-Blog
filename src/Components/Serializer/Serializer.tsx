import React, { Suspense } from 'react'
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
	const lines: string[] = md.split('\n')

	let codeTagToggle: boolean = false
	let tempCodeString: string = ''
	let codeLang: string = ''

	const render: (JSX.Element | null)[] = lines.map((line: string, key: number) => {

		// CODE
		if (line.startsWith('```')) {
			if (!codeTagToggle) codeLang = line.substr(3)
			codeTagToggle = !codeTagToggle
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
				<Suspense key={`Post_${key}_pre`} fallback={<ClipSkeleton/>}>
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

		// TEXT
		else if (line.startsWith('__'))
			return (
				<strong key={`Post_${key}_strong`}>{line.substr(2, line.lastIndexOf('__') - 2)}</strong>
			)

		// DEVOLVER UN P PARA CUALQUIER ELEMENTO NO RECONOCIDO
		else return <p key={`Post_${key}_p`}>{line}</p>
	})

	return render
}

export default Serializer
