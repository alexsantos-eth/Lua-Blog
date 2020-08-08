// REACT
import React from 'react'

// ESTILOS
import Styles from './NotFound.module.scss'

const NotFound: React.FC = () => {
	return (
		<section className={Styles.page}>
			<h1>Error 404 página no encontrada</h1>
		</section>
	)
}

export default NotFound
