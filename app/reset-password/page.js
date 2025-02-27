'use client'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import '../components/auth/LoginTabs.css'

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    alphanumeric: false,
    match: false
  })

  // Validar contraseña en tiempo real
  useEffect(() => {
    const { password, confirmPassword } = formData
    setPasswordStrength({
      length: password.length >= 6,
      alphanumeric: /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      match: password && confirmPassword && password === confirmPassword
    })
  }, [formData.password, formData.confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar requisitos de contraseña
    if (!passwordStrength.length || !passwordStrength.alphanumeric) {
      setError('La contraseña debe tener al menos 6 caracteres y contener letras y números')
      return
    }

    if (!passwordStrength.match) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error)
      }

      setSuccess(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="login-container">
        <div className="login-card">
          <h1 className="title">¡Contraseña Actualizada!</h1>
          <p className="recovery-text">
            Tu contraseña ha sido actualizada exitosamente.
          </p>
          <a href="/" className="submit-button" style={{ textDecoration: 'none', textAlign: 'center' }}>
            Ir al login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">Nueva Contraseña</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            {formData.password && (
              <div className="password-requirements">
                <p className={passwordStrength.length ? 'requirement-met' : 'requirement'}>
                  ✓ Mínimo 6 caracteres
                </p>
                <p className={passwordStrength.alphanumeric ? 'requirement-met' : 'requirement'}>
                  ✓ Debe contener letras y números
                </p>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
            {formData.confirmPassword && (
              <div className="password-requirements">
                <p className={passwordStrength.match ? 'requirement-met' : 'requirement'}>
                  ✓ Las contraseñas coinciden
                </p>
              </div>
            )}
          </div>
          {error && <span className="error-message">{error}</span>}
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
      </div>
    </div>
  )
} 