export const validateRegisterForm = (data) => {
  const errors = {}

  if (!data.name.trim()) {
    errors.name = 'El nombre es requerido'
  }

  if (!data.email.trim()) {
    errors.email = 'El email es requerido'
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = 'Email inválido'
  }

  if (!data.password) {
    errors.password = 'La contraseña es requerida'
  } else {
    if (data.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres'
    } else if (!(/[A-Za-z]/.test(data.password) && /[0-9]/.test(data.password))) {
      errors.password = 'La contraseña debe contener letras y números'
    }
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
  }

  return errors
} 