import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LogoutButton from '../components/auth/LogoutButton'; // Asegúrate de que el componente exista y esté correctamente importado
import SearchBar from '../components/dashboard/SearchBar'; // Aunque no se usará, lo dejamos por consistencia

const OwnerDashboard = ({ user }) => {
  const router = useRouter();
  const [properties, setProperties] = useState([]); // Estado para manejar las propiedades

  // Función para cargar propiedades, similar a cómo se cargarían las visitas en el dashboard profesional
  useEffect(() => {
    // Aquí iría la lógica para cargar las propiedades del propietario
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content-wrapper">
        <nav className="dashboard-nav">
          <div className="nav-left">
            <div className="logo-wrapper">
              <img src="/logo.png" alt="Logo" className="logo" />
            </div>
            <h1 className="nav-title">Dashboard Propietario</h1>
          </div>
          <div className="nav-right">
            <LogoutButton />
          </div>
        </nav>
        
        <main className="dashboard-content">
          <div className="visits-section">
            {/* Botón para ingresar nuevas propiedades */}
            <button className="add-property-button" onClick={() => router.push('/add-property')}>
              Agregar Propiedad
            </button>
            {/* Contenedor para las propiedades */}
            <div className="properties-container">
              {properties.map(property => (
                <div key={property.id} className="property-card">
                  {/* Componente de tarjeta de propiedad */}
                </div>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-header">
              <div className="profile-info">
                <h2 className="profile-title">Datos del Propietario</h2>
                <div className="profile-data">
                  <div className="profile-field">
                    <span className="profile-field-label">Nombre</span>
                    <span className="profile-field-value">{user?.name}</span>
                  </div>
                  {/* Otros campos */}
                </div>
              </div>
              <div className="profile-picture-container">
                {user?.profilePicture && (
                  <img 
                    src={user.profilePicture} 
                    alt="Foto de Perfil" 
                    className="profile-picture" 
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard; 