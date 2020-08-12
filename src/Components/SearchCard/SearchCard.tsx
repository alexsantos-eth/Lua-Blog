import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import Styles from './SearchCard.module.scss'

// PROPIEDADES
interface ISearchCardProps {
	post: IPostItem
	asLabel?: HTMLInputElement | null
}

const SearchCard: React.FC<ISearchCardProps> = ({ post, asLabel }: ISearchCardProps) => {
	// FOCUS A INPUT
	const focusInput = () => {
		if (asLabel) asLabel.checked = false
	}

	return (
		<Link onClick={focusInput} to={`/posts/${post.url}`} title={post.title} className={Styles.link}>
			<img src={post.banner.url} alt={`${post.banner.title} Banner`} />
			<h1>
				{post.title} - <span>{post.author}</span>
			</h1>
		</Link>
	)
}

export default memo(SearchCard)
