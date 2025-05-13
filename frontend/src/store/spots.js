/****************************************************/

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const SET_SINGLE_SPOT = 'spots/SET_SINGLE_SPOT';
const ADD_SPOT = 'spots//ADD_SPOT';

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
  try {
    const res = await fetch(`/api/spots/${spotId}`);
    if (res.ok) {
      const data = await res.json();
      dispatch(setSingleSpot(data));
    } else {
      console.error('Failed to fetch the spot:', res.status);
    }
  } catch (err) {
    console.error('Error fetching spot:', err);
  }
}

// Spot Form
export const createSpotThunk = (spotData) => async (dispatch) => {
  try {
    const res = await fetch('/api/spots', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spotData)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw errorData;
    }

    const newSpot = await res.json();

    if (spotData.previewImage) {
      await fetch('/api/spots/${newSpot.id}/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: spotData.previewImage,
          preview: true
        })
      });
    }
    
    dispatch(setSingleSpot(newSpot));

    return newSpot;
  } catch (err) {
    console.error('Error creating spot:', err);
    throw err;
  }
}

/****************************************************/

// Reducer

const initialState = {
  allSpots:[],
  singleSpot: null
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: 
      return {
        ...state,
        allSpots: action.spots
      };
    case SET_SINGLE_SPOT:
      return {
        ...state,
        singleSpot: action.spot
      };
    case ADD_SPOT:
      return {
        ...state,
        allSpots: [...state.allSpots, action.spot]
      }
    default:
      return state;
  }
};

export default spotsReducer;





