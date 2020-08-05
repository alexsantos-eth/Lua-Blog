// AXIOS
const axios = require('axios')

// FILESYSTEM
const fs = require('fs')
const path = require('path')

// GRAPHQL SERVER
const _ENDPOINT: string =
	'https://graphql.contentful.com/content/v1/spaces/vlyc7nduv4id/?access_token=qT0oOWp1m4Aq2KTPMcHTtC_k7XG58H7gXlMtVXANglU'
const query: string = `{
	postCollection {
		items {
			title
			description
			author
		}
	}
}`

// FETCH
const start = async () => {
	// FETCH DE LOS DATOS
	const {
		data: { data },
	} = await axios.post(_ENDPOINT, { query })

	// JSON
	const json: string = JSON.stringify(data)

	// ESCRIBIR ARCHIVO
	fs.writeFile(path.resolve(__dirname, 'src', 'Data', 'posts.json'), json, (err: any) =>
		console.log(err ? `Error al escribir archivo ${err}` : 'Posts descargados correctamente.')
	)
	// ERROR HANDLING
}

start()
