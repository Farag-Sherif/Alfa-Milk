import {
  ADD_TO_CART,
  DELETE_ALL_FROM_CART,
  DELETE_FROM_CART,
  ERROR_CART,
  GET_CART,
  UPDATE_QUANTITY,
} from "../actions/cartActions";

const initState = {
  items: [],
};

const cartReducer = (state = initState, action) => {
  if (!state) return initState;

  switch (action.type) {
    case GET_CART:
      return {
        ...state,
        items: Array.isArray(action.payload?.items) ? action.payload.items : [],
      };

    case ADD_TO_CART: {
      const { item, quantityCount } = action.payload || {};
      if (!item) return state;

      const items = Array.isArray(state.items) ? state.items : [];
      // استخدام المعرف الفريد للوزن لو موجود، أو رقم المنتج العادي
      const incomingCartItemId = item.cartItemId || item.id;
      
      const existingIndex = items.findIndex(
        (it) => (it.cartItemId || it.id) === incomingCartItemId
      );

      if (existingIndex !== -1) {
        const newItems = [...items];
        newItems[existingIndex] = {
          ...items[existingIndex],
          qty: (items[existingIndex].qty || 0) + (quantityCount || 1), // عشان يزود الكمية بشكل صح
        };
        return { ...state, items: newItems };
      }

      return {
        ...state,
        items: [...items, { ...item, qty: quantityCount || 1 }],
      };
    }

    case UPDATE_QUANTITY: {
      if (!state.items) return state;
      const targetCartItemId = action.payload?.item?.cartItemId || action.payload?.item?.id;
      return {
        ...state,
        items: state.items.map((it) =>
          (it.cartItemId || it.id) === targetCartItemId
            ? { ...it, qty: action.payload.quantityCount }
            : it
        ),
      };
    }

    case DELETE_FROM_CART: {
      const targetCartItemId = action.payload?.item?.cartItemId || action.payload?.item?.id;
      return {
        ...state,
        items: state.items?.filter((it) => (it.cartItemId || it.id) !== targetCartItemId) || [],
      };
    }

    case DELETE_ALL_FROM_CART:
      return { ...state, items: [] };

    case ERROR_CART:
      console.error("Cart Error:", action.payload);
      return state;

    default:
      return state;
  }
};

export default cartReducer;