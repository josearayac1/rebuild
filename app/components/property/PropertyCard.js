import React from 'react';
import styles from './PropertyCard.module.css';

export default function PropertyCard({ property }) {
  const mainPhoto = property.photos?.[0]?.url || '/placeholder-property.jpg';
  const dormitorios = property.bedrooms;
  const banos = property.bathrooms;
  const comuna = property.commune?.name || '';
  const ciudad = property.city?.name || '';
  const superficie = property.innerArea ? `${property.innerArea}m2` : '';
  const direccion = property.address || '';
  const estado = property.status?.name || '';
  const proyecto = property.estateProject || '';
  const inmobiliaria = property.estateCompany || '';
  const id = property.id;

  return (
    <div className={styles.card}>
      {/* Columna 1: Imagen */}
      <div className={styles.imageWrapper}>
        <img src={mainPhoto} alt="Foto propiedad" className={styles.image} />
      </div>
      {/* Columna 2: ID, dormitorios+baños, estado */}
      <div className={styles.infoCol}>
        <div className={styles.id}>ID: {id}</div>
        <div className={styles.bold}>{dormitorios}D + {banos}B</div>
        <div>{estado}</div>
      </div>
      {/* Columna 3: superficie, proyecto, inmobiliaria */}
      <div className={styles.infoCol}>
        <div>{superficie}</div>
        <div>{proyecto}</div>
        <div>{inmobiliaria}</div>
      </div>
      {/* Columna 4: dirección, comuna, ciudad */}
      <div className={styles.infoCol} style={{ alignItems: 'flex-end', textAlign: 'right' }}>
        <div>{direccion}</div>
        <div>{comuna}</div>
        <div>{ciudad}</div>
      </div>
    </div>
  );
} 