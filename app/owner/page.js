'use client'
import { useState, useEffect } from 'react'
import ProtectedRoute from '../components/auth/ProtectedRoute'
import '../components/auth/LoginTabs.css'
import LogoutButton from '../components/auth/LogoutButton'
import { useRouter } from 'next/navigation'
import PropertyCard from '../components/property/PropertyCard'

export default function OwnerDashboard() {
  const [user, setUser] = useState(null)
  const [ownerData, setOwnerData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [loadingProperties, setLoadingProperties] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          fetchOwnerData(data.user.id);
          fetchProperties();
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchOwnerData = async (userId) => {
      try {
        const response = await fetch(`/api/owner/data?userId=${userId}`)
        if (response.ok) {
          const data = await response.json()
          setOwnerData(data)
        }
      } catch (error) {
        console.error('Error fetching owner data:', error)
      }
    }

    const fetchProperties = async () => {
      try {
        setLoadingProperties(true)
        const response = await fetch('/api/properties')
        if (response.ok) {
          const data = await response.json()
          setProperties(data)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoadingProperties(false)
      }
    }

    checkAuth()
  }, [])

  const handleCreateProperty = () => {
    router.push('../property/create')
  }

  if (loading) {
    return <div>Cargando...</div>
  }

  return (
    <ProtectedRoute allowedRole="OWNER">
      <div className="dashboard-container">
        <div className="dashboard-content-wrapper">
          <nav className="dashboard-nav">
            <div className="nav-left">
              <div className="logo-wrapper">
                <img src="/logo.png" alt="Logo" className="logo" />
              </div>
              <h1 className="nav-title">Propietario</h1>
            </div>
            <div className="nav-right">
              <LogoutButton />
            </div>
          </nav>
          
          <main className="dashboard-content">
            {/* Columna izquierda */}
            <div className="visits-section">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ margin: 0 }}>Propiedades</h2>
                <button
                  onClick={handleCreateProperty}
                  style={{
                    backgroundColor: '#f0ad4e',
                    border: 'none',
                    color: 'white',
                    padding: '10px 20px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'inline-block',
                    fontSize: '16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '200px'
                  }}
                >
                  Crear Propiedad
                </button>
              </div>
              <div className="visits-container">
                {loadingProperties ? (
                  <p style={{ color: '#888', marginTop: 32 }}>Cargando propiedades...</p>
                ) : properties.length === 0 ? (
                  <p style={{ color: '#888', marginTop: 32 }}>No tienes propiedades ingresadas aún.</p>
                ) : (
                  properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="profile-section">
              <div className="profile-header">
                <div className="profile-info">
                  <h2 className="profile-title">Datos del Propietario</h2>
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
                      <span className="profile-field-value">{user?.ownerProfile?.phone}</span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Dirección</span>
                      <span className="profile-field-value">{user?.ownerProfile?.address}</span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Región</span>
                      <span className="profile-field-value">
                        {user?.ownerProfile?.region?.name}
                      </span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Ciudad</span>
                      <span className="profile-field-value">
                        {user?.ownerProfile?.city?.name}
                      </span>
                    </div>
                    <div className="profile-field">
                      <span className="profile-field-label">Comuna</span>
                      <span className="profile-field-value">
                        {user?.ownerProfile?.commune?.name}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="profile-picture-container">
                  {user?.ownerProfile?.profilePicture && (
                    <img 
                      src={user?.ownerProfile?.profilePicture} 
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