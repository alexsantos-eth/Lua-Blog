// ROUTER
import Link from 'next/link'

// HERRAMIENTAS
import { linkResolver, hrefResolver } from 'utils/Prismic'
import { formateDate } from 'utils/ToolsAux'

// PRISMIC
import { Document } from 'prismic-javascript/types/documents'
// @ts-ignore
import { RichText } from 'prismic-reactjs'

// PROPIEDADES
interface IPostProps {
	doc: Document
}

const PostCard: React.FC<IPostProps> = (props: IPostProps) => {
	return (
		<Link href={hrefResolver(props.doc)} as={linkResolver(props.doc)}>
			<div className='postCard'>
				<img loading='lazy' src={props.doc.data.banner.url} alt='Post banner' />
				<h2>{RichText.asText(props.doc.data.title)}</h2>
				<p>{RichText.asText(props.doc.data.description)}</p>
				<span>{formateDate(props.doc.first_publication_date, props.doc.data.author)}</span>
				<style jsx>{`
					.postCard {
						color: var(--postText);
						width: 700px;
						margin-bottom: 50px;
						cursor: pointer;
					}

					img {
						background: var(--navbarBackground);
						width: 100%;
						height: 350px;
						object-fit: cover;
						margin-bottom: 10px;
						border-radius: 10px;
						box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.05);
					}

					span {
						font-family: 'Manrope';
					}

					h2 {
						font-family: 'Manrope';
						font-size: 1.8em;
						font-weight: 600;
						margin-bottom: 10px;
					}

					p {
						font-family: 'OpenSans';
						color: var(--postText);
						margin-bottom: 10px;
						font-size: 1.05em;
						line-height: 20px;
						opacity: 0.8;
					}

					span {
						opacity: 0.6;
					}

					@media screen and (max-width: 1100px) {
						.postCard {
							width: 600px;
						}
					}

					@media screen and (max-width: 1000px) {
						.postCard {
							width: 100%;
						}
					}

					@media screen and (max-width: 600px) {
						img {
							height: 200px;
						}
					}

					@media screen and (max-width: 450px) {
						img {
							height: 150px;
						}
					}
				`}</style>
			</div>
		</Link>
	)
}

export default PostCard
