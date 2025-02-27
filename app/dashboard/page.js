'use client'
import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import '../components/auth/LoginTabs.css'

export default function OwnerDashboard() {
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
    <ProtectedRoute allowedRole="OWNER">
      <div className="dashboard-container">
        <nav className="dashboard-nav">
          <div className="logo-wrapper">
            <img src="/logo.png" alt="Logo" className="logo" />
          </div>
          <div className="user-info">
            <span>Bienvenido, {user?.name}</span>
          </div>
        </nav>
        
        <main className="dashboard-content">
          <h1>Panel de Control - Propietario</h1>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h2>Mis Propiedades</h2>
              {/* Contenido de propiedades */}
            </div>
            
            <div className="dashboard-card">
              <h2>Inspecciones Pendientes</h2>
              {/* Lista de inspecciones */}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 