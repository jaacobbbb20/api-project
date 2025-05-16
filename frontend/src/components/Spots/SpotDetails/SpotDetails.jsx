import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from '../../../store/spots';
import { getSpotReviews, deleteReview } from "../../../store/reviews";
import { FaStar } from 'react-icons/fa';
import './SpotDetails.css';
import { useModal } from "../../../context/Modal";
import ReviewFormModal from "../../ReviewFormModal/ReviewFormModal";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector(state => state.spots.singleSpot);
  const reviews = useSelector(state => state.reviews.spot);
  const sessionUser = useSelector(state => state.session.user);
  const { setModalContent } = useModal();

  const userHasReview = sessionUser 
    ? reviews.some(review => review.userId === sessionUser.id)
    : false;

  useEffect(() => {
    dispatch(getSpotById(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <p>Loading spot details...</p>;

  if (!spot.name || !spot.description) {
    console.error('Invalid spot data:', spot);
    return <p>Error: Spot data is invalid</p>;
  }

  const previewImage = spot.SpotImages?.find(img => img.preview);
  const otherImages = spot.SpotImages?.filter(img => !img.preview).slice(0,4) || [];
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
    : "0.0";

  const isOwner = sessionUser && spot.Owner && sessionUser.id === spot.Owner.id;

  const handleClick = () => {
    alert('Feature not yet implemented. Coming soon...');
  };

  const handleDelete = async (reviewId) => {
    const confirmed = window.confirm('Are you sure you want to delete this review?');
    if (!confirmed) return;

    const result = await dispatch(deleteReview(reviewId));
    if (result === true) {
      dispatch(getSpotReviews(spotId));
    } else {
      alert('Failed to delete the review.');
    }
  };

  return (
    <div className="spot-details-wrapper">
      <div className="spot-heading">
        <h1>{spot.name}</h1>
        <h2>{spot.city}, {spot.state}, {spot.country}</h2>
      </div>

      <div className="spot-images-wrapper">
        <div className="preview-image-container">
          {previewImage && (
            <img 
              src={previewImage.url}
              alt={`${spot.name} preview`}
              className="preview-image"
            />
          )}
        </div>
        <div className="other-images-grid">
          {otherImages.map((img, i) => (
            <img
              key={i}
              src={img.url}
              alt={`Spot Image ${i + 1}`}
            />
          ))}
        </div>
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
          <div className="reserve-button-header">
            <div className="spot-information">
              <div className="spot-cost">
                <p>${spot.price} / night</p>
              </div>
              <div className="spot-rating">
                <FaStar className="star-icon" />
                <span>
                  {avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <button onClick={handleClick}>Reserve</button>
        </div>
      </div>

      <hr />

      <div className="spot-reviews">
        <div className="spot-reviews-header">
          <div className="spot-ratings">
            <FaStar className="star-img" />
            <span>
              {avgRating} · {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {sessionUser && !isOwner && !userHasReview && (
          <button onClick={() => setModalContent(<ReviewFormModal spotId={spotId} />)}>
            Post Your Review
          </button>
        )}

        {reviews.length > 0 && reviews.map(review => (
          <div key={review.id} className="review">
            <div className="review-header">
              <h4>{review.User?.firstName || 'Anonymous'}</h4>
              <p>{review.createdAt.slice(0,10)}</p>
            </div>
            
            <p>{review.review}</p>

            {sessionUser && review.userId === sessionUser.id && (
              <button 
                className="delete-review-btn" 
                onClick={() => handleDelete(review.id)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotDetails;
