import { Link } from 'react-router-dom'
import React from 'react'

// PROPIEDADES
interface IPostProps {
	post: IPostItem
}

const PostCard: React.FC<IPostProps> = ({ post }: IPostProps) => {
	return (
		<Link to=''>
			<div className='postCard'>
				<img loading='lazy' src={post.author} alt='Post banner' />
				<h2>{post.title}</h2>
				<p>{post.description}</p>
				<span>{post.author}</span>
			</div>
		</Link>
	)
}

export default PostCard
