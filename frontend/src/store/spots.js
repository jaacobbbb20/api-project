
// Action Type
const LOAD_SPOTS = 'spots/LOAD_SPOTS';


// Thunk
export const loadSpots = () => async (dispatch) => {
  try {
    const response = await fetch('/api/spots');
    const data = await response.json();
    console.log("Spots fetched:", data);  // Log the spots to verify the data

    dispatch({
      type: LOAD_SPOTS,
      spots: data.Spots
    });
  } catch (error) {
    console.error('Error loading spots:', error);
  }
};

// Reducer
const spotsReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_SPOTS: 
      return action.spots;
    default:
      return state;
  }
};

export default spotsReducer;