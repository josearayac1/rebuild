'use client'

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST'
    })
    window.location.href = '/'
  }

  return (
    <button 
      onClick={handleLogout}
      className="submit-button"
      style={{ marginTop: '2rem' }}
    >
      Cerrar Sesión
    </button>
  )
} 