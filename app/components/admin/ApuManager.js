import React, { useState, useEffect } from 'react';
import '../../admin/Admin.css';
import './Manager.css';
import Snackbar from '../common/Snackbar';

export default function ApuManager() {
  const [apus, setApus] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // Estados para crear APU
  const [apuName, setApuName] = useState('');
  const [categories, setCategories] = useState([]); // [{ name, details: [{...}] }]
  const [unitOptions, setUnitOptions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [total, setTotal] = useState(0);

  // Para nueva categoría
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (!showCreate) fetchApus();
  }, [search, showCreate]);

  useEffect(() => {
    if (showCreate) fetchUnits();
  }, [showCreate]);

  useEffect(() => {
    // Calcular total
    let t = 0;
    categories.forEach(cat => {
      cat.details.forEach(det => {
        t += Number(det.subtotal) || 0;
      });
    });
    setTotal(t);
  }, [categories]);

  const fetchApus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/apu?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setApus(data);
    } catch (err) {
      setApus([]);
    }
    setLoading(false);
  };

  const fetchUnits = async () => {
    try {
      const res = await fetch('/api/unitapu');
      if (res.ok) {
        const data = await res.json();
        setUnitOptions(data);
      }
    } catch (err) {
      setUnitOptions([]);
    }
  };

  // Agregar nueva categoría
  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.some(c => c.name === newCategoryName.trim())) {
      setCategories([...categories, { name: newCategoryName.trim(), details: [] }]);
      setNewCategoryName('');
      setShowCategoryInput(false);
    }
  };

  // Agregar nuevo detalle a una categoría
  const handleAddDetail = (catIdx) => {
    setCategories(categories => categories.map((cat, idx) => {
      if (idx !== catIdx) return cat;
      return {
        ...cat,
        details: [
          ...cat.details,
          { description: '', yield: '', unitApuId: '', unitPrice: '', subtotal: 0 }
        ]
      };
    }));
  };

  // Actualizar detalle
  const handleDetailChange = (catIdx, detIdx, field, value) => {
    setCategories(categories => categories.map((cat, idx) => {
      if (idx !== catIdx) return cat;
      const details = cat.details.map((det, dIdx) => {
        if (dIdx !== detIdx) return det;
        let newDet = { ...det, [field]: value };
        // Calcular subtotal si corresponde
        if (['yield', 'unitPrice'].includes(field)) {
          const rendimiento = parseFloat(field === 'yield' ? value : newDet.yield);
          const precio = parseFloat(field === 'unitPrice' ? value : newDet.unitPrice);
          if (!isNaN(rendimiento) && !isNaN(precio)) {
            newDet.subtotal = +(rendimiento * precio).toFixed(2);
          } else {
            newDet.subtotal = 0;
          }
        }
        return newDet;
      });
      return { ...cat, details };
    }));
  };

  // Validar y guardar APU
  const handleSaveApu = async () => {
    setError('');
    setSuccess('');
    if (!apuName.trim()) {
      setError('El nombre de partida es obligatorio');
      return;
    }
    if (categories.length === 0) {
      setError('Debes agregar al menos una categoría');
      return;
    }
    for (const cat of categories) {
      if (!cat.name.trim()) {
        setError('El nombre de cada categoría es obligatorio');
        return;
      }
      if (!cat.details.length) {
        setError('Cada categoría debe tener al menos un detalle');
        return;
      }
      for (const det of cat.details) {
        if (!det.description.trim() || !det.yield || !det.unitApuId || !det.unitPrice) {
          setError('Todos los campos de los detalles son obligatorios');
          return;
        }
      }
    }
    // Enviar a backend
    const res = await fetch('/api/apu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: apuName, categories })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Error al guardar el APU');
      return;
    }
    setSuccess('APU guardado correctamente');
    setSnackbarOpen(true);
    setTimeout(() => {
      setShowCreate(false);
      setApuName('');
      setCategories([]);
      setError('');
      setSuccess('');
      setSnackbarOpen(false);
    }, 1200);
  };

  if (showCreate) {
    return (
      <div className="apu-container">
        <div className="apu-title">Análisis de Precios Unitarios</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ width: '60%' }}>
            <label className="apu-label">Nombre de Partida</label>
            <input
              className="apu-input"
              placeholder="ejemplo: Cerámica (Piso)"
              value={apuName}
              onChange={e => setApuName(e.target.value)}
            />
          </div>
          <button className="apu-btn" type="button" onClick={() => setShowCategoryInput(true)} 
                  style={{marginLeft: 60 }}
            >
            Nueva Categoría
          </button>
        </div>
        {showCategoryInput && (
          <div className="apu-category-box" style={{ marginBottom: 24 }}>
            <input
              className="apu-input apu-category-input"
              placeholder="ejemplo: 1. Mano de obra"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
            />
            <button className="apu-btn" type="button" onClick={handleAddCategory}>
              Agregar
            </button>
            <button className="apu-btn" type="button" onClick={() => { setShowCategoryInput(false); setNewCategoryName(''); }}>
              Cancelar
            </button>
          </div>
        )}
        <div className="apu-section">
          {categories.length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>Agrega una categoría para comenzar</div>}
          {categories.map((cat, catIdx) => (
            <div key={catIdx} style={{ marginBottom: 32, borderBottom: '1px solid #FFA500', paddingBottom: 24 }}>
              <div style={{ fontWeight: 600, color: '#FFA500', marginBottom: 8 }}>{cat.name}</div>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                <span className="apu-label" style={{ minWidth: 120 }}>Descripción</span>
                <span className="apu-label" style={{ minWidth: 100 }}>Rendimiento</span>
                <span className="apu-label" style={{ minWidth: 60 }}>Uni.</span>
                <span className="apu-label" style={{ minWidth: 120 }}>Precio Unitario (U.F)</span>
                <span className="apu-label" style={{ minWidth: 120 }}>Subtotal Sin IVA (U.F)</span>
              </div>
              {cat.details.map((det, detIdx) => (
                <div key={detIdx} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
                  <input
                    className="apu-input"
                    style={{ minWidth: 180 }}
                    placeholder="ejemplo: Ceramista"
                    value={det.description}
                    onChange={e => handleDetailChange(catIdx, detIdx, 'description', e.target.value)}
                  />
                  <input
                    className="apu-input"
                    style={{ minWidth: 80 }}
                    type="number"
                    min="0"
                    value={det.yield}
                    onChange={e => handleDetailChange(catIdx, detIdx, 'yield', e.target.value)}
                  />
                  <select
                    className="apu-input"
                    style={{ minWidth: 80 }}
                    value={det.unitApuId}
                    onChange={e => handleDetailChange(catIdx, detIdx, 'unitApuId', e.target.value)}
                  >
                    <option value="">Unidad</option>
                    {unitOptions.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                  <input
                    className="apu-input"
                    style={{ minWidth: 100 }}
                    type="number"
                    min="0"
                    value={det.unitPrice}
                    onChange={e => handleDetailChange(catIdx, detIdx, 'unitPrice', e.target.value)}
                  />
                  <input
                    className="apu-input"
                    style={{ minWidth: 120, background: '#f8f8f8' }}
                    value={det.subtotal}
                    readOnly
                  />
                </div>
              ))}
              <div style={{display: 'flex' }}>
                <button className="apu-btn" type="button" onClick={() => handleAddDetail(catIdx)} style={{ marginTop: 8, marginLeft: 'auto'  }}>
                  Nuevo detalle
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <span style={{ fontWeight: 600 }}>Subtotal</span>
                <input
                  className="apu-input"
                  style={{ minWidth: 120, background: '#f8f8f8', marginLeft: 16 }}
                  value={cat.details.reduce((s, d) => s + (Number(d.subtotal) || 0), 0)}
                  readOnly
                />
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 24 }}>
            <span style={{ fontWeight: 700, fontSize: 18, marginRight: 16 }}>TOTAL</span>
            <input
              className="apu-input"
              style={{ minWidth: 140, background: '#f8f8f8', fontWeight: 700, fontSize: 18 }}
              value={total}
              readOnly
            />
          </div>
        </div>
        {error && <div style={{ color: '#d32f2f', marginTop: 16, textAlign: 'center' }}>{error}</div>}
        <Snackbar
          message={success}
          open={snackbarOpen}
          onClose={() => setSnackbarOpen(false)}
          duration={2000}
        />
        <div className="apu-actions">
          <button className="apu-btn" type="button" onClick={() => setShowCreate(false)}>
            Volver al listado
          </button>
          <button className="apu-btn" type="button" onClick={handleSaveApu}>
            Guardar A.P.U
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apu-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="apu-title">Análisis de Precios Unitarios</h2>
        <button className="create-apu-button" onClick={() => setShowCreate(true)}>
          Ingresar A.P.U
        </button>
      </div>
      <input
        className="apu-input apu-search"
        type="text"
        placeholder="Buscar ítem"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
        <div style={{ width: '80%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginBottom: 8 }}>
            <span>Ítem</span>
            <span>Valor Sin I.V.A (U.F)</span>
          </div>
          {loading ? (
            <div>Cargando...</div>
          ) : (
            apus.map(apu => (
              <div key={apu.id} className="apu-list-item">
                <span>{apu.name}</span>
                <span>Total: {apu.total}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
