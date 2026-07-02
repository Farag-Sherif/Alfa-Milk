import React from "react";
import { Link } from "react-router-dom";
// !DEL
const HeroSliderFiveSingle = ({ data, sliderClass }) => {
  console.log("🚀 ~ HeroSliderFiveSingle ~ data:", data);
  return (
    <div
      className={`single-slider-2 slider-height-1 slider-height-res15 d-flex align-items-center slider-height-res bg-img ${
        sliderClass ? sliderClass : ""
      }`}
      style={{
        backgroundImage: `url(https://admin.omdacoffee.com/images/${data.image})`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-7 ml-auto">
            <div className="slider-content-2 slider-content-fruits slider-animated-1">
              <div className="slider-btn btn-hover">
                <Link
                  className="animated"
                  to={process.env.PUBLIC_URL + "/shop"}
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSliderFiveSingle;
