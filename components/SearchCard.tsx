// PRISMIC
import { Document } from 'prismic-javascript/types/documents'

// @ts-ignore
import { RichText } from 'prismic-reactjs'

// NEXT
import Link from 'next/link'

// HERRAMIENTAS
import { hrefResolver, linkResolver } from 'utils/Tools'

// PROPIEDADES
interface ISearchCardProps {
	doc: Document
}

const SearchCard: React.FC<ISearchCardProps> = ({ doc }: ISearchCardProps) => {
	return (
		<Link href={hrefResolver(doc)} as={linkResolver(doc)} passHref>
			<a title={RichText.asText(doc.data.title)}>
				<img src={doc.data.banner.url} title={`${doc.uid} Banner`} />
				<h1>
					{RichText.asText(doc.data.title)} - <span>{doc.data.author}</span>
				</h1>
				<style jsx>{`
					a {
						display: block;
						cursor: pointer;
						width: 300px;
						padding: 20px;
						border-radius: 10px;
						box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.3);
						background: var(--navbarBackground);
					}

					a > img {
						width: 100%;
						height: 100px;
						object-fit: cover;
						border-radius: 10px;
						margin-bottom: 15px;
					}

					a > h1 {
						font-family: 'OpenSans';
						font-weight: 500;
						font-size: 1.2em;
						color: var(--postText);
					}

					a > h1 > span {
						opacity: 0.8;
						font-size: 0.9em;
					}

					@media screen and (max-width: 1100px) {
						a {
							width: 250px;
						}
					}

					@media screen and (max-width: 965px) {
						a {
							width: 300px;
						}
					}

					@media screen and (max-width: 750px) {
						a {
							width: 230px;
						}
					}

					@media screen and (max-width: 600px) {
						a {
							width: 300px;
						}
					}

					@media screen and (max-width: 360px) {
						a {
							width: 100%;
						}
					}
				`}</style>
			</a>
		</Link>
	)
}

export default SearchCard
