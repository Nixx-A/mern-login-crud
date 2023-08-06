/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([])
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const signup = async (user) => {
    try {
      const res = await registerRequest(user)
      console.log(res.data)
      setUser(res.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.log(error);
      setErrors(error.response.data)
    }
  }

  const signin = async (user) => {
    try {
      const res = await loginRequest(user)
      console.log(res.data)
      setUser(res.data)
      setIsAuthenticated(true)
    } catch (error) {
      if (Array.isArray(error.response.data)) {
        setErrors(error.response.data)
      } else {
        console.log(error);
        setErrors(error.response.data.message)
      }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    Cookies.remove("token")
  }

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([])
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [errors])

  useEffect(() => {
    async function checkLogin () {
      const cookies = Cookies.get()

      if (!cookies.token) {
        setIsAuthenticated(false)
        setLoading(false)
        setUser(null)
        return
      }

      try {
        const res = await verifyTokenRequest(cookies.token)
        if (!res.data) return setIsAuthenticated(false)

        setIsAuthenticated(true)
        setUser(res.data)
        setLoading(false)
        console.log(res);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false)
        setLoading(false)
      }
    }

    checkLogin()
  }, [])

  return (
    <AuthContext.Provider value={{ signup, user, isAuthenticated, errors, signin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )

}