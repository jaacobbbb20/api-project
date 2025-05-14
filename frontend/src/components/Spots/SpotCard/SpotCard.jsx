import { NavLink } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import './SpotCard.css'

function SpotCard({ spot }) {
  return (
    <div className="spot-card-container">
      <NavLink to={`/spots/${spot.id}`} className='spot-card' title={spot.name}>
        <img
          src={spot.previewImage || "https://images.pexels.com/photos/963486/pexels-photo-963486.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" }
          alt={spot.name}
          className="spot-image"
        />
        <div className="spot-details">
          <div className="spot-detail-row">
            <div className="spot-left">
              <div className="spot-location">{spot.city}, {spot.state}</div>
              <div className="spot-price">${spot.price} / night</div>
            </div>
            <div className="spot-right">
              <div className="spot-rating">
                <FaStar className="star-icon" />
                {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'}
              </div>
            </div>
          </div>
        </div>
      </NavLink>
    </div>
  )
}

export default SpotCard;