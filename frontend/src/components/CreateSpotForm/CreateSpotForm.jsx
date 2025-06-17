import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserSpots, createNewSpot, updateSpot } from "../../store/spots";
import "./CreateSpotForm.css";

function CreateSpotForm({
  isEdit = false,
  initialData = {},
  formTitle = null,
}) {
  const [formData, setFormData] = useState({
    country: initialData.country || "",
    address: initialData.address || "",
    city: initialData.city || "",
    state: initialData.state || "",
    lat: initialData.lat || "",
    lng: initialData.lng || "",
    description: initialData.description || "",
    name: initialData.name || "",
    price: initialData.price || "",
    images: initialData.images?.length ? [...initialData.images] : [""],
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleImageChange = (i, value) => {
    const updated = [...formData.images];
    updated[i] = value;
    setFormData({ ...formData, images: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.address) newErrors.address = "Street address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.description || formData.description.length < 30)
      newErrors.description = "Description needs 30 or more characters";
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.price) newErrors.price = "Price per night is required";
    if (!formData.images[0])
      newErrors.previewImage = "Preview image is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({}); // Clear errors

    const spotData = {
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      price: parseFloat(formData.price),
    };

    try {
      const resultSpot = isEdit
        ? await dispatch(updateSpot(initialData.id, spotData))
        : await dispatch(createNewSpot(spotData));

      if (resultSpot?.id) {
        await dispatch(fetchUserSpots());
        navigate("/spots/current");
      }
    } catch (err) {
      console.error("Spot submission failed", err);
    }
  };

  return (
    <div className="create-spot-container">
      <h2 className="form-heading">
        {formTitle || (isEdit ? "Update your Spot" : "Create a New Spot")}
      </h2>

      <form className="create-spot-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Where&apos;s your place located?</legend>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>

          <label>
            Country
            <input
              value={formData.country}
              onChange={handleChange("country")}
            />
            {errors.country && <p className="form-error">{errors.country}</p>}
          </label>

          <label>
            Street Address
            <input
              value={formData.address}
              onChange={handleChange("address")}
            />
            {errors.address && <p className="form-error">{errors.address}</p>}
          </label>

          <div className="city-state-group">
            <label>
              City
              <input value={formData.city} onChange={handleChange("city")} />
              {errors.city && <p className="form-error">{errors.city}</p>}
            </label>
            <label>
              State
              <input value={formData.state} onChange={handleChange("state")} />
              {errors.state && <p className="form-error">{errors.state}</p>}
            </label>
          </div>

          <div className="lat-lng-group">
            <label>
              Latitude
              <input value={formData.lat} onChange={handleChange("lat")} />
            </label>
            <label>
              Longitude
              <input value={formData.lng} onChange={handleChange("lng")} />
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Describe your place to guests</legend>
          <p>
            Mention the best features, special amenities, or neighborhood perks.
          </p>
          <textarea
            placeholder="Please write at least 30 characters"
            value={formData.description}
            onChange={handleChange("description")}
          />
          {errors.description && (
            <p className="form-error">{errors.description}</p>
          )}
        </fieldset>

        <fieldset>
          <legend>Create a title for your spot</legend>
          <input
            placeholder="Name of your spot"
            value={formData.name}
            onChange={handleChange("name")}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </fieldset>

        <fieldset>
          <legend>Set a base price for your spot</legend>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Price per night (USD)"
            value={formData.price}
            onChange={handleChange("price")}
          />
          {errors.price && <p className="form-error">{errors.price}</p>}
        </fieldset>

        <fieldset>
          <legend>Liven up your spot with photos</legend>
          <p>Submit a link to at least one photo to publish your spot.</p>
          {formData.images.map((url, i) => (
            <div key={i}>
              <input
                placeholder={i === 0 ? "Preview Image URL" : "Image URL"}
                value={url}
                onChange={(e) => handleImageChange(i, e.target.value)}
              />
              {i === 0 && errors.previewImage && (
                <p className="form-error">{errors.previewImage}</p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, images: [...formData.images, ""] })
            }
          >
            Add another image
          </button>
        </fieldset>

        <button type="submit">{isEdit ? "Update Spot" : "Create Spot"}</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;
