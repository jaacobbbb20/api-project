import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllSpots } from "../../store/spots";
import { FaStar } from "react-icons/fa";
import "./LandingPage.css";

function LandingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllSpots());
  }, [dispatch]);

  const spots = useSelector((state) => Object.values(state.spots || {}));

  return (
    <div className="landing-page">
      <div className="landing-page__grid">
        {!spots.length && <p>Loading spots...</p>}
        {spots.map((spot) => (
          <div
            className="spot-card"
            key={spot.id}
            onClick={() => navigate(`/spots/${spot.id}`)}
            title={spot.name}
          >
            <img
              src={spot.previewImage}
              alt={spot.name}
              className="spot-card__image"
            />
            <div className="spot-card__info">
              <div className="spot-card__subheader">
                <p className="spot-card__location">
                  {spot.city}, {spot.state}
                </p>
                <div className="spot-card__rating">
                  <FaStar className="spot-card__star-icon" />
                  <span>
                    {spot.avgRating ? Number(spot.avgRating).toFixed(1) : "New"}
                  </span>
                </div>
              </div>
              <p className="spot-card__price">${spot.price} / night</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
