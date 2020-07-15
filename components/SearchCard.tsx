// PRISMIC
import { Document } from 'prismic-javascript/d.ts/documents'

// @ts-ignore
import { RichText } from 'prismic-reactjs'

// NEXT
import Link from 'next/link'

// HERRAMIENTAS
import { hrefResolver, linkResolver } from 'utils/Tools'

// PROPIEDADES
interface ISearchCardProps {
	doc: Document
	delay: number
}

const SearchCard: React.FC<ISearchCardProps> = ({ doc, delay }: ISearchCardProps) => {
	return (
		<Link href={hrefResolver(doc)} as={linkResolver(doc)}>
			<div>
				<img src={doc.data.banner.url} title={`${doc.uid} Banner`} />
				<h1>
					{RichText.asText(doc.data.title)} - <span>{doc.data.author}</span>
				</h1>
				<style jsx>{`
					div {
						cursor: pointer;
						width: 300px;
						padding: 20px;
						border-radius: 10px;
						box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
						background: var(--navbarBackground);
					}

					div > img {
						width: 100%;
						height: 100px;
						object-fit: cover;
						border-radius: 10px;
						margin-bottom: 15px;
					}

					div > h1 {
						font-family: 'OpenSans';
						font-weight: 500;
						font-size: 1.2em;
						color: var(--postText);
					}

					div > h1 > span {
						opacity: 0.8;
						font-size: 0.9em;
					}

					@media screen and (max-width: 1100px) {
						div {
							width: 250px;
						}
					}

					@media screen and (max-width: 965px) {
						div {
							width: 300px;
						}
					}

					@media screen and (max-width: 750px) {
						div {
							width: 230px;
						}
					}

					@media screen and (max-width: 600px) {
						div {
							width: 300px;
						}
					}

					@media screen and (max-width: 360px) {
						div {
							width: 100%;
						}
					}
				`}</style>
			</div>
		</Link>
	)
}

export default SearchCard
