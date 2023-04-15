import './index.css'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignupPage from './pages/Signup'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import { AuthContextProvider } from './components/AuthProvider'

function App() {
	return (
		<div>
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
	)
}

export default App
