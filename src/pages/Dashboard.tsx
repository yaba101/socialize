import React from 'react'

const Dashboard = () => {
	return (
		<div className='flex flex-col items-center justify-center'>
			<h1 className='font-bold text-2xl text-gray-200 mb-10'>
				Welcome to the Home Page!
			</h1>
			<button className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'>
				Link Socials
			</button>
		</div>
	)
}

export default Dashboard
