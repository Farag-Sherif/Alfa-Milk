import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector, connect } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import {
  fetchProductReviews,
  submitReview,
} from "../../redux/actions/reviewActions";

// Star Rating Component
const StarRating = ({
  rating,
  onRate = null,
  size = 24,
  color = "#f5a623",
}) => {
  const [hovered, setHovered] = useState(0);
  const interactive = typeof onRate === "function";

  return (
    <div
      style={{ display: "inline-flex", gap: 4, direction: "ltr" }}
      onMouseLeave={() => interactive && setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = (interactive ? hovered || rating : rating) >= star;
        return (
          <svg
            key={star}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill={filled ? color : "none"}
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              cursor: interactive ? "pointer" : "default",
              transition: "transform 0.15s ease",
              transform:
                hovered === star && interactive ? "scale(1.2)" : "scale(1)",
            }}
            onMouseEnter={() => interactive && setHovered(star)}
            onClick={() => interactive && onRate(star)}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        );
      })}
    </div>
  );
};

const ProductReviews = ({
  product,
  strings,
  currentLanguageCode,
  onReviewSuccess, // ← الدالة المهمة
}) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const lang = currentLanguageCode === "ar" ? "ar" : "en";
  const dir = lang === "ar" ? "rtl" : "ltr";
  const isLoggedIn = !!localStorage.getItem("authToken");

  const reviewState = useSelector((state) => state.reviews || {});
  const reduxReviews = useMemo(() => {
    if (Array.isArray(reviewState)) return reviewState;
    if (Array.isArray(reviewState?.reviews)) return reviewState.reviews;
    if (Array.isArray(reviewState?.data)) return reviewState.data;
    return [];
  }, [reviewState]);

  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userReviewText, setUserReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (product) {
      dispatch(fetchProductReviews(product, addToast, lang));
    }
  }, [product, dispatch, addToast, lang]);

  useEffect(() => {
    setPendingReviews([]);
  }, [product?.id]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) {
        setUser(null);
        return;
      }
      setIsLoadingUser(true);
      try {
        const response = await axiosInstance.get("/user");
        setUser(response?.data?.user || null);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setUser(null);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, [isLoggedIn]);

  const normalizeReview = (review) => {
    if (!review || typeof review !== "object") return null;
    const firstName = review?.user?.fname || review?.users?.fname || "";
    const lastName = review?.user?.lname || review?.users?.lname || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return {
      id: review.id,
      rate: Number(review.rate) || 0,
      review: review.review || "",
      created_at: review.created_at || new Date().toISOString(),
      isPending: !!review.isPending,
      user_name:
        review.user_name ||
        review.username ||
        fullName ||
        review?.user?.name ||
        review?.users?.name ||
        review?.user?.username ||
        review?.users?.username ||
        strings["anonymous"] ||
        "مجهول",
    };
  };

  const userDisplayName = useMemo(() => {
    return (
      `${user?.fname || ""} ${user?.lname || ""}`.trim() ||
      user?.name ||
      user?.user_name ||
      user?.username ||
      strings["anonymous"] ||
      "مجهول"
    );
  }, [user, strings]);

  const userOrderId = useMemo(() => {
    const orders = user?.orders || [];
    if (!product?.id || orders.length === 0) return "";
    const matchedOrder = [...orders]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .find((order) =>
        order?.items?.some((item) => {
          const itemProductId =
            item?.id || item?.item_id || item?.pivot?.item_id || null;
          return Number(itemProductId) === Number(product.id);
        }),
      );
    return matchedOrder?.id || matchedOrder?.order_id || "";
  }, [user, product?.id]);

  const serverReviews = useMemo(() => {
    const fallbackReviews = Array.isArray(product?.reviews_item)
      ? product.reviews_item
      : Array.isArray(product?.reviews)
        ? product.reviews
        : [];
    const source = reduxReviews.length > 0 ? reduxReviews : fallbackReviews;
    return source.map(normalizeReview).filter(Boolean);
  }, [reduxReviews, product?.reviews_item, product?.reviews]);

  const mergedReviews = useMemo(() => {
    const allReviews = [...pendingReviews, ...serverReviews]
      .map(normalizeReview)
      .filter(Boolean);
    const uniqueReviews = allReviews.filter(
      (review, index, self) =>
        index === self.findIndex((r) => String(r.id) === String(review.id)),
    );
    return uniqueReviews.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [pendingReviews, serverReviews]);

  const displayedAverageRating = useMemo(() => {
    return mergedReviews.length > 0
      ? mergedReviews.reduce((sum, r) => sum + (Number(r.rate) || 0), 0) /
          mergedReviews.length
      : 0;
  }, [mergedReviews]);

  const totalReviews = mergedReviews.length;
  const reviewCountLabel = (n) =>
    `${n} ${n === 1 ? strings["review_singular"] || "تقييم" : strings["review_plural"] || "تقييمات"}`;

  const starDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((star) => {
      const count = mergedReviews.filter(
        (r) => Math.round(Number(r.rate) || 0) === star,
      ).length;
      return {
        star,
        count,
        percent:
          totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
      };
    });
  }, [mergedReviews, totalReviews]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!isLoggedIn) {
      return addToast(strings["login_required"] || "يرجى تسجيل الدخول", {
        appearance: "warning",
        autoDismiss: true,
      });
    }

    if (!userReviewText.trim()) {
      return addToast(strings["review_required"] || "اكتب التقييم", {
        appearance: "warning",
        autoDismiss: true,
      });
    }

    if (userRating < 1 || userRating > 5) {
      return addToast(strings["rating_invalid"] || "التقييم غير صالح", {
        appearance: "warning",
        autoDismiss: true,
      });
    }

    if (!userOrderId) {
      return addToast(
        strings["order_required"] || "لا يمكنك إضافة تقييم إلا بعد شراء المنتج",
        { appearance: "warning", autoDismiss: true },
      );
    }

    setIsSubmitting(true);
    const reviewText = userReviewText.trim();

    const optimisticReview = {
      id: `temp-${Date.now()}`,
      user_name: userDisplayName,
      rate: userRating,
      review: reviewText,
      created_at: new Date().toISOString(),
      isPending: true,
    };

    setPendingReviews((prev) => [optimisticReview, ...prev]);
    setUserReviewText("");
    setUserRating(5);

    try {
      await dispatch(
        submitReview(
          {
            item_id: product.id,
            rate: optimisticReview.rate,
            review: optimisticReview.review,
            order_id: userOrderId,
          },
          lang,
        ),
      );

      // استدعاء الدالة بعد النجاح لتحديث المنتج كاملاً
      if (onReviewSuccess) {
        onReviewSuccess();
      }

      setPendingReviews((prev) =>
        prev.filter((review) => review.id !== optimisticReview.id),
      );

      addToast(strings["review_added_success"] || "تم إضافة تقييمك بنجاح", {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      setPendingReviews((prev) =>
        prev.filter((review) => review.id !== optimisticReview.id),
      );
      setUserReviewText(reviewText);
      setUserRating(optimisticReview.rate);

      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "حدث خطأ أثناء إرسال التقييم";

      setSubmitError(errorMsg);
      addToast(errorMsg, { appearance: "error", autoDismiss: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="review-area mt-80 container"
      style={{ direction: dir, textAlign: dir === "rtl" ? "right" : "left" }}>
      <h3 className="mb-5">
        {strings["customer_reviews"] || "تقييمات العملاء"}
      </h3>

      {/* Average Rating + Distribution */}
      <div className="row mb-5">
        <div className="col-md-3 text-center mb-4 mb-md-0">
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 12,
              padding: "24px 16px",
            }}>
            <h1
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: "#212529",
                lineHeight: 1,
                marginBottom: 8,
              }}>
              {displayedAverageRating.toFixed(1)}
            </h1>
            <StarRating rating={displayedAverageRating} size={22} />
            <p className="mt-2 text-muted small mb-0">
              {strings["based_on"] || "بناءً على"}{" "}
              {reviewCountLabel(totalReviews)}
            </p>
          </div>
        </div>

        <div className="col-md-9 d-flex flex-column justify-content-center">
          {starDistribution.map(({ star, count, percent }) => (
            <div
              key={star}
              className="d-flex align-items-center mb-2"
              style={{ gap: 12 }}>
              <span
                className="text-muted small"
                style={{ width: 40, textAlign: "center", flexShrink: 0 }}>
                {star} ★
              </span>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  background: "#e9ecef",
                  borderRadius: 4,
                  overflow: "hidden",
                }}>
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    background: "#f5a623",
                    borderRadius: 4,
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
              <span
                className="text-muted small"
                style={{ width: 30, textAlign: "center", flexShrink: 0 }}>
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Form */}
      <div
        className="write-review mb-5 p-4"
        style={{ background: "#f8f9fa", borderRadius: 12 }}>
        <h4 className="mb-4">{strings["write_review"] || "اكتب تقييمك"}</h4>
        <form onSubmit={handleSubmitReview} noValidate>
          <div className="mb-4">
            <label className="form-label fw-medium d-block mb-2">
              {strings["your_rating"] || "تقييمك"}
            </label>
            <StarRating rating={userRating} onRate={setUserRating} size={32} />
          </div>

          <div className="mb-4">
            <label className="form-label fw-medium">
              {strings["your_review"] || "تقييمك"}
            </label>
            <textarea
              className={`form-control ${submitError ? "is-invalid" : ""}`}
              rows={4}
              maxLength={500}
              placeholder={strings["placeholder"] || "اكتب تقييمك هنا..."}
              value={userReviewText}
              onChange={(e) => {
                setUserReviewText(e.target.value);
                if (submitError) setSubmitError("");
              }}
              style={{ resize: "vertical" }}
            />
            <small className="text-muted">
              {userReviewText.trim().length} / 500 {strings["chars"] || "حروف"}
            </small>
            {submitError && (
              <div className="text-danger mt-2">⚠️ {submitError}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-dark px-4"
            disabled={
              isSubmitting ||
              !userReviewText.trim() ||
              !isLoggedIn ||
              isLoadingUser
            }>
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                {strings["submitting"] || "جاري الإرسال"}
              </>
            ) : (
              strings["submit"] || "إرسال"
            )}
          </button>

          {!isLoggedIn && (
            <p className="text-danger mt-3 mb-0">
              {strings["login_required"] || "يرجى تسجيل الدخول"}
            </p>
          )}
          {isLoggedIn && !isLoadingUser && !userOrderId && (
            <p className="text-warning mt-3 mb-0">
              {strings["order_required"] ||
                "لا يمكنك إضافة تقييم إلا بعد شراء المنتج"}
            </p>
          )}
        </form>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h5 className="mb-4">
          {totalReviews > 0
            ? reviewCountLabel(totalReviews)
            : strings["reviews_heading"] || "التقييمات"}
        </h5>

        {mergedReviews.length > 0 ? (
          mergedReviews.map((review, index) => (
            <div
              key={review.id || index}
              className="single-review mb-4 pb-4"
              style={{ borderBottom: "1px solid #dee2e6" }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <strong className="d-block mb-1">
                    {review.user_name || strings["anonymous"] || "مجهول"}
                  </strong>
                  <StarRating rating={Number(review.rate) || 0} size={18} />
                  {review.isPending && (
                    <div className="text-warning small mt-1">
                      {strings["sending_review"] || "جاري إرسال التقييم..."}
                    </div>
                  )}
                </div>
                <span className="text-muted small">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <p className="review-text mt-2 mb-0 text-secondary">
                {review.review}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-5 text-muted">
            <svg
              width={48}
              height={48}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#adb5bd"
              strokeWidth="1.5"
              className="mb-3">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p className="mb-1">
              {strings["no_reviews_title"] || "لا توجد تقييمات بعد"}
            </p>
            <p className="small mb-0">
              {strings["no_reviews_sub"] || "كن أول من يكتب تقييمًا"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default connect((state) => ({
  currentLanguageCode: state.multilanguage.currentLanguageCode,
}))(multilanguage(ProductReviews));
