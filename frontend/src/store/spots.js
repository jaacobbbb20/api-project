import { csrfFetch } from "./csrf";

/* ========== Action Types ========== */
const LOAD_SPOTS = "spots/loadSpots";
const LOAD_SPOT = "spots/loadSpot";
const ADD_SPOT = "spots/addSpot";
const REMOVE_SPOT = "spots/removeSpot";

/* ========== Action Creators ========== */
export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const loadSpot = (spot) => ({
  type: LOAD_SPOT,
  spot,
});

export const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});

export const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

/* ========== Thunks ========== */

// Get all spots
export const fetchAllSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadSpots(data.Spots));
  }
};

// Get a single spot by ID
export const fetchSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const spot = await res.json();
    dispatch(loadSpot(spot));
  }
};

// Create a new spot
export const createNewSpot = (spotData) => async (dispatch) => {
  const { images, ...spotInfo } = spotData;

  const res = await csrfFetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spotInfo),
  });

  if (!res.ok) throw res;
  const newSpot = await res.json();

  // Upload preview + additional images
  for (let i = 0; i < images.length; i++) {
    await csrfFetch(`/api/spots/${newSpot.id}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: images[i],
        preview: i === 0,
      }),
    });
  }

  // Get full spot details
  const fullSpotRes = await csrfFetch(`/api/spots/${newSpot.id}`);
  const fullSpot = await fullSpotRes.json();
  dispatch(loadSpot(fullSpot));
  return fullSpot;
};

// Fetch spots owned by the current user
export const fetchUserSpots = () => async (dispatch) => {
  const res = await csrfFetch("/api/spots/current");
  if (res.ok) {
    const data = await res.json();
    dispatch(loadSpots(data.Spots));
  }
};

// Update a spot
export const updateSpot = (spotId, updatedData) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  if (!res.ok) throw res;

  const updatedSpot = await res.json();

  // Update individual and all lists
  dispatch(loadSpot(updatedSpot));
  dispatch(fetchUserSpots());
  dispatch(fetchAllSpots()); // <- this is what LandingPage needs!

  return updatedSpot;
};

// Delete a spot
export const deleteSpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(removeSpot(spotId));
  }
};

/* ========== Reducer ========== */
const initialState = {};

export default function spotsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_SPOTS: {
      const newState = {};
      action.spots.forEach((spot) => {
        newState[spot.id] = spot;
      });
      return newState;
    }

    case LOAD_SPOT: {
      const existing = state[action.spot.id] || {};
      return {
        ...state,
        [action.spot.id]: {
          ...existing,
          ...action.spot,
        },
      };
    }

    case ADD_SPOT: {
      return {
        ...state,
        [String(action.spot.id)]: action.spot,
      };
    }

    case REMOVE_SPOT: {
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;
    }

    default:
      return state;
  }
}
