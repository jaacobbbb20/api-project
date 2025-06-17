import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { postReview } from "../../store/reviews";
import { fetchSpotDetails } from "../../store/spots";
import "./ReviewFormModal.css";

function ReviewFormModal({ spotId, onModalClose }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [review, setReview] = useState("");
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const payload = { review, stars };

    try {
      await dispatch(postReview(spotId, payload));
      await dispatch(fetchSpotDetails(spotId));
      closeModal();
      if (onModalClose) onModalClose();
    } catch (res) {
      const data = await res.json();
      if (data && data.message) setErrors({ message: data.message });
    }
  };

  const isDisabled = review.length < 10 || stars < 1;

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h2>How was your stay?</h2>

      {errors.message && <p className="error">{errors.message}</p>}

      <textarea
        placeholder="Leave your review here..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <div className="star-input">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            className={num <= (hover || stars) ? "filled" : "empty"}
            onClick={() => setStars(num)}
            onMouseEnter={() => setHover(num)}
            onMouseLeave={() => setHover(stars)}
          >
            ★
          </span>
        ))}
        <span>Stars</span>
      </div>

      <button type="submit" disabled={isDisabled}>
        Submit Your Review
      </button>
    </form>
  );
}

export default ReviewFormModal;
