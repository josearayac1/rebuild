"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import "../Inspection.css";
import ProtectedRoute from "../../components/auth/ProtectedRoute";

export default function InspectionRecord() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const propertyId = searchParams.get("propertyId");
  const [inspections, setInspections] = useState([]);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) return;
    const fetchInspections = async () => {
      setLoading(true);
      // Obtiene inspecciones por propiedad
      const response = await fetch(`/api/inspections?propertyId=${propertyId}`);
      if (response.ok) {
        const data = await response.json();
        setInspections(data.inspections || []);
        setProperty(data.property || null);
      }
      setLoading(false);
    };
    fetchInspections();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="login-container">
        <div className="login-card">
          <p className="loading-text">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRole="OWNER">
      <div className="detailPage-container">
        <div className="detail-card-record" style={{ alignItems: "flex-start" }}>
          <div className="logo-title-row" style={{ marginBottom: 32 }}>
            <div className="logo-wrapper" onClick={() => router.push("/owner")}>
              <img src="/logo.png" alt="Logo" className="logo" />
            </div>
            <h2 style={{ textAlign: "center", letterSpacing: 1, fontWeight: 700 }}>
              Historial de inspecciones
            </h2>
            <button
              className="logout-button"
              onClick={() => router.push("/logout")}
            >
              Cerrar Sesión
            </button>
          </div>
          <div style={{ width: "100%" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", margin: "0 auto", marginTop: 32, marginBottom: 32}}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px" }}>Fecha</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Tipo Inmueble</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Tipología</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Proyecto</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Estatus</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Dirección</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Informe</th>
                </tr>
              </thead>
              <tbody>
                {inspections.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", padding: "16px" }}>
                      No hay inspecciones registradas.
                    </td>
                  </tr>
                ) : (
                  inspections.map((insp) => (
                    <tr key={insp.id}>
                      <td style={{ padding: "8px" }}>
                        {new Date(insp.visitDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {insp.property?.propertyType?.name || "-"}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {/* Tipología: ejemplo "3D2B" */}
                        {insp.property
                          ? `${insp.property.bedrooms || "-"}D${insp.property.bathrooms || "-"}B`
                          : "-"}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {insp.property?.estateProject || "-"}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {insp.status === "SOLICITADO"
                          ? "Pendiente"
                          : insp.status === "FINALIZADO"
                          ? "Completada"
                          : "Pendiente"}
                      </td>
                      <td style={{ padding: "8px" }}>
                        {insp.property?.address || "-"}
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        {insp.inspectionReport ? (
                          <span
                            style={{ cursor: "pointer" }}
                            title="Ver informe"
                            // onClick={() => ...} // Logica para ver/descargar el informe
                          >
                            📄
                          </span>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
