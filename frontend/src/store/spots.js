/****************************************************/

// Action Types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const SET_SINGLE_SPOT = 'spots/SET_SINGLE_SPOT';

/****************************************************/

// Action Creators
const setSingleSpot = (spot) => ({
  type: SET_SINGLE_SPOT,
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
    default:
      return state;
  }
};

export default spotsReducer;





