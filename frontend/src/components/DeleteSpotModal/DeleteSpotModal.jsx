import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { deleteSpot, fetchUserSpots } from "../../store/spots";
import "./DeleteSpotModal.css";

function DeleteSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = async () => {
    try {
      await dispatch(deleteSpot(spotId));
      await dispatch(fetchUserSpots());
      closeModal();
    } catch (err) {
      console.error("Failed to delete spot:", err);
    }
  };

  return (
    <div className="delete-spot-modal">
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to remove this spot?</p>
      <div className="delete-spot-modal__actions">
        <button className="confirm-delete" onClick={handleDelete}>
          Yes (Delete Spot)
        </button>
        <button className="cancel-delete" onClick={closeModal}>
          No (Keep Spot)
        </button>
      </div>
    </div>
  );
}

export default DeleteSpotModal;
