import cn from 'classnames'

type AvatarProps = {
	username: string
	size?: 'sm' | 'md' | 'lg'
	className?: string
}

const Avatar = ({ username, size = 'md', className }: AvatarProps) => {
	const firstLetter = username.charAt(0).toUpperCase()

	return (
		<div
			className={cn(
				'inline-flex items-center justify-center rounded-full font-bold text-white bg-red-600',
				{
					'w-6 h-6': size === 'sm',
					'w-8 h-8': size === 'md',
					'w-10 h-10': size === 'lg',
				},
				className
			)}
			style={{ backgroundColor: `#${firstLetter.charCodeAt(0) % 1000}` }}>
			{firstLetter}
		</div>
	)
}

export default Avatar
