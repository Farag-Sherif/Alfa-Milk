import {
  ADD_REVIEW,
  SET_REVIEWS,
  SET_AVERAGE_RATING,
} from "../actions/reviewActions";

const initialState = {
  reviews: [],
  averageRating: 0,
};

const reviewReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_REVIEWS:
      return {
        ...state,
        reviews: Array.isArray(action.payload) ? action.payload : [],
      };

    case ADD_REVIEW: {
      if (!action.payload || typeof action.payload !== "object") return state;

      const newReviews = [action.payload, ...state.reviews];
      const averageRating =
        newReviews.length > 0
          ? newReviews.reduce((sum, r) => sum + (Number(r.rate) || 0), 0) /
            newReviews.length
          : 0;

      return {
        ...state,
        reviews: newReviews,
        averageRating,
      };
    }

    case SET_AVERAGE_RATING:
      return {
        ...state,
        averageRating: Number(action.payload) || 0,
      };

    default:
      return state;
  }
};

export default reviewReducer;
