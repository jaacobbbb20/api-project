import { csrfFetch } from "./csrf";

// Action Types
const ADD_REVIEW = "reviews/ADD_REVIEW";
const REMOVE_REVIEW = "reviews/REMOVE_REVIEW";
const LOAD_REVIEWS = "reviews/LOAD_REVIEWS";

// Action Creators
const addReview = (review) => ({
  type: ADD_REVIEW,
  review,
});

const removeReview = (reviewId) => ({
  type: REMOVE_REVIEW,
  reviewId,
});

const loadReviews = (reviews) => ({
  type: LOAD_REVIEWS,
  reviews,
});

// Thunks
export const postReview = (spotId, data) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw res;

  const review = await res.json();
  dispatch(addReview(review));
  return review;
};

export const deleteReview = (reviewId) => async (dispatch) => {
  const res = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (res.ok) {
    dispatch(removeReview(reviewId));
  }
};

export const fetchReviewsBySpot = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
  if (res.ok) {
    const data = await res.json(); // { Reviews: [...] }
    const normalized = {};
    data.Reviews.forEach((review) => {
      normalized[review.id] = review;
    });
    dispatch(loadReviews(normalized));
  }
};

// Reducer
const reviewsReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_REVIEW: {
      return {
        ...state,
        [action.review.id]: action.review,
      };
    }
    case REMOVE_REVIEW: {
      const newState = { ...state };
      delete newState[action.reviewId];
      return newState;
    }
    case LOAD_REVIEWS: {
      return { ...action.reviews };
    }
    default:
      return state;
  }
};

export default reviewsReducer;
