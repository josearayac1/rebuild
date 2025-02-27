'use client'
import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import '../components/auth/LoginTabs.css'
import SearchBar from '../components/dashboard/SearchBar'
import LogoutButton from '../components/auth/LogoutButton'

export default function ProfessionalDashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <ProtectedRoute allowedRole="PROFESSIONAL">
      <div className="dashboard-container">
        <div className="dashboard-content-wrapper">
          <nav className="dashboard-nav">
            <div className="nav-left">
              <div className="logo-wrapper">
                <img src="/logo.png" alt="Logo" className="logo" />
              </div>
              <h1 className="nav-title">Profesional</h1>
            </div>
            <div className="nav-right">
              <LogoutButton />
            </div>
          </nav>
          
          <main className="dashboard-content">
            {/* Columna izquierda */}
            <div className="visits-section">
              <SearchBar />
              <h2>Visitas disponibles</h2>
              <div className="visits-container">
                {/* Aquí irán las tarjetas de propiedades */}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="profile-section">
              <div className="profile-header">
                <div className="profile-info">
                  <h2 className="profile-title">Datos del Profesional</h2>
                  <div className="profile-data">
                    <div className="profile-field">
                      <span className="profile-field-label">Nombre</span>
                      <span className="profile-field-value">{user?.name}</span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Email</span>
                      <span className="profile-field-value">{user?.email}</span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Teléfono</span>
                      <span className="profile-field-value">{user?.professionalProfile?.phone}</span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Profesión</span>
                      <span className="profile-field-value">{user?.professionalProfile?.profession}</span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Años de Experiencia</span>
                      <span className="profile-field-value">{user?.professionalProfile?.experience} años</span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Especialidades</span>
                      <div className="profile-specialties">
                        {user?.professionalProfile?.specialties.map((specialty, index) => (
                          <span key={index} className="specialty-tag">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="edit-profile-button">
                      Editar Perfil
                    </button>
                  </div>
                </div>
                <div className="profile-picture-container">
                  {user?.professionalProfile?.profilePicture && (
                    <img 
                      src={user?.professionalProfile?.profilePicture} 
                      alt="Foto de Perfil" 
                      className="profile-picture" 
                    />
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
} 