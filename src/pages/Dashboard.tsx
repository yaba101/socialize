import { useContext } from 'react'
import { AuthContext } from '../components/AuthProvider'
import { Navigate } from 'react-router-dom'

const Dashboard = () => {
	const { isLoggedIn, logout, username } = useContext(AuthContext)
	if (!isLoggedIn) return <Navigate to='/login' />
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='mb-10 text-2xl font-bold text-gray-200'>
				Welcome to the Home Page, {username}!
			</h1>
			<button className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'>
				Link Socials
			</button>
			<button
				className='w-48 px-4 py-2 mt-10 font-bold text-white rounded bg-cyan-600 hover:bg-cyan-800 focus:outline-none focus:shadow-outline'
				onClick={logout}>
				Log Out
			</button>
		</div>
	)
}

export default Dashboard
