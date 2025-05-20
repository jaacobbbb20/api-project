import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { getUserSpots, deleteSpotThunk } from "../../../store/spots";
import SpotCard from "../SpotCard/SpotCard";
import DeleteSpotModal from "../../DeleteSpotModal/DeleteSpotModal";
import { useModal } from "../../../context/Modal";
import "../../Spots/ManageSpots/ManageSpots.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent } = useModal();
  const spots = useSelector((state) =>
    Object.values(state.spots.userSpots || {})
  );

  useEffect(() => {
    dispatch(getUserSpots());
  }, [dispatch]);

  const handleDelete = (spotId) => {
    setModalContent(
      <DeleteSpotModal onDelete={() => dispatch(deleteSpotThunk(spotId))} />
    );
  };

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  return (
    <div className="manage-spots-container">
      <div className="manage-header">
        <h1>Manage Your Spots</h1>
        <NavLink to="/spots/new">
          <button className="create-spot-btn">Create a New Spot</button>
        </NavLink>
      </div>

      <div className="spots-list">
        {spots.length === 0 && <p>You have no spots yet.</p>}
        {spots.map((spot) => (
          <div key={spot.id} className="manage-spot-card">
            <SpotCard spot={spot} />
            <div className="manage-buttons">
              <button onClick={() => handleUpdate(spot.id)}>Update</button>
              <button onClick={() => handleDelete(spot.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpots;
