'use client'
import './LoginTabs.css'

export default function RecoveryForm() {
  return (
    <div className="login-container">
      <div className="login-card register-card">
        {/* Logo pequeño y título */}
        <div className="register-header">
          <img src="/logo.png" alt="Logo" className="small-logo" />
          <h1 className="title">Recuperar Contraseña</h1>
        </div>

        {/* Mensaje explicativo */}
        <p className="recovery-text">
          Ingresa tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña.
        </p>

        {/* Formulario */}
        <form className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>
          <button type="submit" className="submit-button">
            Enviar Instrucciones
          </button>
        </form>

        {/* Link para volver al login */}
        <div className="links">
          <div className="register-link">
            <a href="/">Volver al inicio de sesión</a>
          </div>
        </div>
      </div>
    </div>
  )
} 