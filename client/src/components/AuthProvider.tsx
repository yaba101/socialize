import React, { createContext, useState } from 'react'

type AuthContextType = {
	isLoggedIn: boolean
	logout: () => void
	setIsLoggedIn: (value: boolean) => void
}

const initialAuthContext: AuthContextType = {
	isLoggedIn: false,
	logout: () => {},
	setIsLoggedIn: () => {},
}

export const AuthContext = createContext<AuthContextType>(initialAuthContext)

export const AuthContextProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
	const logout = () => {
		setIsLoggedIn(false)
	}

	return (
		<AuthContext.Provider value={{ isLoggedIn, logout, setIsLoggedIn }}>
			{children}
		</AuthContext.Provider>
	)
}
