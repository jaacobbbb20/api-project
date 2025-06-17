import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpotDetails } from "../../store/spots";
import CreateSpotForm from "../CreateSpotForm/CreateSpotForm";

function EditSpotForm() {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  const spot = useSelector((state) => state.spots[spotId]);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <p>Loading...</p>;

  return (
    <CreateSpotForm
      isEdit={true}
      initialData={spot}
      formTitle="Update your Spot"
    />
  );
}

export default EditSpotForm;
