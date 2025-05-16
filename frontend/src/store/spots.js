import { csrfFetch } from './csrf'


/****************************************************/
// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const SET_SINGLE_SPOT = 'spots/SET_SINGLE_SPOT';
const ADD_SPOT = 'spots/ADD_SPOT';
/****************************************************/
// Action Creators

const setSingleSpot = (spot) => ({
  type: SET_SINGLE_SPOT,
  spot
});

const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot
});
/****************************************************/
// Thunks

// Loads all of the spots
export const loadSpots = () => async (dispatch) => {
  try {
    const response = await fetch('/api/spots');
    const data = await response.json();

    dispatch({
      type: LOAD_SPOTS,
      spots: data.Spots
    });
  } catch (error) {
    console.error('Error loading spots:', error);
  }
};

// Loads a singular spot via ID
export const getSpotById = (spotId) => async (dispatch) => {
  const res = await fetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const data = await res.json();
    console.log("Fetched spot data:", data); // Debug log
    dispatch(setSingleSpot(data));
  } else {
    console.error('Failed to fetch the spot:', res.status);
  }
};

// Create a New Spot
export const createSpotThunk = (spotData) => async (dispatch) => {
  try {
    const { previewImage, images, ...spotInfo } = spotData;

    console.log("Spot info being sent:", spotInfo);

    const res = await csrfFetch('/api/spots', {
      method: 'POST',
      body: JSON.stringify(spotInfo)
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    const newSpot = await res.json();

    // Upload preview image
    if (previewImage) {
      await fetch(`/api/spots/${newSpot.id}/images`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: previewImage,
          preview: true
        })
      });
    }

    // Upload other images
    if (images && images.length > 0) {
      for (let url of images) {
        await fetch(`/api/spots/${newSpot.id}/images`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url,
            preview: false
          })
        });
      }
    }

    dispatch(setSingleSpot(newSpot));
    dispatch(addSpot(newSpot));

    return newSpot;
  } catch (err) {
  try {
    const errorData = await err.json();
    console.error('Error creating spot:', errorData.message);
    console.error('Validation errors:', errorData.errors);
  } catch (e) {
    console.error('Unexpected error creating spot:', err);
  }
  throw err;
}


};

/****************************************************/

// Reducer

const initialState = {
  allSpots: {},
  singleSpot: null, // <-- Changed from {} to null
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const normalizedSpots = {};
      action.spots.forEach(spot => {
        normalizedSpots[spot.id] = spot;
      });
      return {
        ...state,
        allSpots: normalizedSpots
      };
    }
    case SET_SINGLE_SPOT:
      return {
        ...state,
        singleSpot: action.spot
      };
    case ADD_SPOT:
      return {
        ...state,
        allSpots: {
          ...state.allSpots, 
          [action.spot.id]: action.spot
        }
      }
    default:
      return state;
  }
};

export default spotsReducer;
