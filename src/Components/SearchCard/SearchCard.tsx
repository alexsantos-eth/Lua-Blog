import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import Styles from './SearchCard.module.scss'

// PROPIEDADES
interface ISearchCardProps {
	post: IPostItem
}

const SearchCard: React.FC<ISearchCardProps> = ({ post }: ISearchCardProps) => {
	return (
		<Link to={`/posts/${post.url}`} title={post.title} className={Styles.link}>
			<img src={post.banner.url} alt={`${post.banner.title} Banner`} />
			<h1>
				{post.title} - <span>{post.author}</span>
			</h1>
		</Link>
	)
}

export default memo(SearchCard)
