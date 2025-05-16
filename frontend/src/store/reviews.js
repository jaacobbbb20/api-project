const SET_SPOT_REVIEWS = 'reviews/SET_SPOT_REVIEWS';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    let [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

export const createReview = (spotId, reviewData) => async dispatch => {
  const csrfToken = getCookie('XSRF-TOKEN');

  const res = await fetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    body: JSON.stringify(reviewData),
    credentials: "include" // important if backend sets cookies with HttpOnly flag
  });

  if (res.ok) {
    const newReview = await res.json();
    dispatch(getSpotReviews(spotId));
    return newReview;
  } else {
    const err = await res.json();
    return { errors: err.errors || ['Failed to create review'] };
  }
};


export const setSpotReviews = (reviews) => ({
  type: SET_SPOT_REVIEWS,
  reviews
});

export const getSpotReviews = (spotId) => async dispatch => {
  const res = await fetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const data = await res.json();
    dispatch(setSpotReviews(data.Reviews));
  }
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const csrfToken = getCookie('XSRF-TOKEN');

  const res = await fetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken
    },
    credentials: "include"
  });

  if (res.ok) {
    dispatch({
      type: 'reviews/DELETE_REVIEW',
      reviewId
    });
    return true;
  } else {
    const errorData = await res.json();
    return errorData;
  }
};


const initialState = {
  spot: []
};

export default function reviewsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SPOT_REVIEWS:
      return { ...state, spot: action.reviews };
    case CREATE_REVIEW:
      return {
        ...state,
        spot: [...state.spot, action.review]
      };
    case 'reviews/DELETE_REVIEW':
      return {
        ...state,
        spot: state.spot.filter(review => review.id !== action.reviewId)
      };
    default:
      return state;
  }
}
