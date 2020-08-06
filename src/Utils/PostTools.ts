// FORMATO DE FECHA
export const formatDate = (date: Date, lang: ILangPackage) =>
	`${lang.general.days[date.getDay()]} ${date.getDate()} de ${
		lang.general.months[date.getMonth()]
	} del ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()} (GTM-6)`

// BUSCAR POST
export const findByUID = (uid: string, items: IPostItem[]) => {
	// DOCUMENTO
	let post: IPostItem | undefined

	// RECORRER DOCUMENTOS
	items.forEach((sPost: IPostItem) => {
		if (sPost.url === uid) post = sPost
	})

	// RETORNAR DOCUMENTO
	return post
}

export const getRelated = (sPost:IPostItem | undefined, posts:IPostItem[], uid:string) => {
	// OBTENER TAGS
	const tags: string[] | undefined  = sPost?.tags
	const relatedPost: IPostItem[] = []

	// BUSCAR TAGS
	if (tags)
		posts?.forEach((post: IPostItem) => {
			if (post.tags.some((tag:string) => tags.includes(tag)) && post.url !== uid) relatedPost.push(post)
		})

	return relatedPost
}
