'use client'
import { useEffect, useState } from 'react'
import '../components/auth/LoginTabs.css'

export default function Unauthorized() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      setMessage('Debes iniciar sesión para acceder a esta página.')
    } else {
      setMessage('No tienes permisos para acceder a esta página.')
    }
  }, [])

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="register-header">
          <img src="/logo.png" alt="Logo" className="small-logo" />
          <h1 className="title">Acceso Denegado</h1>
        </div>
        <p className="error-text">
          {message}
        </p>
        <a href="/" className="submit-button" style={{ textDecoration: 'none', textAlign: 'center' }}>
          Volver al inicio
        </a>
      </div>
    </div>
  )
} 