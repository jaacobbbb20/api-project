import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadSpots } from "../../../store/spots";
import SpotCard from "../SpotCard/SpotCard"; 
import './AllSpots.css';

function AllSpots() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.allSpots);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(loadSpots()).then(() => setIsLoading(false));
  }, [dispatch]);

  if (!Array.isArray(spots)) {
    return <p>Error: Spots data is invalid</p>
  }

  if (isLoading) return <p>Loading spots...</p>;
  if (spots.length === 0) return <p>No spots are available</p>;

  return (
    <div className="spot-grid-wrapper">
      <div className="spot-grid">
        {spots.map(spot => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </div>
  );
}
 
export default AllSpots;