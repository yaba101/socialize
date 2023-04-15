import './index.css'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignupPage from './pages/Signup'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'

import { Cookies } from 'react-cookie'
import { AuthContextProvider } from './components/AuthProvider'

const cookies = new Cookies()

function App() {
	return (
		<div className='flex items-center justify-center h-screen min-h-full px-4 py-12 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				<BrowserRouter>
					<AuthContextProvider>
						<Routes>
							<Route path='/login' element={<LoginPage />} />
							<Route path='/*' element={<Navigate to='/login' />} />
							<Route path='/signup' element={<SignupPage />} />
							<Route path='/dashboard' element={<Dashboard />} />
						</Routes>
					</AuthContextProvider>
				</BrowserRouter>
			</div>
		</div>
	)
}

export default App

// create isAuthenticated function to check if user is logged in
const isAuthenticated = () => {
	const token = cookies.get('token')
	return token ? true : false
}
