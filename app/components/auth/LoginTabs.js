'use client'
import { useState } from 'react'
import './LoginTabs.css'
import { useRouter } from 'next/navigation'

export default function LoginTabs() {
  const [activeTab, setActiveTab] = useState('propietario')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('Intentando login con:', {
        email: formData.email,
        userType: activeTab === 'propietario' ? 'OWNER' : 'PROFESSIONAL'
      })

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: activeTab === 'propietario' ? 'OWNER' : 'PROFESSIONAL'
        })
      })

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      if (!response.ok) {
        throw new Error(data.error)
      }

      if (!data.user.profileCompleted) {
        router.replace('/profile/setup')
      } else {
        router.replace(data.user.userType === 'OWNER' ? '/dashboard' : '/profesional')
      }

    } catch (error) {
      console.error('Error en login:', error)
      setError(error.message)
      
      // Si el error menciona el tipo de usuario, cambiar automáticamente a la pestaña correcta
      if (error.message.includes('Propietario')) {
        setActiveTab('propietario')
      } else if (error.message.includes('Profesional')) {
        setActiveTab('profesional')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <img src="/logo.png" alt="Logo" className="logo" />
          </div>
        </div>

        {/* Título */}
        <h1 className="title">¡Bienvenido!</h1>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'propietario' ? 'active' : ''}`}
            onClick={() => setActiveTab('propietario')}
          >
            Propietario
          </button>
          <button
            className={`tab ${activeTab === 'profesional' ? 'active' : ''}`}
            onClick={() => setActiveTab('profesional')}
          >
            Profesional
          </button>
        </div>

        {/* Formulario actualizado */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-icons">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>
          {error && <span className="error-message">{error}</span>}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Links */}
        <div className="links">
          <a href="/recovery" className="forgot-password">
            ¿Perdiste tu contraseña?
          </a>
          <div className="register-link">
            ¿No tienes una cuenta?{' '}
            <a href="/register">Regístrate</a>
          </div>
        </div>
      </div>
    </div>
  )
} 