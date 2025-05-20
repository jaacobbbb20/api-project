import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import "./ReviewFormModal.css";

function StarRating({ stars, setStars }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating-container">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= (hover || stars) ? "filled" : ""}`}
            onClick={() => setStars(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            role="button"
            aria-label={`${star} Star`}
          >
            &#9733;
          </span>
        ))}
      </div>
      <span className="star-rating-label">Stars</span>
    </div>
  );
}

function ReviewFormModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReview = {
      review,
      stars: parseInt(stars, 10),
    };


    const res = await dispatch(createReview(spotId, newReview));

    if (res.errors) {
      setErrors(res.errors);
    } else {
      closeModal();
    }
  };

  return (
    <div
      className="review-modal__overlay"
      onClick={(e) => {
        if (e.target.classList.contains("review-modal__overlay")) {
          closeModal();
        }
      }}
    >
      <div className="review-modal">
        <h2 className="review-modal__title">How was your stay?</h2>
        <form onSubmit={handleSubmit}>
          {errors.map((err, idx) => (
            <p key={idx} className="review-modal__error">
              {err}
            </p>
          ))}

          <textarea
            placeholder="Leave your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />

          <StarRating stars={stars} setStars={setStars} />

          <button
            type="submit"
            disabled={review.trim().length < 10 || stars < 1}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReviewFormModal;
