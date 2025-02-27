'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OwnerProfileForm({ user }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [regions, setRegions] = useState([])
  const [cities, setCities] = useState([])
  const [communes, setCommunes] = useState([])
  
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    company: '',  // opcional
    regionId: '',
    cityId: '',
    communeId: '',
    profilePicture: null
  })

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formDataToSend = new FormData();
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('company', formData.company);
    formDataToSend.append('regionId', formData.regionId);
    formDataToSend.append('cityId', formData.cityId);
    formDataToSend.append('communeId', formData.communeId);
    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    try {
      const response = await fetch('/api/profile/owner', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error)
      }

      router.replace('/dashboard')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({...formData, profilePicture: file})
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      
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
        <label>Dirección</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required
        />
      </div>

      <div className="form-group">
        <label>Empresa (opcional)</label>
        <input
          type="text"
          value={formData.company}
          onChange={(e) => setFormData({...formData, company: e.target.value})}
        />
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