'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfessionalProfileForm({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [regions, setRegions] = useState([])
  const [cities, setCities] = useState([])
  const [communes, setCommunes] = useState([])
  
  const [formData, setFormData] = useState({
    phone: '',
    profession: '',
    experience: '',
    specialties: [],
    regionId: '',
    cityId: '',
    communeId: '',
    profilePicture: null
  })

  // Lista de especialidades disponibles
  const availableSpecialties = [
    'Obra Gruesa',
    'Terminaciones',
    'Instalaciones Sanitarias',
    'Instalaciones Eléctricas',
    'Instalaciones de Gas',
    'Pavimentos',
    'Restauraciones',
    'Carpintería Interior'
  ]

  // Cargar regiones al montar el componente
  useEffect(() => {
    const fetchRegions = async () => {
      const response = await fetch('/api/locations/regions')
      const data = await response.json()
      setRegions(data)
    }
    fetchRegions()
  }, [])

  // Cargar ciudades cuando se selecciona una región
  useEffect(() => {
    if (formData.regionId) {
      const fetchCities = async () => {
        const response = await fetch(`/api/locations/cities?regionId=${formData.regionId}`)
        const data = await response.json()
        setCities(data)
      }
      fetchCities()
    }
  }, [formData.regionId])

  // Cargar comunas cuando se selecciona una ciudad
  useEffect(() => {
    if (formData.cityId) {
      const fetchCommunes = async () => {
        const response = await fetch(`/api/locations/communes?cityId=${formData.cityId}`)
        const data = await response.json()
        setCommunes(data)
      }
      fetchCommunes()
    }
  }, [formData.cityId])

  const handleSpecialtyChange = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('profession', formData.profession);
    formDataToSend.append('experience', formData.experience);
    formDataToSend.append('specialties', JSON.stringify(formData.specialties));
    formDataToSend.append('regionId', formData.regionId);
    formDataToSend.append('cityId', formData.cityId);
    formDataToSend.append('communeId', formData.communeId);

    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch('/api/profile/professional', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }

      router.replace('/profesional');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h1>Completa tu Perfil</h1>

      <div className="form-group">
        <label>Foto de Perfil</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Profesión</label>
        <input
          type="text"
          value={formData.profession}
          onChange={(e) => setFormData({...formData, profession: e.target.value})}
          required
          placeholder="Ej: Arquitecto, Ingeniero Civil"
        />
      </div>

      <div className="form-group">
        <label>Años de Experiencia</label>
        <input
          type="number"
          min="0"
          value={formData.experience}
          onChange={(e) => setFormData({...formData, experience: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Especialidades</label>
        <div className="specialties-grid">
          {availableSpecialties.map(specialty => (
            <label key={specialty} className="specialty-option">
              <input
                type="checkbox"
                checked={formData.specialties.includes(specialty)}
                onChange={() => handleSpecialtyChange(specialty)}
              />
              {specialty}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Región</label>
        <select
          value={formData.regionId}
          onChange={(e) => setFormData({...formData, regionId: e.target.value, cityId: '', communeId: ''})}
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

      <div className="form-group">
        <label>Ciudad</label>
        <select
          value={formData.cityId}
          onChange={(e) => setFormData({...formData, cityId: e.target.value, communeId: ''})}
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

      <div className="form-group">
        <label>Comuna</label>
        <select
          value={formData.communeId}
          onChange={(e) => setFormData({...formData, communeId: e.target.value})}
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

      {error && <span className="error-message">{error}</span>}
      
      <button 
        type="submit" 
        className="submit-button"
        disabled={loading}
      >
        {loading ? 'Guardando...' : 'Guardar Perfil'}
      </button>
    </form>
  )
} 