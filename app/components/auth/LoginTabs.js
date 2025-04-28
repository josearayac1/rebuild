'use client'
import { useState } from 'react'
import './LoginTabs.css'
import { useRouter } from 'next/navigation'

export default function LoginTabs() {
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: 'OWNER'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      if (!data.user.profileCompleted) {
        router.replace('/profile/setup')
      } else {
        router.replace('/owner')
      }

    } catch (error) {
      setError(error.message)
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

        {/* Solo pestaña propietario */}
        {/* <div className="tabs">
          <button
            className="tab active"
            disabled
          >
            Propietario
          </button>
        </div> */}

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