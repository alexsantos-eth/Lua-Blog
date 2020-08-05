export const _ENDPOINT: string =
	'https://graphql.contentful.com/content/v1/spaces/vlyc7nduv4id/?access_token=qT0oOWp1m4Aq2KTPMcHTtC_k7XG58H7gXlMtVXANglU'
export const query: string = `{
	postCollection {
		items {
			url
			title
			description
			author
		}
	}
}`
