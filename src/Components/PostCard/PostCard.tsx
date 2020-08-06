import MainContext from 'Context/MainContext'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from 'Utils/Tools'

import Styles from './PostCard.module.scss'

// PROPIEDADES
interface IPostProps {
	post: IPostItem
}

const PostCard: React.FC<IPostProps> = ({ post }: IPostProps) => {
	const { lang } = useContext(MainContext)

	return (
		<Link to={`/posts/${post.url}`}>
			<div className={Styles.postCard}>
				<img loading='lazy' src={post.banner.url} alt='Post banner' />
				<h2>{post.title}</h2>
				<p>{post.description}</p>
				<span>
					{post.author} | {formatDate(new Date(post.sys.publishedAt), lang)}
				</span>
			</div>
		</Link>
	)
}

export default PostCard
