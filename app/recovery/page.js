'use client'
import { useState } from 'react'
import '../components/auth/LoginTabs.css'

export default function RecoveryPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setMessage('Se ha enviado un email con las instrucciones')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="register-header">
          <img src="/logo.png" alt="Logo" className="small-logo" />
          <h1 className="title">Recuperar Contraseña</h1>
        </div>
        
        <p className="recovery-text">
          Ingresa tu email y te enviaremos instrucciones para recuperar tu contraseña.
        </p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {error && <span className="error-message">{error}</span>}
          {message && <span className="success-message">{message}</span>}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Instrucciones'}
          </button>
        </form>

        <div className="links">
          <div className="register-link">
            <a href="/">Volver al inicio</a>
          </div>
        </div>
      </div>
    </div>
  )
} 