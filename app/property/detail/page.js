"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import './PropertyDetail.css';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function PropertyDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    const fetchProperty = async () => {
      setLoading(true);
      const response = await fetch(`/api/properties?id=${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      }
      setLoading(false);
    };
    fetchProperty();
  }, [propertyId]);

  if (loading) {
    return <div className="login-container"><div className="login-card"><p className="loading-text">Cargando...</p></div></div>;
  }
  if (!property) {
    return <div className="login-container"><div className="login-card"><p className="error-text">Propiedad no encontrada</p></div></div>;
  }

  return (
    <ProtectedRoute allowedRole="OWNER">
      <div className="detailPage-container">
        <div className="detail-card">
          <div className="logo-title-row">
            <div className="logo-wrapper" onClick={() => router.push("/owner")}>
              <img src="/logo.png" alt="Logo" className="logo" />
            </div>
            <div className="property-title">
              <h2>{property.unitNumber} - {property.bedrooms}D+{property.bathrooms}B</h2>
              <div className="project-name">
                <span>Proyecto:</span> <span>{property.estateProject}</span>
              </div>
            </div>
            <button className="logout-button">Cerrar Sesión</button>
          </div>
          <div className="property-photos-details">
            <div className="property-photos">
              {property.photos && property.photos.length > 0 ? (
                property.photos.map((photo, idx) => (
                  <img key={idx} src={photo.url} alt={`Foto ${idx + 1}`} className="property-photo" />
                ))
              ) : (
                <img src="/placeholder-property.jpg" alt="Foto propiedad" className="property-photo" />
              )}
            </div>
            <div className="property-actions">
              <button className="edit-button">
                <span className="edit-icon">✏️</span> Editar
              </button>
              <span className="inspection-status">
                ESTADO DE INSPECCIÓN:{" "}
                <span className="inspection-status-value">
                  {property.inspections && property.inspections.length > 0
                    ? property.inspections[0].status
                    : "SIN INSPECCIÓN"}
                </span>
              </span>
            </div>
          </div>
          <div className="property-info-grid-a">
            <div className="property-info-column">
              <div><b>ID:</b> {property.id}</div>
              <div><b>Tipo de inmueble:</b> {property.propertyType?.name}</div>
              <div><b>Dormitorios:</b> {property.bedrooms}</div>
              <div><b>Baños:</b> {property.bathrooms}</div>
              <div><b>Superficie (m²):</b> {property.innerArea}</div>
              <div><b>Superficie Terraza (m²):</b> {property.terraceArea}</div>
            </div>
            <div className="property-info-column">
              <div><b>Status:</b> {property.status?.name}</div>
              <div><b>Dirección:</b> {property.address}</div>
              <div><b>Inmobiliaria:</b> {property.estateCompany}</div>
              <div><b>Región:</b> {property.region?.name}</div>
              <div><b>Ciudad:</b> {property.city?.name}</div>
              <div><b>Comuna:</b> {property.commune?.name}</div>
            </div>
          </div>
          <div className="property-actions-row-detail">
          <button
            className="history-button"
            onClick={() => router.push(`/inspection/record?propertyId=${property.id}`)}
            >
              <span className="history-icon">🕓</span> Historial de inspecciones
          </button>
            <button
              className="request-inspection-button"
              onClick={() => router.push(`/inspection?propertyId=${property.id}`)}
            >
              Solicitar Inspección
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 