'use client'
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../auth/ProtectedRoute';
import '../auth/Logintabs.css'
import './PropertyForm.css'
import LogoutButton from '../auth/LogoutButton'

export default function PropertyForm() {
  const [formData, setFormData] = useState({
    statusId: '',
    propertyTypeId: '',
    bedrooms: 0,
    bathrooms: 0,
    surface: 0,
    terrace: 0,
    address: ''
  });
  const [statuses, setStatuses] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusResponse, typeResponse] = await Promise.all([
          fetch('/api/properties?type=status'),
          fetch('/api/properties?type=propertyType')
        ]);

        if (statusResponse.ok && typeResponse.ok) {
          const statusData = await statusResponse.json();
          const typeData = await typeResponse.json();
          setStatuses(statusData);
          setPropertyTypes(typeData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Aquí se manejaría la lógica para enviar los datos al backend
  };

  return (
    <ProtectedRoute allowedRole="OWNER">
      <div className="propertyForm-container" >
        <div className="propertyForm-content-wrapper">
          <nav className="propertyForm-nav">
            <div className="nav-left">
                <div className="logo-wrapper">
                  <img src="/logo.png" alt="Logo" className="logo" />
                </div>
                <h1 className="nav-title">Ingresar Propiedad</h1>
              </div>
              <div className="nav-right">
                <LogoutButton />
              </div>
          </nav>

          <main >

            <form onSubmit={handleSubmit} className="propertyForm-content">

              <div className="propertyForm-group">
                <label>Status</label>
                <select 
                  name="statusId" 
                  value={formData.statusId} 
                  onChange={handleChange}
                  className="propertyForm-select"
                >
                  <option value="">Seleccionar Status</option>
                  {statuses.map(status => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="propertyForm-group">
                <label>Tipo de Inmueble</label>
                <select 
                  name="propertyTypeId" 
                  value={formData.propertyTypeId} 
                  onChange={handleChange}
                  className="propertyForm-select"
                >
                  <option value="">Seleccionar Tipo</option>
                  {propertyTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="propertyForm-group">
                <label>Dormitorios</label>
                <input 
                  type="number" 
                  name="bedrooms" 
                  value={formData.bedrooms} 
                  onChange={handleChange} 
                  />
              </div>
              
              <div className="propertyForm-group">
                <label>Baños</label>
                <input 
                  type="number" 
                  name="bathrooms" 
                  value={formData.bathrooms} 
                  onChange={handleChange} 
                  />
              </div>

              <div className="propertyForm-group">
                <label>Superficie</label>
                <input 
                  type="number" 
                  name="surface" 
                  value={formData.surface} 
                  onChange={handleChange} 
                  />
              </div>

              <div className="propertyForm-group">
                <label>Terraza (m2)</label>
                <input 
                  type="number" 
                  name="terrace" 
                  value={formData.terrace} 
                  onChange={handleChange} 
                  />
              </div>
              
              <div className="propertyForm-group">
                <label>Dirección</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  />
              </div>
              
              <button type="submit" className="submitCreateProperty-button">
                Crear Propiedad
                </button>
            </form>

          </main>
          
        </div>
    </div>
    </ProtectedRoute>
    
  );
}
