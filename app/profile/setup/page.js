'use client'
import { useState, useEffect } from 'react'
import '../../components/auth/LoginTabs.css'
import ProtectedRoute from '../../components/auth/ProtectedRoute'
import OwnerProfileForm from '../../components/profile/OwnerProfileForm'
import ProfessionalProfileForm from '../../components/profile/ProfessionalProfileForm'
import { useRouter } from 'next/navigation'

export default function ProfileSetup() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          const data = await response.json()
          if (data.user.profileCompleted) {
            router.replace(data.user.userType === 'OWNER' ? '/dashboard' : '/profesional')
            return
          }
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <p className="loading-text">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute allowedRole={user?.userType}>
      <div className="login-container">
        <div className="login-card">
          {/* Logo */}
          <div className="logo-container">
            <div className="logo-wrapper">
              <img src="/logo.png" alt="Logo" className="logo" />
            </div>
          </div>

          {/* Título */}
          <h1 className="title">Completa tu Perfil</h1>

          {/* Formulario según tipo de usuario */}
          {user?.userType === 'OWNER' ? (
            <OwnerProfileForm user={user} />
          ) : (
            <ProfessionalProfileForm user={user} />
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
} 