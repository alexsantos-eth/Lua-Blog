// NEXT
import Link from 'next/link'

// PRISMIC
import { Document } from 'prismic-javascript/d.ts/documents'

// COMPONENTES
// @ts-ignore
import { RichText } from 'prismic-reactjs'

// TOOLS
import { linkResolver, hrefResolver } from 'Tools'

// INTERFAZ
interface PostCardProps {
	doc: Document
}

const PostCard: React.SFC<PostCardProps> = (props: PostCardProps) => {
	return (
		<>
			<Link passHref as={linkResolver(props.doc)} href={hrefResolver(props.doc)}>
				<a className='post-card'>
					<div>
						<div>
							<span>
								<i className='lni lni-alarm-clock' />
								{props.doc.data.date}
							</span>
							<span>
								<i className='lni lni-alarm-user' />
								{RichText.asText(props.doc.data.author)}
							</span>
						</div>
					</div>
					<div id='post-content'>
						<h1>
							{RichText.asText(props.doc.data.title)}
							<i className={`lni lni-${props.doc.data.icon}`} />
						</h1>
						<p>{RichText.asText(props.doc.data.description)}</p>
					</div>
				</a>
			</Link>
			<style jsx>{`
				.post-card {
					width: 400px;
					display: flex;
					justify-content: flex-end;
					position: relative;
					z-index: 3;
					margin-top: -20px;
				}

				.post-card > div:nth-child(1) {
					width: 90%;
					height: 250px;
					background: url(${props.doc.data.banner.url || ''});
					background-size: cover;
					position: relative;
					overflow: hidden;
					border-radius: 10px;
				}

				.post-card > div:nth-child(1) > div {
					width: 100%;
					height: 300px;
					position: absolute;
					top: 0;
					left: 0;
					display: flex;
					justify-content: space-between;
					align-items: flex-start;
					padding: 30px;
					background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
				}

				.post-card > div:nth-child(1) > div > span {
					color: var(--postPhraseBold);
					font-family: 'Futura';
				}

				.post-card > div:nth-child(1) > div > span > i {
					margin-right: 10px;
				}

				.post-card > #post-content {
					background: var(--postContent);
					border-radius: 10px;
					padding: 30px 30px 30px 40px;
					width: 70%;
					overflow: hidden;
					position: absolute;
					bottom: -20px;
					left: 0;
					box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.1);
				}

				.post-card > #post-content::before {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0px;
					left: 0px;
					background: rgba(255, 255, 255, 0.2);
					z-index: 1;
				}

				.post-card > #post-content::after {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0px;
					left: 0px;
					width: 10px;
					border-radius: 10px;
					height: 100%;
					background: ${props.doc.data.tagcolor};
				}

				.post-card > #post-content > * {
					position: relative;
					z-index: 2;
					color: var(--postText);
				}

				.post-card > #post-content > h1 {
					font-size: 1.6em;
					margin-bottom: 10px;
				}

				.post-card > #post-content > h1 > i {
					font-size: 0.8em;
					margin-left: 5px;
				}

				.post-card > #post-content > p {
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					line-height: 17px;
					max-height: calc(17px * 3);
					font-size: 0.9em;
					opacity: 0.8;
					overflow: hidden;
				}
				@media screen and (max-width: 1200px) {
					.post-card > #post-content {
						width: 80%;
					}
				}
				@media screen and (max-width: 965px) {
					.post-card > #post-content {
						width: 90%;
					}
				}
				@media screen and (max-width: 600px) {
					.post-card > #post-content {
						width: 95%;
					}
				}
				@media screen and (max-width: 460px) {
					.post-card > #post-content > p {
						line-height: 15px;
						font-size: 1em;
					}
				}
			`}</style>
		</>
	)
}

export default PostCard
