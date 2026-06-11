import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
        }
    }, [token])

    const login = async (email, password) => {
        setLoading(true)
        try {
            const response = await api.post('/login', { email, password })
            setToken(response.data.token)
            setUser(response.data.user)
            return response.data
        } finally {
            setLoading(false)
        }
    }

    const register = async (data) => {
        setLoading(true)
        try {
            const response = await api.post('/register', data)
            setToken(response.data.token)
            setUser(response.data.user)
            return response.data
        } finally {
            setLoading(false)
        }
    }

    const logout = async () => {
        try {
            await api.post('/logout')
        } finally {
            setToken(null)
            setUser(null)
        }
    }

    const isAdmin = () => user?.role === 'admin'
    const isAuthenticated = () => !!token

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            login, register, logout,
            isAdmin, isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}