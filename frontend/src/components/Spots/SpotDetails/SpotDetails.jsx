import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSpotById } from "../../../store/spots";
import { getSpotReviews, deleteReview } from "../../../store/reviews";
import { FaStar } from "react-icons/fa";
import { useModal } from "../../../context/Modal";
import ReviewFormModal from "../../ReviewFormModal/ReviewFormModal";
import DeleteReviewModal from "../../DeleteReviewModal/DeleteReviewModal";
import "../../../context/Modal.css";
import "./SpotDetails.css";

function SpotDetails() {
  const { spotId } = useParams();
  const parsedSpotId = Number(spotId);
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.singleSpot);
  const reviews = useSelector((state) => state.reviews.spot);
  const sessionUser = useSelector((state) => state.session.user);
  const { setModalContent } = useModal();

  const userHasReview = sessionUser
    ? reviews.some((review) => review.userId === sessionUser.id)
    : false;

  useEffect(() => {
    if (!isNaN(parsedSpotId)) {
      dispatch(getSpotById(parsedSpotId));
      dispatch(getSpotReviews(parsedSpotId));
    }
  }, [dispatch, parsedSpotId]);

  if (!spot || (typeof spot === "object" && !spot.id)) {
    return <p>Loading spot details...</p>;
  }

  if (typeof spot !== "object" || Array.isArray(spot)) {
    console.error("Invalid spot data:", spot);
    return <p>Error: Spot data is invalid</p>;
  }

  const previewImage = spot.SpotImages?.find((img) => img.preview);
  const otherImages =
    spot.SpotImages?.filter((img) => !img.preview).slice(0, 4) || [];
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length).toFixed(
          1
        )
      : "0.0";

  const isOwner = sessionUser && spot.Owner && sessionUser.id === spot.Owner.id;

  const handleClick = () =>
    alert("Feature not yet implemented. Coming soon...");

  

  const sortedReviews = [...reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="spot-details-wrapper">
      <div className="spot-heading">
        <h1>{spot.name}</h1>
        <h2>
          {spot.city}, {spot.state}, {spot.country}
        </h2>
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
            <img key={i} src={img.url} alt={`Spot Image ${i + 1}`} />
          ))}
        </div>
      </div>

      <div className="spot-info">
        <div className="left-side">
          <h1>
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </h1>
          <p>{spot.description}</p>
        </div>

        <div className="reserve-button-container">
          <div className="spot-information">
            <div className="spot-cost">
              <span className="price-amount">${spot.price}</span>
              <span className="price-label"> / night</span>
            </div>

            <div className="spot-rating">
              <FaStar className="star-icon" />
              <span>
                {avgRating} · {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <button onClick={handleClick}>Reserve</button>
        </div>
      </div>

      <hr />

      <div className="spot-reviews">
        <div className="spot-reviews-header">
          <div className="spot-reviews-info">
            <div className="spot-review-summary">
              <FaStar className="star-img" />
              <span>
                {avgRating} · {reviews.length} review
                {reviews.length !== 1 ? "s" : ""}
              </span>
            </div>

            {sessionUser && !isOwner && !userHasReview && (
              <button
                className="post-review-btn"
                onClick={() =>
                  setModalContent(<ReviewFormModal spotId={parsedSpotId} />)
                }
              >
                Post Your Review
              </button>
            )}

            {sessionUser && !isOwner && reviews.length === 0 && (
              <p className="no-review-text">Be the first to post a review!</p>
            )}
          </div>
        </div>

        {sortedReviews.map((review) => (
          <div key={review.id} className="review">
            <div className="review-header">
              <h4>{review.User?.firstName || "Anonymous"}</h4>
              <p>
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            </div>
            <p>{review.review}</p>
            {sessionUser?.id === review.userId && (
              <button
                className="delete-review-btn"
                onClick={() =>
                  setModalContent(
                    <DeleteReviewModal
                      onDelete={() =>
                        dispatch(deleteReview(review.id)).then(() =>
                          dispatch(getSpotReviews(parsedSpotId))
                        )
                      }
                    />
                  )
                }
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
