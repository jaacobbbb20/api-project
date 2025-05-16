import { useState } from "react";
import "./SpotForm.css";

export default function SpotForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState([""]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const previewImage = images[0];
    const otherImages = images.slice(1).filter((url) => url.trim() !== "");

    const newSpot = {
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
      <h1>Create a New Spot</h1>

      <div className="spot-location">
        <h1>Where is your place located?</h1>
        <h2>
          Guests will only get your exact address once they book a reservation.
        </h2>
        <label>
          Country
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        <label>
          Street Address
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <label>
          City
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <div className="spot-coordinates">
          <h1>Location Coordinates</h1>
          <label>
            Latitude (-90 to 90)
            <input
              type="number"
              step="0.000001"
              min="-90"
              max="90"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
          </label>
          <label>
            Longitude (-180 to 180)
            <input
              type="number"
              step="0.000001"
              min="-180"
              max="180"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
            />
          </label>
        </div>
      </div>

      <hr />

      <div className="spot-description">
        <h1>Describe your place to guests</h1>
        <h2>
          Mention the best features about your space, any amenities like fast
          wifi or plenty of parking, and what you love about the area.
        </h2>
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
          />
        </label>
      </div>

      <hr />

      <h1>Create a title for your spot</h1>
      <h2>
        Catch gues&apos;ts attention with a spot title that highlights what
        makes your place special.
      </h2>
      <label>
        Name of Your Spot
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <hr />

      <h1>Set a base price for your spot</h1>
      <h2>
        Competitive pricing can help your listing stand out and rank higher in
        search results.
      </h2>
      <label>
        Price per night (USD)
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="1"
          required
        />
      </label>

      <hr />

      {images.map((url, idx) => (
        <div key={idx} className="image-input">
          <label>
            {idx === 0
              ? "Preview Image URL (required)"
              : `Image URL #${idx + 1} (optional)`}
            <input
              type="text"
              value={url}
              onChange={(e) => handleImageChange(idx, e.target.value)}
              required={idx === 0}
            />
          </label>
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

      <button type="submit">Create Spot</button>
    </form>
  );
}
