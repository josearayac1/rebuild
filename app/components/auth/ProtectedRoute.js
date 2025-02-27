'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProtectedRoute({ children, allowedRole }) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        console.log('Checking auth response:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('Auth data:', data)
          
          if (!allowedRole || data.user?.userType === allowedRole) {
            setIsAuthorized(true)
          } else {
            console.log('Role mismatch:', {
              required: allowedRole,
              actual: data.user?.userType
            })
            router.replace('/unauthorized')
          }
        } else {
          router.replace('/')
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.replace('/')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, allowedRole])

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <p className="loading-text">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return children
} 