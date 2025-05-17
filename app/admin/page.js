"use client";
import "./Admin.css";
import React, { useState } from 'react';
import ApuManager from '../components/admin/ApuManager';
import UserManager from '../components/admin/UserManager';
import PropertyManager from '../components/admin/PropertyManager';
import InspectionManager from '../components/admin/InspectionManager';


const TABS = [
  { key: 'usuarios', label: 'USUARIOS' },
  { key: 'propiedades', label: 'PROPIEDADES' },
  { key: 'inspecciones', label: 'INSPECCIONES' },
  { key: 'apu', label: 'A.P.U' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('apu'); // Por defecto APU

  const renderTab = () => {
    switch (activeTab) {
      case 'apu':
        return <ApuManager />;
      case 'usuarios':
        return <UserManager />;
      case 'propiedades':
        return <PropertyManager />;
      case 'inspecciones':
        return <InspectionManager />;
      default:
        return <div>Selecciona una pestaña</div>;
    }
  };

  return (
    <div className="background-admin-container" >
      <aside className="sidebar-container-admin">
        {TABS.map(tab => (
          <div
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={activeTab === tab.key ? 'active-tab-admin' : 'inactive-tab-admin'}
          >
            {tab.label}
          </div>
        ))}
      </aside>
      <main className="main-container-admin">
        {renderTab()}
      </main>
    </div>
  );
}