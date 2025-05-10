const LOAD_SPOTS = 'spots/LOAD_SPOTS';

const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots
});

export const fetchSpots = () => async (dispatch) => {
  const res = await fetch('/api/spots');
  if (res.ok) {
    const data = await res.json();
    dispatch(loadSpots(data.Spots));
  }
};

const spotsReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
      const newState = {};
      action.spots.forEach(spot => newState[spot.id] = spot);
      return newState;
    default:
      return state;
  }
};

export default spotsReducer;