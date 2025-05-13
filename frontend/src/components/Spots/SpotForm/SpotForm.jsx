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
      <h2>Create a New Spot</h2>

      <label>Name
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>Address
        <input value={name} onChange={(e) => setAddress(e.target.value)} required />
      </label>
      <label>City
        <input value={name} onChange={(e) => setCity(e.target.value)} required />
      </label>
      <label>State
        <input value={name} onChange={(e) => setState(e.target.value)} required />
      </label>
      <label>Country
        <input value={name} onChange={(e) => setCountry(e.target.value)} required />
      </label>
      <label>Description
        <input value={name} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <label>Price (per night)
        <input 
          type="number"
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          min="1"
          required 
          />
      </label>
      <label>Preview Image URL
        <input value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} required />
      </label>

      <button type="submit">Create Spot</button>
    </form>
  )

}