import React, { useContext } from 'react'

import MainContext from 'Context/MainContext'
import Meta from 'Components/Meta/Meta'

const Index: React.FC = () => {
	// CONTEXTO
	const { lang } = useContext(MainContext)

	return (
		<section>
			<Meta
				title={lang.general.title}
				desc='Creamos experiencias digitales e integramos tecnología escalable de alto rendimiento con el objetivo de acelerar el crecimiento de negocios, empresas y startups al rededor del mundo.'
				banner='/images/general/banner.jpg'
				url=''
				keys={'Diseño web, E-commerce, Apps móviles, Inteligencia Artificial, Consultoría IT, Software, Estudio de Desarrollo'.split(
					', '
				)}
			/>
		</section>
	)
}

export default Index
