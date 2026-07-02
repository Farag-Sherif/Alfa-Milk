import axiosInstance from "../../api/api";

export const ADD_TO_CART = "ADD_TO_CART";
export const GET_CART = "GET_CART";
export const UPDATE_QUANTITY = "UPDATE_QUANTITY"; 
export const DELETE_FROM_CART = "DELETE_FROM_CART";
export const DELETE_ALL_FROM_CART = "DELETE_ALL_FROM_CART";
export const ERROR_CART = "ERROR_CART"; 

// الحصول على كافة منتجات السلة
export const getCartItems = () => (dispatch) => {
  axiosInstance
    .get("/cart")
    .then((response) => {
      dispatch({ type: GET_CART, payload: response.data });
    })
    .catch((error) => {
      dispatch({ type: ERROR_CART, payload: error });
    });
};

// إضافة منتج للسلة
export const addToCart =
  (item, related, addToast, quantityCount = 1) =>
  (dispatch) => {
    if (addToast) {
      addToast("تمت الإضافة للسلة | Added to Cart", {
        appearance: "success",
        autoDismiss: true,
      });
    }
    dispatch({
      type: ADD_TO_CART,
      payload: { item, quantityCount },
    });

    // ✅ ضيف الـ dispatch ده علشان يفتح الـ Sidebar
    dispatch({
      type: "SHOW_CART_ADDED_SIDEBAR",
      payload: { product: item, quantity: quantityCount, relatedProducts: related || [] },
    });

    if (!related || related.length === 0) {
      const slugOrId = item.slug || item.id;
      if (slugOrId) {
        axiosInstance.get(`/item/${slugOrId}`)
          .then((res) => {
            if (res.data?.related && res.data.related.length > 0) {
              dispatch({
                type: "UPDATE_CART_SIDEBAR_RELATED",
                payload: res.data.related,
              });
            }
          })
          .catch((err) => console.log("Related products lazy fetch failed", err));
      }
    }

    if (localStorage.getItem("authToken")) {
      axiosInstance
        .post("/add-to-cart", {
          item_id: item.id,
          qty: quantityCount,
          size:
            item.size ||
            item.weight ||
            item.selectedProductSize ||
            (item.selectedVariation && item.selectedVariation.weight),
        })
        .then(() => {})
        .catch((error) => {
          dispatch({ type: ERROR_CART, payload: error });
        });
    }
  };

// تحديث كمية منتج في السلة
export const updateQuantity = (item, addToast, quantityCount) => (dispatch) => {
  if (addToast) {
    addToast("تم تحديث المنتج | Product Updated", { appearance: "success", autoDismiss: true });
  }
  dispatch({
    type: UPDATE_QUANTITY,
    payload: { item, quantityCount },
  });
  if (localStorage.getItem("authToken")) {
    axiosInstance
      .post("/update-qty-cart", {
        item_id: item.item_id || item.id,
        qty: quantityCount,
        // *** إرسال الوزن عشان الباك إند يحدث الكمية للوزن الصح مش لأول وزن ***
        size: item.size || item.weight || item.selectedProductSize || (item.selectedVariation && item.selectedVariation.weight)
      })
      .then(() => {})
      .catch((error) => {
        dispatch({ type: ERROR_CART, payload: error });
      });
  }
};

// حذف منتج واحد من السلة
export const deleteFromCart = (item, addToast) => (dispatch) => {
  if (addToast) {
    addToast("تم الحذف من السلة | Removed from Cart", { appearance: "error", autoDismiss: true });
  }
  dispatch({ type: DELETE_FROM_CART, payload: { item } });
  if (localStorage.getItem("authToken")) {
    axiosInstance
      .post("/remove-from-cart", { 
          item_id: item.id,
          // *** إرسال الوزن عشان الباك إند يمسح الوزن ده بالذات مش أي وزن تاني للمنتج ***
          size: item.size || item.weight || item.selectedProductSize || (item.selectedVariation && item.selectedVariation.weight)
      })
      .then(() => {})
      .catch((error) => {
        dispatch({ type: ERROR_CART, payload: error });
      });
  }
};

// مسح السلة بالكامل
export const deleteAllFromCart = (addToast) => (dispatch) => {
  if (addToast) {
    addToast("تم إفراغ السلة بالكامل | Removed All From Cart", {
      appearance: "error",
      autoDismiss: true,
    });
  }
  dispatch({ type: DELETE_ALL_FROM_CART });
  if (localStorage.getItem("authToken")) {
    axiosInstance
      .post("/remove-all-cart")
      .then(() => {})
      .catch((error) => {
        dispatch({ type: ERROR_CART, payload: error });
      });
  }
};