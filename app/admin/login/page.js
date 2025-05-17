"use client"
import React, { useState } from "react";
import "../Admin.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: usuario, password: contrasena, userType: "ADMIN" })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }
      // Redirigir al dashboard del admin o página principal del mantenedor
      router.push("/admin");
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="background-admin-container">
      <div className="white-container-admin">
        <div  className="logo-container-admin">
          <div className="logo-wrapper-admin">
            <img src="/logo.png" alt="Logo" className="logo-admin" />
          </div>
        </div>
        <h1 className="title-admin">ADMINISTRADOR</h1>
        <form className="login-form-admin" onSubmit={handleSubmit} >
          <div className="form-group-admin">
            <label>Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="form-group-admin">
            <label>Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              required
            />
          </div>
          {error && <div style={{ color: "#d32f2f", marginBottom: 12, fontSize: 14 }}>{error}</div>}
          <button
            type="submit"
            className="submit-button-admin"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
