'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
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
    innerArea: 0,
    terraceArea: 0,
    address: '',
    estateCompany: '',
    estateProject: '',
    unitNumber: '',
    regionId: '',
    cityId: '',
    communeId: ''
  });
  const [statuses, setStatuses] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [uploadError, setUploadError] = useState('');

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

  useEffect(() => {
    const fetchRegions = async () => {
      const response = await fetch('/api/locations/regions');
      const data = await response.json();
      setRegions(data);
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    if (formData.regionId) {
      const fetchCities = async () => {
        const response = await fetch(`/api/locations/cities?regionId=${formData.regionId}`);
        const data = await response.json();
        setCities(data);
      };
      fetchCities();
    } else {
      setCities([]);
      setFormData(prev => ({ ...prev, cityId: '', communeId: '' }));
    }
  }, [formData.regionId]);

  useEffect(() => {
    if (formData.cityId) {
      const fetchCommunes = async () => {
        const response = await fetch(`/api/locations/communes?cityId=${formData.cityId}`);
        const data = await response.json();
        setCommunes(data);
      };
      fetchCommunes();
    } else {
      setCommunes([]);
      setFormData(prev => ({ ...prev, communeId: '' }));
    }
  }, [formData.cityId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (images.length + acceptedFiles.length > 3) {
      setUploadError('Solo puedes subir hasta 3 imágenes');
      return;
    }

    const newPreviews = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setImagesPreviews(prev => [...prev, ...newPreviews]);
    setImages(prev => [...prev, ...acceptedFiles]);
    setUploadError('');
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxSize: 5242880,
  });

  useEffect(() => {
    return () => {
      imagesPreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
    };
  }, [imagesPreviews]);

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagesPreviews(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    images.forEach((image, index) => {
      formDataToSend.append(`images`, image);
    });

    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Error al crear la propiedad');
      }

      const data = await response.json();
    } catch (error) {
      console.error('Error:', error);
    }
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
                  name="innerArea" 
                  value={formData.innerArea} 
                  onChange={handleChange} 
                  />
              </div>

              <div className="propertyForm-group">
                <label>Terraza (m2)</label>
                <input 
                  type="number" 
                  name="terraceArea" 
                  value={formData.terraceArea} 
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

              <div className="propertyForm-group">
                <label>Inmobiliaria</label>
                <input 
                  type="text" 
                  name="estateCompany" 
                  value={formData.estateCompany} 
                  onChange={handleChange} 
                  />
              </div>

              <div className="propertyForm-group">
                <label>Proyecto Inmobiliario</label>
                <input 
                  type="text" 
                  name="estateProject" 
                  value={formData.estateProject} 
                  onChange={handleChange} 
                  />
              </div>

              <div className="propertyForm-group">
                <label>Numero de unidad</label>
                <input 
                  type="text" 
                  name="unitNumber" 
                  value={formData.unitNumber} 
                  onChange={handleChange} 
                  />
              </div>

              <div className="propertyForm-group">
                <label>Región</label>
                <select
                  name="regionId"
                  value={formData.regionId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una región</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="propertyForm-group">
                <label>Ciudad</label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  required
                  disabled={!formData.regionId}
                >
                  <option value="">Selecciona una ciudad</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="propertyForm-group">
                <label>Comuna</label>
                <select
                  name="communeId"
                  value={formData.communeId}
                  onChange={handleChange}
                  required
                  disabled={!formData.cityId}
                >
                  <option value="">Selecciona una comuna</option>
                  {communes.map(commune => (
                    <option key={commune.id} value={commune.id}>
                      {commune.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="propertyForm-group">
                <label>Fotografías de la Propiedad (Máximo 3)</label>
                <div 
                  {...getRootProps()} 
                  className={`dropzone ${isDragActive ? 'active' : ''}`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p>Suelta las imágenes aquí...</p>
                  ) : (
                    <p>Arrastra y suelta imágenes aquí, o haz clic para seleccionar</p>
                  )}
                </div>
                {uploadError && <p className="error-message">{uploadError}</p>}
                
                <div className="image-previews">
                  {imagesPreviews.map((preview, index) => (
                    <div key={index} className="preview-container">
                      <img src={preview.preview} alt={`Preview ${index + 1}`} />
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)}
                        className="remove-image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
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
