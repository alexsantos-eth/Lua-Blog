// PRISMIC
import { Document } from 'prismic-javascript/d.ts/documents'
import PostCard from './PostCard'

// PROPIEDADES
interface CategoryProps {
	img: string
	name: string
	reverse?: boolean
	icon: string
	desc: string
	doc: Document
	top?: boolean
	color?: string
}

const Category: React.FC<CategoryProps> = (props: CategoryProps) => {
	return (
		<section className='category'>
			{props.top && (
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'>
					<path
						fill='rgba(0,0,0,.4)'
						fill-opacity='1'
						d='M0,64L48,90.7C96,117,192,171,288,213.3C384,256,480,288,576,261.3C672,235,768,149,864,112C960,75,1056,85,1152,122.7C1248,160,1344,224,1392,256L1440,288L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
					/>
				</svg>
			)}
			<div id='category-header'>
				<img src={props.img} />
				<h1>
					<i className={`lni lni-${props.icon}`} /> {props.name}
				</h1>
				<p>{props.desc}</p>
			</div>

			{props.doc && (
				<div id='category-docs'>
					<PostCard doc={props.doc} />
				</div>
			)}

			<style jsx>{`
				section {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: ${props.reverse ? 'flex-start' : 'flex-end'};
				}

				svg {
					position: absolute;
					top: 0px;
					left: 0;
					width: 100%;
					z-index: 2;
				}

				section > #category-docs {
					position: relative;
					margin-bottom:50px;
					left: ${props.reverse ? '50px' : '-50px'};
					width: 85%;
					border-radius: 10px;
					background: var(--categoryBackground);
					padding: 40px 50px;
					display: flex;
					align-items: center;
					justify-content: ${props.reverse ? 'flex-start' : 'flex-end'};
				}

				section > #category-docs > * {
					position: relative;
					z-index: 3;
				}

				section > #category-header {
					position: absolute;
					z-index: 4;
					width: 400px;
					${props.reverse ? 'right: 0;' : 'left: 0;'}
					background: ${props.color || 'var(--blue)'};
					box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.1);
					margin-${props.reverse ? 'right' : 'left'}: 80px;
					border-radius: 10px;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: ${props.reverse ? 'flex-start' : 'flex-end'};
					text-align: ${props.reverse ? 'left' : 'right'};
					padding: 40px 30px;
				}

				section > #category-header > h1 {
					color: var(--postPhraseBold);
					font-family: 'Manrope';
					font-size:${props.name.length < 7 ? '2.5em' : '2.1em'};
				}

				section > #category-header > h1 > i {
					font-size: 0.8em;
				}

				section > #category-header > p {
					color: var(--postPhraseBold);
					opacity: 0.9;
					width: 210px;
					margin-top: 10px;
				}

				section > #category-header > img {
					width: 60%;
					position: absolute;
					bottom: 0;
					${props.reverse ? 'right:-70px' : 'left: -70px'}
				}

				@media screen and (max-width: 1130px) {
					section > #category-docs {
						padding: 40px 0px;
					}
				}
				@media screen and (max-width: 1080px) {
					section > #category-header {
						${props.reverse ? 'right:-40px' : 'left: -40px'}
					}
				}
				@media screen and (max-width: 965px) {
					section {
						flex-direction: column;
						align-items: center;
						padding: 0 50px;
					}
					section > #category-header {
						position: relative;
						top: 0;
						left: 0;
						${props.reverse ? 'margin-top: 70px;' : ''}
					}

					section > #category-docs {
						width: 100%;
						left: 0px;
						margin-top: -50px;
						display: flex;
						justify-content: center;
					}
				}
				@media screen and (max-width: 760px) {
					section > #category-header {
						${props.reverse ? 'margin-top: 90px;' : ''}
						width: 110%;
					}
					section > #category-header > p {
						font-size: 1.3em;
					}
					section > #category-header > img {
						${props.reverse ? 'right:-90px' : 'left: -90px'}
					}
				}
				@media screen and (max-width: 500px) {
					section {
						padding: 0 20px;
					}
					section > #category-header {
						${props.reverse ? 'margin-top: 100px;' : ''}
						width: 90%;
						font-size:0.8em;
						padding:20px 30px;
					}
				}
				@media screen and (max-width: 460px) {
					section > #category-header > p{
						width:160px;
					}
				}
			`}</style>
			<style jsx global>{`
				@media screen and (max-width: 1080px) {
					.category > #category-docs > a {
						margin-left: -60px;
					}
				}
				@media screen and (max-width: 965px) {
					.category > #category-docs > a {
						margin-left: 10px;
					}
				}
			`}</style>
		</section>
	)
}

export default Category
