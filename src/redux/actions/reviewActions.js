import axios from "axios";

export const ADD_REVIEW = "ADD_REVIEW";
export const SET_REVIEWS = "SET_REVIEWS";
export const SET_AVERAGE_RATING = "SET_AVERAGE_RATING";

const msg = (ar, en, lang) => (lang === "ar" ? ar : en);

// fetch reviews from product object
export const fetchProductReviews =
  (product, addToast, lang = "ar") =>
  async (dispatch) => {
    try {
      if (!product) {
        throw new Error(
          msg("بيانات المنتج غير موجودة", "Product data not found", lang),
        );
      }

      const reviews = product.reviews_item || product.reviews || [];
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + (Number(r.rate) || 0), 0) /
            reviews.length
          : 0;

      dispatch({ type: SET_REVIEWS, payload: reviews });
      dispatch({ type: SET_AVERAGE_RATING, payload: averageRating });
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      addToast(
        error?.response?.data?.message ||
          error.message ||
          msg("فشل تحميل التقييمات", "Failed to load reviews", lang),
        {
          appearance: "error",
          autoDismiss: true,
        },
      );
    }
  };

// submit review
export const submitReview =
  (reviewData, lang = "ar", fallbackReview = null) =>
  async (dispatch) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error(
        msg(
          "يرجى تسجيل الدخول لإرسال التقييم",
          "Please login to submit a review",
          lang,
        ),
      );
    }

    if (!reviewData.item_id) {
      throw new Error(
        msg("معرّف المنتج غير موجود", "Product ID is missing", lang),
      );
    }

    if (!reviewData.review?.trim()) {
      throw new Error(msg("نص التقييم فارغ", "Review text is empty", lang));
    }

    if (!reviewData.rate || reviewData.rate < 1 || reviewData.rate > 5) {
      throw new Error(msg("التقييم غير صالح", "Invalid rating", lang));
    }

    if (!reviewData.order_id) {
      throw new Error(
        msg(
          "يجب إتمام الطلب أولاً قبل كتابة تقييم",
          "You must complete an order before submitting a review",
          lang,
        ),
      );
    }

    const formData = new FormData();
    formData.append("item_id", reviewData.item_id);
    formData.append("rate", reviewData.rate);
    formData.append("review", reviewData.review.trim());
    formData.append("order_id", reviewData.order_id);

    const res = await axios.post(
      "https://admin.omdacoffee.com/api/review-item",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
console.log(res.data)
    const reviewFromApi = res?.data?.review || fallbackReview;

    if (reviewFromApi) {
      dispatch({
        type: ADD_REVIEW,
        payload: reviewFromApi,
      });
    }

    return res;
  };
