import React, { useState } from 'react';

export default function PropertyForm() {
  const [formData, setFormData] = useState({
    status: '',
    propertyType: '',
    bedrooms: 0,
    bathrooms: 0,
    surface: 0,
    terrace: 0,
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
    // Aquí se manejaría la lógica para enviar los datos al backend
  };

  return (
    <div className="property-form-container" style={{ backgroundColor: 'orange' }}>
      <form onSubmit={handleSubmit} style={{ padding: '20px', backgroundColor: 'white' }}>
        <label>Status</label>
        <input type="text" name="status" value={formData.status} onChange={handleChange} />

        <label>Tipo de Inmueble</label>
        <input type="text" name="propertyType" value={formData.propertyType} onChange={handleChange} />

        <label>Dormitorios</label>
        <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} />

        <label>Baños</label>
        <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} />

        <label>Superficie</label>
        <input type="number" name="surface" value={formData.surface} onChange={handleChange} />

        <label>Terraza (m2)</label>
        <input type="number" name="terrace" value={formData.terrace} onChange={handleChange} />

        <label>Dirección</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />

        <button type="submit">Crear Propiedad</button>
      </form>
    </div>
  );
}
