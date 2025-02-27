export default function PropertyCard({ property }) {
  return (
    <div className="property-card">
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