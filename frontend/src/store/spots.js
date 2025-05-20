import { csrfFetch } from "./csrf";

/****************************************************/
// Action Types

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const SET_SINGLE_SPOT = "spots/SET_SINGLE_SPOT";
const ADD_SPOT = "spots/ADD_SPOT";
const LOAD_USER_SPOTS = "spots/LOAD_USER_SPOTS";
const DELETE_SPOT = "spots/DELETE_SPOT";
const CLEAR_SINGLE_SPOT = "spots/CLEAR_SINGLE_SPOT";

/****************************************************/
// Action Creators

const setSingleSpot = (spot) => ({ type: SET_SINGLE_SPOT, spot });
const addSpot = (spot) => ({ type: ADD_SPOT, spot });
const loadUserSpots = (spots) => ({ type: LOAD_USER_SPOTS, spots });
const deleteSpot = (spotId) => ({ type: DELETE_SPOT, spotId });
export const clearSingleSpot = () => ({ type: CLEAR_SINGLE_SPOT });

/****************************************************/
// Thunks

export const loadSpots = () => async (dispatch) => {
  try {
    const response = await fetch("/api/spots");
    const data = await response.json();
    dispatch({ type: LOAD_SPOTS, spots: data.Spots });
  } catch (error) {
    console.error("Error loading spots:", error);
  }
};

export const getSpotById = (spotId) => async (dispatch) => {
  dispatch(clearSingleSpot());

  try {
    const res = await fetch(`/api/spots/${spotId}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setSingleSpot(data));
    } else {
      console.error("Failed to fetch the spot:", res.status);
    }
  } catch (error) {
    console.error("Error fetching spot:", error);
  }
};

export const getUserSpots = () => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/current`);
    if (res.ok) {
      const data = await res.json();

      dispatch(loadUserSpots(data.Spots));
    }
  } catch (err) {
    console.error("Error fetching user spots:", err);
  }
};

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`, { method: "DELETE" });
  if (res.ok) {
    dispatch(deleteSpot(spotId));
    return true;
  } else {
    const errorData = await res.json();
    console.error("Error deleting spot:", errorData);
    return false;
  }
};

export const createSpotThunk = (spotData) => async (dispatch) => {
  try {
    const { previewImage, images, ...spotInfo } = spotData;

    const res = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spotInfo),
    });

    if (!res.ok) throw await res.json();

    const newSpot = await res.json();

    if (previewImage) {
      await csrfFetch(`/api/spots/${newSpot.id}/images`, {
        method: "POST",
        body: JSON.stringify({ url: previewImage, preview: true }),
      });
    }

    if (images?.length) {
      for (let url of images) {
        await csrfFetch(`/api/spots/${newSpot.id}/images`, {
          method: "POST",
          body: JSON.stringify({ url, preview: false }),
        });
      }
    }

    dispatch(setSingleSpot(newSpot));
    dispatch(addSpot(newSpot));
    return newSpot;
  } catch (err) {
    console.error("Error creating spot:", err);
    throw err;
  }
};

export const updateSpotThunk = (spotData) => async (dispatch) => {
  try {
    const { id, previewImage, images, ...spotInfo } = spotData;

    const res = await csrfFetch(`/api/spots/${id}`, {
      method: "PUT",
      body: JSON.stringify(spotInfo),
    });
    if (!res.ok) throw await res.json();
    const updatedSpot = await res.json();

    await csrfFetch(`/api/spots/${id}/images`, {
      method: "DELETE"
    });

    if (previewImage) {
      await csrfFetch(`/api/spots/${id}/images`, {
        method: "POST",
        body: JSON.stringify({ url: previewImage, preview: true }),
      });
    }

    if (images?.length) {
      for (let url of images) {
        await csrfFetch(`/api/spots/${id}/images`, {
          method: "POST",
          body: JSON.stringify({ url, preview: false }),
        });
      }
    }

    dispatch(setSingleSpot(updatedSpot));
    dispatch(addSpot(updatedSpot));
    return updatedSpot;

  } catch (err) {
    console.error("Error updating spot:", err);
    throw err;
  }
};

/****************************************************/
// Reducer

const initialState = {
  allSpots: {},
  userSpots: {},
  singleSpot: null,
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const normalized = {};
      action.spots.forEach(spot => normalized[spot.id] = spot);
      return { ...state, allSpots: normalized };
    }
    case LOAD_USER_SPOTS: {
      const normalized = {};
      action.spots.forEach(spot => normalized[spot.id] = spot);
      return { ...state, userSpots: normalized };
    }
    case SET_SINGLE_SPOT:
      return { ...state, singleSpot: action.spot };
    case CLEAR_SINGLE_SPOT:
      return { ...state, singleSpot: null };
    case ADD_SPOT:
      return {
        ...state,
        allSpots: { ...state.allSpots, [action.spot.id]: action.spot }
      };
    case DELETE_SPOT: {
      const allSpots = { ...state.allSpots };
      const userSpots = { ...state.userSpots };
      delete allSpots[action.spotId];
      delete userSpots[action.spotId];
      return { ...state, allSpots, userSpots };
    }
    default:
      return state;
  }
};

export default spotsReducer;
