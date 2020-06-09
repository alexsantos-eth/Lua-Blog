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
						fill='var(--wavesColor)'
						fillOpacity='1'
						d='M0,160L48,138.7C96,117,192,75,288,85.3C384,96,480,160,576,186.7C672,213,768,203,864,170.7C960,139,1056,85,1152,90.7C1248,96,1344,160,1392,192L1440,224L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z'
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
					top: -1px;
					left: 0px;
					width: 100vw;
					z-index: 2;
				}

				section > #category-docs {
					position: relative;
					margin-bottom:70px;
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
					top:41%;
					transform:translateY(-50%);
					${props.reverse ? 'right: 0' : 'left: 0'};
					background: ${props.color || 'var(--blue)'};
					box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.1);
					margin-${props.reverse ? 'right' : 'left'}: 120px;
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
					${props.reverse ? 'right:-70px' : 'left: -70px'};
				}

				@media screen and (max-width: 1130px) {
					section > #category-docs {
						padding: 40px 0px;
					}
				}

				@media screen and (max-width: 1080px) {
					section > #category-header {
						${props.reverse ? 'right:-40px' : 'left: -40px'};
					}

					section > #category-header > img {
						width: 50%;
						${props.reverse ? 'right:-30px' : 'left: -30px'};
					}
				}

				@media screen and (max-width: 930px) {
					section {
						display:inline-flex;
						flex-direction: column;
						padding: 0 50px;
						width:50%;
						align-items:${props.reverse ? 'flex-start' : 'flex-end'};
						${props.reverse ? 'padding-right: 20px' : 'padding-left: 20px'};
					}

					section > #category-header {
						position: relative;
						top: -20px;
						left:unset;
						right:unset;
						width:90%;
						transform:none;
						margin:0;
						${props.top ? 'margin-top: 30px' : ''};
					}

					section > #category-header > img {
						${props.reverse ? 'right:-60px' : 'left: -60px'};
					}

					section > #category-docs {
						width: 100%;
						left: 0px;
						margin-top: -50px;
						display: flex;
						justify-content: center;
					}
				}

				@media screen and (max-width:800px){
					section > #category-header {
						${props.top ? 'margin-top: 70px' : ''};
					}
				}

				@media screen and (max-width: 760px) {
					section{
						width:100%;
						padding:0 50px;
						display:flex;
						align-items:center;
					}

					section > #category-docs{
						justify-content:${props.reverse ? 'flex-start' : 'flex-end'};
					}

					section > #category-header {
						margin:0;
						padding:30px;
						${props.reverse ? 'margin-top: 90px' : ''};
						width: 70%;
					}

					section > #category-header > p {
						font-size: 1em;
					}

					section > #category-header > img {
						width:300px;
						${props.reverse ? 'right:-21%' : 'left: -21%'};
						bottom:-100px;
					}
				}

				@media screen and (max-width: 650px) {
						section > #category-header > img {
							width:250px;
						}
				}

				@media screen and (max-width: 600px) {
					section > #category-docs{
						justify-content:center;
					}

					section > #category-header {
						width: 100%;
					}

					section > #category-header > img {
						width: 40%;
						${props.reverse ? 'right:0%' : 'left: 0%'};
						bottom:0px;
					}
				}

				@media screen and (max-width: 500px) {
					section {
						padding: 0 20px;
					}
				}

				@media screen and (max-width: 460px) {
					section > #category-header{
						width:calc(100vw - 45px);
						${props.top ? 'margin-top: 60px' : ''};
						${props.reverse ? 'left:-22.5px' : 'right: -22.5px'};
					}

					section > #category-header > p{
						width:160px;
					}

					section > #category-header > img {
						width: 50%;
						${props.reverse ? 'right:-45px' : 'left: -45px'};
					}

					svg{
						left:0;
					}
				}
			`}</style>
		</section>
	)
}

export default Category
