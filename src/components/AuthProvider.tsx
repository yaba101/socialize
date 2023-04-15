import React, { createContext, useState } from 'react'

type AuthContextType = {
	isLoggedIn: boolean
	login: (username: string) => void
	logout: () => void
	username: string
}

const initialAuthContext: AuthContextType = {
	isLoggedIn: false,
	login: (username = '') => {},
	logout: () => {},
	username: '',
}

export const AuthContext = createContext(initialAuthContext)

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

	const [username, setUsername] = useState('')

	const login = (username: string) => {
		setIsLoggedIn(true)
		setUsername(username)
	}
	const logout = () => {
		setIsLoggedIn(false)
		setUsername('')
	}

	return (
		<AuthContext.Provider value={{ isLoggedIn, login, logout, username }}>
			{children}
		</AuthContext.Provider>
	)
}
