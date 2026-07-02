import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const CategoryNoSliderSingle = ({
  data,
  isLast,
  strings,
  currentLanguageCode,
}) => {
  const isArabic = currentLanguageCode === "ar";

  return (
    <div
      className={`col-6 col-md-3 mb-5 d-flex flex-column align-items-center`}
      dir={isArabic ? "rtl" : "ltr"}>
      <Link
        to={`/shop?category=${data.slug}`}
        style={{ textDecoration: "none", textAlign: "center" }}>
        {/* الدائرة مع الصورة تطلع للأعلى */}
        <div
          style={{
            width: "160px",
            height: "160px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            overflow: "visible",
            margin: "30px auto 0",
            position: "relative",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}>
          <img
            src={`https://admin.omdacoffee.com/en/images/${data.logo}`}
            alt={data.name}
            style={{
              width: "180px",
              height: "180px",
              objectFit: "contain",
              position: "absolute",
              bottom: "20px" /* الصورة تطلع للأعلى */,
              left: "50%",
              transform: "translateX(-50%)",
              filter: "drop-shadow(0px 8px 10px rgba(0,0,0,0.2))",
            }}
          />
        </div>

        {/* اسم القسم */}
        <p
          style={{
            marginTop: "15px",
            fontFamily: isArabic
              ? "'Cairo', sans-serif"
              : "'Poppins', sans-serif",
            fontWeight: "700",
            fontSize: "15px",
            color: "#222",
            textAlign: "center",
          }}>
          {currentLanguageCode === "ar" ? data.translations[0].name : data.translations[1].name}
        </p>
      </Link>
    </div>
  );
};

CategoryNoSliderSingle.propTypes = {
  data: PropTypes.object,
  isLast: PropTypes.bool,
  strings: PropTypes.object,
  currentLanguageCode: PropTypes.string,
};

export default multilanguage(CategoryNoSliderSingle);
