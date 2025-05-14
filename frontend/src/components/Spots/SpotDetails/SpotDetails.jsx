import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from '../../../store/spots';
import { getSpotReviews } from "../../../store/reviews";
import './SpotDetails.css'

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.singleSpot);
  const reviews = useSelector(state => state.reviews.spot);
  const handleClick = () => {
    alert('Feature not yet implemented. Coming soon...')
  };

  useEffect(() => {
    dispatch(getSpotById(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

if (!spot) return <p>Loading spot details...</p>;

if (!spot.name || !spot.description) {
  console.error('Invalid spot data:', spot);
  return <p>Error: Spot data is invalid</p>;
}
  return (
    <div className="spot-details-wrapper">
      <div className="spot-heading">
        <h1>{spot.name}</h1>
        <h2>{spot.city}, {spot.state}, {spot.country}</h2>
      </div>

      <div className="spot-images">
        {spot.SpotImages.length > 0 && (
          <img 
            src={spot.SpotImages[0].url} 
            alt={`Image of ${spot.name}`} 
            className="spot-main-image"
          />
        )}
      </div>
      
      <div className="spot-info">
        <div className="left-side">
          <div className="spot-owner">
            <h1>Hosted by {spot.Owner ? `${spot.Owner.firstName} ${spot.Owner.lastName}` : `Unknown`}</h1>
          </div>
          <div className="spot-description">
            <p>{spot.description}</p>
          </div>
        </div>

        <div className="reserve-button-container">
          <p>${spot.price} / night</p>
          <button onClick={handleClick}>Reserve</button>
        </div>
      </div>

      <hr />

      <div className="spot-reviews">
        <h2>Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews yet!</p>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="review">
              <h4>{review.User?.firstName || 'Anonymous'}</h4>
              <p>{review.createdAt.slice(0,10)}</p>
              <p>{review.review}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default SpotDetails;