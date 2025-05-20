import { useState } from "react";
import "./SpotForm.css";

export default function SpotForm({
  formType = "Create",
  initialData = {},
  onSubmit,
}) {
  const [name, setName] = useState(initialData.name || "");
  const [address, setAddress] = useState(initialData.address || "");
  const [city, setCity] = useState(initialData.city || "");
  const [state, setState] = useState(initialData.state || "");
  const [country, setCountry] = useState(initialData.country || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price || "");
  const [images, setImages] = useState(initialData.images || [""]);
  const [lat, setLat] = useState(initialData.lat || "");
  const [lng, setLng] = useState(initialData.lng || "");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!country.trim()) newErrors.country = "Country is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!name.trim()) newErrors.name = "Name is required";
    if (!price || isNaN(price) || price <= 0)
      newErrors.price = "Price is required";
    if (!images[0]?.trim())
      newErrors.previewImage = "Preview image is required";
    if (!lat) newErrors.lat = "Latitude is required";
    if (!lng) newErrors.lng = "Longitude is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const previewImage = images[0];
    const otherImages = images.slice(1).filter((url) => url.trim() !== "");

    const newSpot = {
      id: initialData.id,
      name,
      address,
      city,
      state,
      country,
      description,
      price: parseFloat(price),
      previewImage,
      images: otherImages,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
    };

    setErrors({});
    onSubmit(newSpot);
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...images];
    updatedImages[index] = value;
    setImages(updatedImages);
  };

  const addImageInput = () => setImages([...images, ""]);

  const removeImageInput = (index) => {
    if (images.length === 1) return;
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="spot-form">
      <h1>
        {formType === "Update" ? "Update Your Spot" : "Create a New Spot"}
      </h1>

      <div className="spot-location">
        <h1>Where is your place located?</h1>
        <h2>
          Guests will only get your exact address once they book a reservation.
        </h2>

        <div className="form-row">
          <label htmlFor="country">Country</label>
          <div className="input-error-group">
            <input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            {errors.country && (
              <span className="form-error-inline">{errors.country}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="address">Street Address</label>
          <div className="input-error-group">
            <input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {errors.address && (
              <span className="form-error-inline">{errors.address}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="city">City</label>
          <div className="input-error-group">
            <input
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            {errors.city && (
              <span className="form-error-inline">{errors.city}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="state">State</label>
          <div className="input-error-group">
            <input
              id="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            {errors.state && (
              <span className="form-error-inline">{errors.state}</span>
            )}
          </div>
        </div>

        <div className="spot-coordinates">
          <h1>Location Coordinates</h1>

          <div className="form-row">
            <label htmlFor="lat">Latitude (-90 to 90)</label>
            <div className="input-error-group">
              <input
                id="lat"
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
              {errors.lat && (
                <span className="form-error-inline">{errors.lat}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="lng">Longitude (-180 to 180)</label>
            <div className="input-error-group">
              <input
                id="lng"
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
              {errors.lng && (
                <span className="form-error-inline">{errors.lng}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="spot-description">
        <h1>Describe your place to guests</h1>
        <h2>
          Mention the best features about your space, any amenities like fast
          wifi or plenty of parking, and what you love about the area.
        </h2>

        <div className="form-row">
          <label htmlFor="description">Description</label>
          <div className="input-error-group">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            />
            {errors.description && (
              <span className="form-error-inline">{errors.description}</span>
            )}
          </div>
        </div>
      </div>

      <hr />

      <h1>Create a title for your spot</h1>
      <h2>
        Catch guest&apos;s attention with a spot title that highlights what makes
        your place special.
      </h2>

      <div className="form-row">
        <label htmlFor="name">Name of Your Spot</label>
        <div className="input-error-group">
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <span className="form-error-inline">{errors.name}</span>
          )}
        </div>
      </div>

      <hr />

      <h1>Set a base price for your spot</h1>
      <h2>
        Competitive pricing can help your listing stand out and rank higher in
        search results.
      </h2>

      <div className="form-row">
        <label htmlFor="price">Price per night (USD)</label>
        <div className="input-error-group">
          <input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="1"
          />
          {errors.price && (
            <span className="form-error-inline">{errors.price}</span>
          )}
        </div>
      </div>

      <hr />

      {images.map((url, idx) => (
        <div key={idx} className="image-input">
          <label>
            {idx === 0
              ? "Preview Image URL (required)"
              : `Image URL #${idx + 1} (optional)`}
          </label>
          <div className="input-error-group">
            <input
              type="text"
              value={url}
              onChange={(e) => handleImageChange(idx, e.target.value)}
            />
            {idx === 0 && errors.previewImage && (
              <span className="form-error-inline">{errors.previewImage}</span>
            )}
          </div>
          {images.length > 1 && (
            <button
              type="button"
              className="remove-image-btn"
              onClick={() => removeImageInput(idx)}
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={addImageInput} className="add-image-btn">
        Add Another Image
      </button>

      <button type="submit">
        {formType === "Update" ? "Update Spot" : "Create Spot"}
      </button>
    </form>
  );
}
