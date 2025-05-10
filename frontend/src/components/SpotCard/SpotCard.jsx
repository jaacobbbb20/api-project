import { NavLink } from "react-router-dom";
import './SpotCard.css'

function SpotCard({ spot }) {
  return (
    <NavLink to={`/spots/${spot.id}`} className='spot-card'>
      <img
        src={spot.previewImage}
        alt={spot.name}
        className="spot-image"
      />
      <div className="spot-details">
        <h3 className="spot-name">{spot.name}</h3>
        <p className="spot-location">{spot.city}, {spot.state}</p>
        <p className="spot-price">{spot.price}</p>
        <p className="spot-rating">{spot.rating}</p>
      </div>
    </NavLink>
  )
}

export default SpotCard;