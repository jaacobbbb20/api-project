import { useState } from "react";
import { useDispatch } from "react-redux";
import { createReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";
import "./ReviewFormModal.css";

function StarRating({ stars, setStars }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hover || stars) ? "filled" : ""}`}
          onClick={() => setStars(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          style={{ cursor: "pointer", fontSize: "2rem" }}
          role="button"
          aria-label={`${star} Star`}
        >
          &#9733;
        </span>
      ))}
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
      stars: parseInt(stars, 10), // Make sure it's a number
    };

    console.log("Submitting review:", newReview);

    const res = await dispatch(createReview(spotId, newReview));

    if (res.errors) {
      setErrors(res.errors);
    } else {
      closeModal();
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target.classList.contains("modal-overlay")) {
          closeModal();
        }
      }}
    >
      {" "}
      <div className="review-modal">
        <h2>Leave a Review</h2>
        <form onSubmit={handleSubmit}>
          {errors.map((err, idx) => (
            <p key={idx} className="error">
              {err}
            </p>
          ))}

          <textarea
            placeholder="Write your review here..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />

          <label>
            Stars:
            <StarRating stars={stars} setStars={setStars} />
          </label>

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
