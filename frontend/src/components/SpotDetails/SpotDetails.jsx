import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import { fetchReviewsBySpot } from "../../store/reviews";
import { FaStar } from "react-icons/fa";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import ReviewFormModal from "../ReviewFormModal/ReviewFormModal";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";

import "./SpotDetails.css";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchReviewsBySpot(spotId));
  }, [dispatch, spotId]);

  const spot = useSelector((state) => state.spots[spotId]);
  const sessionUser = useSelector((state) => state.session.user);

  if (!spot || !spot.SpotImages || !spot.Owner)
    return <p>Loading spot details...</p>;

  const reviews = spot.Reviews || [];

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(1)
    : "New";

  const reviewCount = reviews.length;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const handleModalClose = () => {
    dispatch(fetchSpotDetails(spotId));
    dispatch(fetchReviewsBySpot(spotId));
  };

  return (
    <div className="spot-details">
      <div className="spot-details__header">
        <h1>{spot.name}</h1>
        <p>
          {spot.city}, {spot.state}, {spot.country}
        </p>
      </div>

      <div className="spot-details__images">
        {spot.SpotImages?.[0] && (
          <img
            src={spot.SpotImages[0].url}
            alt=""
            className="spot-details__main-image"
          />
        )}
        {spot.SpotImages?.slice(1, 5).map((img, i) => (
          <img key={i} src={img.url} alt={`Preview ${i}`} />
        ))}
      </div>

      <div className="spot-details__info">
        <div className="spot-details__description">
          <h2>
            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
          </h2>
          <p>{spot.description}</p>
        </div>

        <div className="spot-details__reserve-box">
          <div className="spot-details__price-rating">
            <p>
              <strong>${spot.price}</strong> night
            </p>
            <p>
              <FaStar className="spot-details__star-icon" /> {avgRating} ·{" "}
              {reviewCount} review{reviewCount !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => alert("Feature Coming Soon.")}>Reserve</button>
        </div>
      </div>

      <div className="spot-details__reviews">
        <h2>
          <FaStar className="spot-details__star-icon" /> {avgRating} ·{" "}
          {reviewCount} review{reviewCount !== 1 ? "s" : ""}
        </h2>

        {sessionUser &&
          sessionUser.id !== spot.ownerId &&
          !reviews.some((review) => review.userId === sessionUser.id) && (
            <OpenModalButton
              buttonText="Post Your Review"
              modalComponent={<ReviewFormModal spotId={spot.id} />}
              onModalClose={handleModalClose}
            />
          )}

        {reviews.length === 0 && sessionUser?.id !== spot.ownerId && (
          <p>Be the first to post a review!</p>
        )}

        {reviews.length > 0 &&
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <p>
                <strong>{review.User?.firstName || "Anonymous"}</strong>
              </p>
              <p>{formatDate(review.createdAt)}</p>
              <p>{review.review}</p>

              {sessionUser?.id === review.User?.id && (
                <OpenModalButton
                  buttonText="Delete"
                  className="review-delete-button"
                  modalComponent={<DeleteReviewModal reviewId={review.id} />}
                  onModalClose={handleModalClose}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
}

export default SpotDetails;
