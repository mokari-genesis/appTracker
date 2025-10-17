import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

// Get credentials from environment variables
const VALID_USERNAME = import.meta.env.VITE_AUCTIONS_USER || ''
const VALID_PASSWORD = import.meta.env.VITE_AUCTIONS_PASS || ''

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('auctionApp_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // Validate against environment variables
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      const userToStore = {
        id: '1',
        username: username,
        name: 'Auction Manager',
      }
      setUser(userToStore)
      localStorage.setItem('auctionApp_user', JSON.stringify(userToStore))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auctionApp_user')
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
