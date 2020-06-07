// PROPIEDADES
interface Props {
	title: string
	desc: string
}

const Meta: React.FC<Props> = (props: Props) => {
	return (
		<>
			{/* IMPORTANTE */}
			<meta name='description' content={props.desc} />

			{/* WEBAPP */}
			<meta name='application-name' content={props.title} />
			<meta name='apple-mobile-web-app-title' content={props.title} />

			{/* OPENGRAPH */}
			<meta property='og:title' content={props.title} />
			<meta property='og:description' content={props.desc} />
			<meta property='og:site_name' content={props.title} />

			{/* TWITTER */}
			<meta name='twitter:title' content={props.title} />
			<meta name='twitter:description' content={props.desc} />
		</>
	)
}

export default Meta
