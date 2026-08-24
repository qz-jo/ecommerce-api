import { createContext, useContext, useMemo, useState } from 'react'
import { demoUsers } from '../data/users'

const AuthContext = createContext(null)
const AUTH_KEY = 'nova-tech-auth-user'

const readUser = () => {
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser)

  const login = (email, password) => {
    const matched = demoUsers.find((item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password)
    if (!matched) return { success: false, message: 'Email or password is incorrect.' }
    const safeUser = { id: matched.id, fullName: matched.fullName, email: matched.email, phone: matched.phone, role: matched.role }
    setUser(safeUser)
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }

  const updateProfile = (changes) => {
    setUser((current) => {
      const updated = { ...current, ...changes }
      localStorage.setItem(AUTH_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const value = useMemo(() => ({ user, login, logout, updateProfile }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
