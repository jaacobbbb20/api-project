import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getSpotById, updateSpotThunk } from "../../../store/spots";
import SpotForm from "../SpotForm/SpotForm";

function UpdateSpotPage() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spot = useSelector(state => state.spots.singleSpot);

  useEffect(() => {
    dispatch(getSpotById(spotId));
  }, [dispatch, spotId]);

  const handleUpdate = async (updatedData) => {

    try {
      const updatedSpot = { ...updatedData, id: spotId };
      await dispatch(updateSpotThunk(updatedSpot));

      await dispatch(getSpotById(spotId));

      navigate(`/spots/${spotId}`);
    } catch (err) {
      console.error("Error updating spot:", err);
    }
  };

  if (!spot || +spot.id !== +spotId) return <p>Loading spot info...</p>;

  const imageUrls = spot.SpotImages?.map(img => img.url) || [];

  const initialData = {
    ...spot,
    images: imageUrls
  };

  return (
    <SpotForm
      formType="Update"
      initialData={initialData}
      onSubmit={handleUpdate}
    />
  );
}

export default UpdateSpotPage;
