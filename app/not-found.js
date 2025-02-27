'use client'
import './components/auth/LoginTabs.css'

export default function NotFound() {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="register-header">
          <img src="/logo.png" alt="Logo" className="small-logo" />
          <h1 className="title">Página no encontrada</h1>
        </div>
        <p className="error-text">
          La página que buscas no existe.
        </p>
        <a href="/" className="submit-button" style={{ textDecoration: 'none', textAlign: 'center' }}>
          Volver al inicio
        </a>
      </div>
    </div>
  )
} 