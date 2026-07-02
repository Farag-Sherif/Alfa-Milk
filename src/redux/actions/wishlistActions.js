import axiosInstance from "../../api/api";

export const ADD_TO_WISHLIST = "ADD_TO_WISHLIST";
export const DELETE_FROM_WISHLIST = "DELETE_FROM_WISHLIST";
export const DELETE_ALL_FROM_WISHLIST = "DELETE_ALL_FROM_WISHLIST";
export const WISHLIST_FAILURE = "WISHLIST_FAILURE";
export const WISHLIST_FETCH = "WISHLIST_FETCH";

// إضافة منتج للمفضلة
export const addToWishlist = (item, addToast) => {
  return (dispatch) => {
    dispatch({
      type: ADD_TO_WISHLIST,
      payload: {
        item,
      },
    });

    if (addToast) {
      addToast("تمت الإضافة للمفضلة | Added To Wishlist", {
        appearance: "success",
        autoDismiss: true,
      });
    }
    if (localStorage.getItem("authToken")) {
      axiosInstance
        .post("/user/update-fav", { item_id: item.item_id || item.id })
        .then(() => {})
        .catch((error) => {
          dispatch({
            type: WISHLIST_FAILURE,
            payload: error,
          });
        });
    }
  };
};

// حذف منتج من المفضلة
export const deleteFromWishlist = (item, addToast) => {
  return (dispatch) => {
    dispatch({
      type: DELETE_FROM_WISHLIST,
      payload: {
        item,
      },
    });
    if (addToast) {
      addToast("تم الحذف من المفضلة | Removed From Wishlist", {
        appearance: "error",
        autoDismiss: true,
      });
    }
    if (localStorage.getItem("authToken")) {
      axiosInstance
        .post("/user/update-fav", { item_id: item.item_id || item.id })
        .then(() => {})
        .catch((error) => {
          dispatch({
            type: WISHLIST_FAILURE,
            payload: error,
          });
        });
    }
  };
};

// جلب كافة منتجات المفضلة
export const getWishlist = () => {
  return (dispatch) => {
    if (!localStorage.getItem("authToken")) {
      const localWishlistData = localStorage.getItem("localWishlist");
      let wishlist = [];
      
      try {
          if (localWishlistData) {
              wishlist = JSON.parse(localWishlistData).wishlistData || [];
          }
      } catch (e) {
          console.error("Error parsing wishlist", e);
      }

      if (wishlist.length > 0) {
        dispatch({
          type: WISHLIST_FETCH,
          payload: wishlist,
        });
      } else {
        dispatch({
          type: WISHLIST_FAILURE,
          payload: "No wishlist data found.",
        });
      }
    } else {
      axiosInstance
        .get("/user/my-favorites")
        .then((response) => {
          const items = response.data.map((favorite) => favorite.item); 
          dispatch({
            type: WISHLIST_FETCH,
            payload: items,
          });
        })
        .catch((error) => {
          dispatch({
            type: WISHLIST_FAILURE,
            payload: error,
          });
        });
    }
  };
};