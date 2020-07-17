import PrismicClient from 'prismic-configuration'
import { linkResolver } from 'utils/Tools'
import { NextApiRequest, NextApiResponse } from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { token, documentId }: any = req.query
	const redirectUrl = await PrismicClient.getPreviewResolver(token, documentId).resolve(
		linkResolver,
		'/'
	)

	if (!redirectUrl) return res.status(401).json({ message: 'Invalid token' })

	// @ts-ignore
	res.setPreviewData({ ref: token })

	res.writeHead(302, { Location: redirectUrl })

	res.end()
}
