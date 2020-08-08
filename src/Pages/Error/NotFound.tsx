// REACT
import React from 'react'

// ESTILOS
import Styles from './NotFound.module.scss'
import Meta from 'Components/Meta/Meta'

const NotFound: React.FC = () => {
	return (
		<section className={Styles.page}>
			<Meta 
				title='Error 404 página no encontrada' 
				banner='' 
				url=''
			 	desc='Error 404 página no encontrada' 
			 	keys={['LUA', 'Blog']}
			/>
			<h1>Error 404 página no encontrada</h1>
		</section>
	)
}

export default NotFound
