// TIPOS
import { Document } from 'prismic-javascript/d.ts/documents'

// COMPONENTES
// @ts-ignore
import { RichText } from 'prismic-reactjs'
import Link from 'next/link'
import { hrefResolver, linkResolver } from 'Tools'

// PROPIEDADES
interface HeaderProps {
	doc: Document
}

const Header: React.FC<HeaderProps> = (props: HeaderProps) => {
	return (
		<header>
			<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
				<path
					fill='var(--wavesColor)'
					fillOpacity='1'
					d='M0,160L48,144C96,128,192,96,288,96C384,96,480,128,576,154.7C672,181,768,203,864,181.3C960,160,1056,96,1152,106.7C1248,117,1344,203,1392,245.3L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
				/>
			</svg>
			<img src='/images/svgs/header.svg' alt='Header ISO' />
			<Link href={hrefResolver(props.doc)} as={linkResolver(props.doc)} passHref>
				<a className='post-link'>
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
					<div id='header-post'>
						<h1>
							{RichText.asText(props.doc.data.title)}
							<i className={`lni lni-${props.doc.data.icon}`} />
						</h1>
						<p>{RichText.asText(props.doc.data.description)}</p>
					</div>
				</a>
			</Link>
			<style jsx>{`
				header {
					padding: 50px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					position: relative;
				}

				header > img {
					width: 40%;
					max-width: 500px;
					position: relative;
					z-index: 2;
				}

				svg {
					position: absolute;
					bottom: 0;
					left: -40px;
					transform: scaleY(-1);
					width: 100vw;
				}

				header > .post-link {
					width: 60%;
					max-width: 650px;
					display: flex;
					justify-content: flex-end;
					position: relative;
					margin-bottom: -20px;
				}

				header > .post-link > div:nth-child(1) {
					width: 90%;
					height: 300px;
					background: url(${props.doc.data.banner.url || ''});
					background-size: cover;
					position: relative;
					overflow: hidden;
					border-radius: 10px;
				}

				header > .post-link > div:nth-child(1) > div {
					width: 100%;
					height: 300px;
					position: absolute;
					bottom: 0;
					left: 0;
					display: flex;
					justify-content: space-between;
					align-items: flex-end;
					padding: 30px;
					background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
				}

				header > .post-link > div:nth-child(1) > div > span {
					color: var(--postPhraseBold);
					font-family: 'Futura';
				}

				header > .post-link > div:nth-child(1) > div > span > i {
					margin-right: 10px;
				}

				header > .post-link > #header-post {
					background: var(--postContent);
					border-radius: 10px;
					padding: 30px 30px 30px 40px;
					width: 60%;
					overflow: hidden;
					position: absolute;
					top: -20px;
					left: -20px;
					box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.1);
				}
				header > .post-link > #header-post::before {
					content: '';
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0px;
					left: 0px;
					background: rgba(255, 255, 255, 0.2);
					z-index: 1;
				}

				header > .post-link > #header-post::after {
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

				header > .post-link > #header-post > * {
					position: relative;
					z-index: 2;
					color: var(--postText);
				}

				header > .post-link > #header-post > h1 {
					font-size: 1.6em;
					margin-bottom: 10px;
				}

				header > .post-link > #header-post > h1 > i {
					font-size: 0.8em;
					margin-left: 5px;
				}

				header > .post-link > #header-post > p {
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					line-height: 17px;
					max-height: calc(17px * 3);
					font-size: 0.9em;
					opacity: 0.8;
					overflow: hidden;
				}

				@media screen and (max-width: 1020px) {
					img {
						width: 30%;
					}
					header > .post-link {
						width: 70%;
					}
				}
				@media screen and (max-width: 800px) {
					header > img {
						position: absolute;
						bottom: -40px;
						left: 40px;
						width: 300px;
						z-index: 4;
					}
					header > .post-link {
						width: 100%;
					}
					header > .post-link > #header-post {
						width: 90%;
						left: 0px;
					}
				}
				@media screen and (max-width: 500px) {
					header {
						padding: 50px 20px;
					}
					header > img {
						bottom: -10px;
						left: -20px;
						width: 250px;
					}

					header > .post-link > div:nth-child(1) > div {
						padding: 20px;
					}
				}
				@media screen and (max-width: 460px) {
					header > .post-link > #header-post > p {
						line-height: 15px;
						font-size: 1em;
					}
					svg {
						left: 0;
					}
				}
			`}</style>
		</header>
	)
}

export default Header
