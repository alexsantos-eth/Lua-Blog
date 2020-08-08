// REACT
import React, { Suspense, lazy } from 'react'

// ESTILOS
import Styles from './PostClip.module.scss'

// COMPONENTES
import ClipSkeleton from 'Components/ClipSkeleton/ClipSkeleton'

const SearchCard = lazy(() => import('Components/SearchCard/SearchCard'))

// PROPIEDADES
interface PostClipProps {
	title: string
	posts: IPostItem[] | null
}

const PostClip: React.FC<PostClipProps> = (props: PostClipProps) => {
	if (props.posts)
		return (
			<div className={Styles.postClip}>
				<h2>{props.title}</h2>
				{props.posts.map((post: IPostItem, key: number) => {
					if (key < 3)
						return (
							<Suspense key={`${key}_rec`} fallback={<ClipSkeleton />}>
								<SearchCard post={post} />
							</Suspense>
						)
					else return null
				})}
			</div>
		)
	else return <ClipSkeleton />
}

export default PostClip
