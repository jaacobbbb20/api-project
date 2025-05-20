import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpotThunk } from "../../../store/spots";
import SpotForm from "../SpotForm/SpotForm";

export default function CreateSpotPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateSpot = async (spotData) => {
    const createdSpot = await dispatch(createSpotThunk(spotData));
    if (createdSpot) navigate(`/spots/${createdSpot.id}`);
  };

  return <SpotForm onSubmit={handleCreateSpot} />;

}