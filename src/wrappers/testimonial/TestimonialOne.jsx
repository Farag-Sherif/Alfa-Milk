import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Swiper from "react-id-swiper";
import TestimonialOneSingle from "../../components/testimonial/TestimonialOneSingle.js";
import axios from "axios";
import axiosInstance from "../../api/api.js";

const TestimonialOne = ({
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  bgColorClass,
  testimonialClass,
}) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReviewsWithProducts = async () => {
      try {
        const response = await axiosInstance.get("/reviews");
        setReviews(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewsWithProducts();
  }, []);

  if (isLoading) {
    return <div className="loading-spinner" />;
  }

  const settings = {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      0: { slidesPerView: 1 },
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 3 },
    },
  };

  return (
    <>
      {reviews.length > 0 ? (
        <div
          className={`testimonial-area ${spaceTopClass || ""} ${spaceBottomClass || ""} ${spaceLeftClass || ""} ${spaceRightClass || ""} ${bgColorClass || ""}`}
          style={{ backgroundColor: "#fdf6ee", padding: "60px 0" }}>
          <div className="container">
            {/* العنوان */}
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <h2
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontWeight: "700",
                  fontSize: "26px",
                  color: "#3b2a1a",
                }}>
                آراء عملائنا
              </h2>
              <span
                style={{
                  display: "block",
                  width: "60px",
                  height: "3px",
                  backgroundColor: "#c8a96e",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              />
            </div>

            {/* السلايدر */}
            <Swiper {...settings}>
              {reviews.map((single, key) => (
                <TestimonialOneSingle
                  data={single}
                  key={key}
                  sliderClass="swiper-slide"
                  testimonialClass={testimonialClass}
                />
              ))}
            </Swiper>
          </div>
        </div>
      ) : null}
    </>
  );
};

TestimonialOne.propTypes = {
  bgColorClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  testimonialClass: PropTypes.string,
};

export default TestimonialOne;
