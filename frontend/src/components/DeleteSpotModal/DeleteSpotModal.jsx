import { useModal } from "../../context/Modal";
import "./DeleteSpotModal.css";

function DeleteSpotModal({ onDelete }) {
  const { closeModal } = useModal();

  const handleConfirm = () => {
    onDelete();
    closeModal();
  };

  return (
    <div className="delete-spot-modal">
      <h2>Confirm Delete</h2>
      <p>Are you sure you want to delete this spot?</p>
      <div className="delete-spot-buttons">
        <button onClick={handleConfirm} className="confirm-delete">
          Yes (Delete Spot)
        </button>
        <button onClick={closeModal} className="cancel-delete">
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
