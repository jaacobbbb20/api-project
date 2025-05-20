// frontend/src/components/DeleteReviewModal/DeleteReviewModal.jsx
import { useModal } from "../../context/Modal";
import "./DeleteReviewModal.css";

function DeleteReviewModal({ onDelete }) {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onDelete();
    closeModal();
  };

  return (
    <div className="delete-review-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this review?</p>
      <div className="delete-buttons">
        <button onClick={handleConfirm} className="confirm-delete">
          Yes (Delete Review)
        </button>
        <button onClick={closeModal} className="cancel-delete">
          No (Keep Review)
        </button>
      </div>
    </div>
  );
}

export default DeleteReviewModal;
