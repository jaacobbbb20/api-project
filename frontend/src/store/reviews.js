const SET_SPOT_REVIEWS = 'reviews/SET_SPOT_REVIEWS';

export const setSpotReviews = (reviews) => ({
  tye: SET_SPOT_REVIEWS,
  reviews
});

export const getSpotReviews = (spotId) => async dispatch => {
  const res = await fetch('/api/spots/${spotId}/reviews');
  if (res.ok) {
    const data = await res.json();
    dispatch(setSpotReviews(data.Reviews));
  }
};

const initialState = {
  spot: []
};

export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOT_REVIEWS:
      return { ...state, spot: action.reviews };
    default:
      return state;
  }
}