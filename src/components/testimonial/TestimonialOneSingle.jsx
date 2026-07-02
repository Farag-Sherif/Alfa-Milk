import PropTypes from "prop-types";
import React from "react";
import defaultImg from "../../assets/img/user.png";
import { multilanguage } from "redux-multilanguage";

const TestimonialOneSingle = ({ data, sliderClass, currentLanguageCode }) => {
  const isArabic = currentLanguageCode === "ar";

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        style={{ color: i < rating ? "#f5a623" : "#ddd", fontSize: "20px" }}>
        ★
      </span>
    ));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const userData = data.user || data.users;

  const userImage =
    userData?.image && userData.image !== "user.png"
      ? `https://admin.omdacoffee.com/images/${userData.image}`
      : defaultImg;

  const productImage = data.item?.image_path || null;

  const itemTranslation =
    data.item?.translations?.find((t) => t.locale === currentLanguageCode) ??
    data.item?.translations?.[0];

  const productName = itemTranslation?.name || data.item?.name || null;

  return (
    <div
      className={`${sliderClass || ""}`}
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.09)",
        fontFamily: isArabic ? "'Cairo', sans-serif" : "'Poppins', sans-serif",
      }}>
      {/* صورة المنتج في الأعلى */}
      <div
        style={{
          width: "100%",
          height: "200px",
          overflow: "hidden",
          backgroundColor: "#f5f5f5",
        }}>
        {productImage ? (
          <img
            src={productImage}
            alt={productName || "product"}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #c8a96e22, #c8a96e44)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}>
            ☕
          </div>
        )}
      </div>

      {/* محتوى البطاقة */}
      <div style={{ padding: "16px" }}>
        {/* اسم المستخدم + Verified */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
          }}>
          <img
            src={userImage}
            alt="user"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #c8a96e",
            }}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                flexWrap: "wrap",
              }}>
              <strong style={{ fontSize: "15px", color: "#111" }}>
                {userData?.fname} {userData?.lname?.charAt(0)}.
              </strong>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "3px",
                  backgroundColor: "#e3f2fd",
                  color: "#1565c0",
                  fontSize: "11px",
                  fontWeight: "600",
                  padding: "2px 8px",
                  borderRadius: "20px",
                }}>
                ✔ {isArabic ? "موثق" : "Verified"}
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#999", margin: "2px 0 0" }}>
              {formatDate(data.created_at)}
            </p>
          </div>
        </div>

        {/* النجوم */}
        <div style={{ margin: "10px 0 6px" }}>
          {renderStars(data.rate || 5)}
        </div>

        {/* نص الريفيو */}
        <p
          style={{
            fontSize: "14px",
            color: "#333",
            lineHeight: "1.7",
            margin: "0 0 12px",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}>
          {data.review}
        </p>

        {/* اسم المنتج في الأسفل */}
        {productName && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderTop: "1px solid #f0f0f0",
              paddingTop: "10px",
            }}>
            {productImage && (
              <img
                src={productImage}
                alt={productName}
                style={{
                  width: "36px",
                  height: "36px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #eee",
                }}
              />
            )}
            <span style={{ fontSize: "12px", color: "#777" }}>
              {productName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

TestimonialOneSingle.propTypes = {
  data: PropTypes.object,
  sliderClass: PropTypes.string,
  currentLanguageCode: PropTypes.string,
};

export default multilanguage(TestimonialOneSingle);
