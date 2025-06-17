import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserSpots } from "../../store/spots";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";
import "./ManageSpots.css";

function ManageSpots() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sessionUser = useSelector((state) => state.session.user);
  const allSpots = useSelector((state) => state.spots);

  const spots = useMemo(() => {
    return Object.values(allSpots).filter(
      (spot) => spot.ownerId === sessionUser?.id
    );
  }, [allSpots, sessionUser?.id]);

  useEffect(() => {
    if (sessionUser) dispatch(fetchUserSpots());
  }, [dispatch, sessionUser]);

  if (!sessionUser) return <p>Loading...</p>;

  return (
    <div className="manage-spots">
      <h1>Manage Your Spots</h1>

      <button
        className="manage-spots__create-button"
        onClick={() => navigate("/spots/new")}
      >
        Create a New Spot
      </button>

      <div className="manage-spots__grid">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="manage-spots__card"
            onClick={() => navigate(`/spots/${spot.id}`)}
            title={spot.name}
            style={{ cursor: "pointer" }}
          >
            <img
              src={spot.previewImage || "https://via.placeholder.com/300x200"}
              alt={spot.name}
              className="manage-spots__image"
            />

            <div className="manage-spots__info">
              <div className="manage-spots__header">
                <p className="manage_spots__location">
                  {spot.city}, {spot.state}
                </p>
                <p className="spot-rating">★ {spot.avgRating || "New"}</p>
              </div>

              <p className="manage-spots__price">${spot.price} / night</p>

              <div className="manage-spots__actions">
                <button
                  className="manage-spots__update-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/spots/${spot.id}/edit`);
                  }}
                >
                  Update
                </button>

                <OpenModalButton
                  buttonText="Delete"
                  className="manage-spots__delete-button"
                  modalComponent={
                    <DeleteSpotModal
                      spotId={spot.id}
                      onDelete={() => dispatch(fetchUserSpots())}
                    />
                  }
                  onButtonClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSpots;
