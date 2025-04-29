'use client'
import { useState, useEffect } from 'react'
import { validateRegisterForm } from '../../utils/validations'
import './LoginTabs.css'  // Reutilizamos los estilos base
import Snackbar from '../common/Snackbar'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'propietario'
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    alphanumeric: false,
    match: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMsg, setSnackbarMsg] = useState('')

  // Validar contraseña en tiempo real
  useEffect(() => {
    const { password, confirmPassword } = formData
    setPasswordStrength({
      length: password.length >= 6,
      alphanumeric: /[A-Za-z]/.test(password) && /[0-9]/.test(password),
      match: password && confirmPassword && password === confirmPassword
    })
  }, [formData.password, formData.confirmPassword])

  // Validar email en tiempo real
  const validateEmail = (email) => {
    if (!email) {
      setEmailError('El email es requerido')
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setEmailError('Ingresa un email válido')
      return
    }

    setEmailError('')
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Validar email mientras se escribe
    if (name === 'email') {
      validateEmail(value)
    }

    // Limpiar error del campo que se está editando
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validar formulario
    const validationErrors = validateRegisterForm(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: 'propietario'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario')
      }

      // Registro exitoso - mostrar snackbar y redirigir
      setSnackbarMsg('Creación de usuario completada');
      setSnackbarOpen(true);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
      return;

    } catch (error) {
      setErrors({ submit: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card register-card">
        {/* Logo pequeño y título */}
        <div className="register-header">
          <img src="/logo.png" alt="Logo" className="small-logo" />
          <h1 className="title">Crea tu Cuenta</h1>
        </div>

        {/* Solo pestaña propietario 
        <div className="tabs">
          <button
            className="tab active"
            disabled
          >
            Propietario
          </button>
        </div> */}

        {/* Formulario */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {emailError && <span className="error-message">{emailError}</span>}
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
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirmar contraseña</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <span className="material-icons">
                  {showConfirmPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="password-requirements">
                <p className={passwordStrength.match ? 'requirement-met' : 'requirement'}>
                  ✓ Las contraseñas coinciden
                </p>
              </div>
            )}
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
          {errors.submit && <span className="error-message">{errors.submit}</span>}
        </form>

        {/* Link para volver al login */}
        <div className="links">
          <div className="register-link">
            ¿Ya tienes una cuenta?{' '}
            <a href="/">Inicia sesión</a>
          </div>
        </div>
      </div>
      <Snackbar
        message={snackbarMsg}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        duration={2000}
      />
    </div>
  )
} 