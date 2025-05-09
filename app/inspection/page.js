"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import "./Inspection.css";
import ProtectedRoute from "../components/auth/ProtectedRoute";

export default function InspectionRequest() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("propertyId");
  const [property, setProperty] = useState(null);
  const [visitDate, setVisitDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!visitDate) {
      setError("Debes seleccionar una fecha de visita.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/inspections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: Number(propertyId),
          visitDate,
          instructions,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Error al solicitar inspección");
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = `/property/detail?id=${propertyId}`;
        }, 2000);
      }
    } catch (err) {
      setError("Error de red o del servidor");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="login-container"><div className="login-card"><p className="loading-text">Cargando...</p></div></div>;
  }
  if (!property) {
    return <div className="login-container"><div className="login-card"><p className="error-text">Propiedad no encontrada</p></div></div>;
  }

  return (
    <ProtectedRoute allowedRole="OWNER">
      <div className="detailPage-container">
        <div className="detail-card" style={{ justifyContent: "flex-start" }}>
          <div className="logo-title-row">
            <div className="logo-wrapper" onClick={() => router.push("/owner")}>
              <img src="/logo.png" alt="Logo" className="logo" />
            </div>
            <div className="property-title">
              <h2>
                {property.unitNumber} - {property.bedrooms}D+{property.bathrooms}B
              </h2>
              <div className="project-name">
                <span>Proyecto:</span> <span>{property.estateProject}</span>
              </div>
            </div>
            <button className="logout-button" onClick={() => router.push("/logout")}>
              Cerrar Sesión
            </button>
          </div>
          <div className="inspection-content-row">
            <form onSubmit={handleSubmit} className="inspection-form">
              <div>
                <label style={{ fontWeight: 500 }}>Fecha de visita</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: 8,
                      borderRadius: 4,
                      border: "1px solid #FFA500",
                      outline: "none",
                    }}
                  />
                  <span className="material-icons" style={{ color: "#FFA500" }}>calendar_today</span>
                </div>
              </div>
              <div style={{ margin: "24px 0" }}>
                <label style={{ fontWeight: 500 }}>Instrucciones y comentarios</label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 4,
                    border: "1px solid #FFA500",
                    outline: "none",
                    resize: "none",
                  }}
                />
              </div>
              {error && <div className="error-text">{error}</div>}
              {success && <div style={{ color: "#FFA500", marginBottom: 8 }}>¡Inspección solicitada!</div>}
              <button
                type="submit"
                className="request-inspection-button"
                disabled={submitting}
                style={{ width: "fit-content", marginTop: 16 }}
              >
                {submitting ? "Solicitando..." : "Solicitar Inspección"}
              </button>
            </form>
            <div className="inspection-property-info">
              <div className="property-photos">
                {property.photos && property.photos.length > 0 ? (
                  property.photos.map((photo, idx) => (
                    <img key={idx} src={photo.url} alt={`Foto ${idx + 1}`} className="property-photo" />
                  ))
                ) : (
                  <img src="/placeholder-property.jpg" alt="Foto propiedad" className="property-photo" />
                )}
              </div>
              <div className="property-info-grid">
                <div className="property-info-column">
                  <div><b>Status: </b> {property.status?.name}</div>
                  <div><b>Tipo de inmueble: </b> {property.propertyType?.name}</div>
                  <div><b>Dormitorios: </b> {property.bedrooms}</div>
                  <div><b>Baños: </b> {property.bathrooms}</div>
                  <div><b>Superficie (m²): </b> {property.innerArea}</div>
                  <div><b>Superficie Terraza (m²): </b> {property.terraceArea}</div>
                  <div><b>Dirección: </b> {property.address}</div>
                  <div><b>Inmobiliaria: </b> {property.estateCompany}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
