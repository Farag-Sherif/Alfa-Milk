import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api.js";
import Container from "react-bootstrap/Container";
import { Row } from "react-bootstrap";
import CategoryNoSliderSingle from "../../components/category/CategoryNoSliderSingle.js";
import { multilanguage } from "redux-multilanguage";

const CategoryNoSlider = ({
  spaceBottomClass,
  strings,
  currentLanguageCode,
}) => {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState([]);
  const isArabic = currentLanguageCode === "ar";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/cafes");
        setCategoryData(response.data || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div
      className={`collections-area ${spaceBottomClass ? spaceBottomClass : ""}`}>
      <Container>
        {/* ===== عنوان القسم ===== */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            marginTop: "10px",
          }}>
          <h2
            style={{
              fontFamily: isArabic
                ? "'Cairo', sans-serif"
                : "'Poppins', sans-serif",
              fontWeight: "700",
              fontSize: "26px",
              color: "#3b2a1a",
              display: "inline-block",
            }}>
            {strings && strings["browse_categories"]
              ? strings["browse_categories"]
              : isArabic
                ? "تصفح الأقسام"
                : "Browse Categories"}
          </h2>
          <span
            style={{
              display: "block",
              width: "60px",
              height: "3px",
              backgroundColor: "#c8a96e",
              margin: "6px auto 0",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* ===== الأيقونات ===== */}
        <Row className="justify-content-center">
          {categoryData &&
            categoryData.map((single, key) => {
              const isLast = key === categoryData.length - 1;
              return (
                <CategoryNoSliderSingle
                  data={single}
                  key={key}
                  isLast={isLast}
                />
              );
            })}
        </Row>
      </Container>
    </div>
  );
};

CategoryNoSlider.propTypes = {
  spaceBottomClass: PropTypes.string,
  strings: PropTypes.object,
  currentLanguageCode: PropTypes.string,
};

export default multilanguage(CategoryNoSlider);
