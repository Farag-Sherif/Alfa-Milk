import {
  ADD_TO_WISHLIST,
  DELETE_FROM_WISHLIST,
  WISHLIST_FAILURE,
  WISHLIST_FETCH,
} from "../actions/wishlistActions";

const initState = [];

const wishlistReducer = (state = initState, action) => {
  switch (action.type) {
    case WISHLIST_FETCH:
      return action.payload;
    case ADD_TO_WISHLIST:
      if (!state.find((item) => item.id === action.payload.item.id)) {
        return [...state, { ...action.payload.item }];
      }
      return state;
    case DELETE_FROM_WISHLIST:
      // Filter out the item that needs to be deleted
      return state.filter((item) => item.id !== action.payload.item.id);

    case WISHLIST_FAILURE:
      // Optionally handle failures, possibly logging or setting an error state
      console.error("Wishlist operation failed:", action.payload);
      return state;

    default:
      return state;
  }
};

export default wishlistReducer;
