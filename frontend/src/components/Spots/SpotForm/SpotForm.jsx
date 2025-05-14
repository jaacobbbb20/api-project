import { useState } from "react";

export default function SpotForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSpot = {
      name,
      address,
      city,
      state,
      country,
      description,
      price: parseFloat(price),
      previewImage
    };

    onSubmit(newSpot)
  };

  return (
    <form onSubmit={handleSubmit} className="spoot-form">
      <h1>Create a New Spot</h1>

      <div className="spot-location">
        <h1>Where is your place located?</h1>
        <h2>Guests will only get your exact address once they book a reservation.</h2>
        <label>Country
          <input value={name} onChange={(e) => setCountry(e.target.value)} required />
        </label>
        <label>Street Address
          <input value={name} onChange={(e) => setAddress(e.target.value)} required />
        </label>
        <label>City
          <input value={name} onChange={(e) => setCity(e.target.value)} required />
        </label>
        <label>State
          <input value={name} onChange={(e) => setState(e.target.value)} required />
        </label>
      </div>
      <hr />
      <div className="spot-description">
        <h1>Describe your place to guests</h1>
        <h2>Mention the best features about your space, any amentities like fast wifi or plenty of parking, and what you love about the area.</h2>
        <label>Description
          <input value={name} onChange={(e) => setDescription(e.target.value)} required />
        </label>
      </div>
      <hr />
      <h1>Create a title for your spot</h1>
      <h2>Catch guest's attention with a spot title that highlights what makes your place special.</h2>
      <label>Name of Your Spot
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <hr />
      <h1>Set a base price for your spot</h1>
      <h2>Competitive pricing can help your listing stand out and rank higher in search results.</h2>
      <label>Price per night (USD)
        <input 
          type="number"
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          min="1"
          required 
          />
      </label>
      <hr />
      <h1>Liven up your spot with photos</h1>
      <h2>A minimum on one photo is required to publish your spot</h2>
      <label>Preview Image URL
        <input value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} required />
      </label>

      <button type="submit">Create Spot</button>
    </form>
  )

}