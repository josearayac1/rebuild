import { useRouter } from 'next/navigation';

export default function PropertyCard({ property }) {
  const router = useRouter();
  const handleClick = () => {
    router.push(`/property/detail?id=${property.id}`);
    router.refresh();
  };
  return (
    <div className="property-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="property-image">
        <img src={property.image} alt={property.name} />
      </div>
      <div className="property-info">
        <div className="property-main">
          <span className="property-type">{property.type}</span>
          <span className="property-location">{property.location}</span>
        </div>
        <div className="property-details">
          <span>{property.size}m2</span>
          <span>{property.condition}</span>
        </div>
        <div className="property-address">
          <span>{property.address}</span>
          <span>{property.project}</span>
        </div>
      </div>
    </div>
  )
} 