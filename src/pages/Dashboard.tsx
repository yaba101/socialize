import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../components/AuthProvider'
import { Navigate } from 'react-router-dom'
import Avatar from '../components/Avatar'
import PostModal from '../components/PostModal'

const Dashboard = () => {
	const { isLoggedIn, logout, setIsLoggedIn } = useContext(AuthContext)
	const [showCreateModal, setShowCreateModal] = useState(false)
	const [username, setUsername] = useState(localStorage.getItem('username'))

	const handleCreateClick = () => {
		setShowCreateModal(true)
	}
	const handleCloseClick = () => {
		setShowCreateModal(false)
	}

	useEffect(() => {
		const token = localStorage.getItem('username')
		if (token) {
			setIsLoggedIn(true)
		}
	}, [setIsLoggedIn])
	if (!isLoggedIn && !localStorage.getItem('username')) {
		return <Navigate to='/' />
	}
	console.log(username)

	return (
		<>
			<div className='max-w-screen-xl px-4 py-8 mx-auto sm:py-12 sm:px-6 lg:px-8 '>
				<Avatar username={username ?? ''} size='lg' className='mr-4' />
				<div className='sm:flex sm:items-center sm:justify-between'>
					<div className='text-center sm:text-left'>
						<h1 className='text-2xl font-bold text-gray-200 '>
							Welcome Back, {username}!
						</h1>
						<p className='mt-1.5 text-sm text-gray-500 text-center'>
							Let's write a new post! 🎉
						</p>
					</div>
					<div className='flex flex-col gap-4 mt-4 sm:mt-0 sm:flex-row sm:items-center'>
						<button
							className='inline-flex items-center justify-center px-5 py-3 text-gray-500 transition border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring'
							type='button'>
							<span className='text-sm font-medium'> View Post History </span>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='ml-1.5 h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth='2'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
								/>
							</svg>
						</button>
						<button
							className='block px-5 py-3 text-sm font-medium text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring'
							onClick={handleCreateClick}
							type='button'>
							Create Post
						</button>
						<button
							className='block px-3 py-3 text-sm font-medium text-white transition rounded-full bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring'
							onClick={() => {
								logout()
								localStorage.removeItem('username')
							}}>
							Log Out
						</button>
					</div>
				</div>
			</div>

			{showCreateModal && <PostModal onClose={handleCloseClick} />}
		</>
	)
}
export default Dashboard
