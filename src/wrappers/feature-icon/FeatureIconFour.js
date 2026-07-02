import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api.js";
import FeatureIconFourSingle from "../../components/feature-icon/FeatureIconFourSingle.js";
// !DEL
const FeatureIconFour = ({
  spaceTopClass,
  spaceBottomClass,
  containerClass,
  gutterClass,
  responsiveClass,
  bgImg,
  data,
  colClass
}) => {
  if (!data || data.length === 0) return null;

  return (
    <div
      className={`support-area ${
        spaceTopClass ? spaceTopClass : ""
      } ${spaceBottomClass ? spaceBottomClass : ""} ${
        responsiveClass ? responsiveClass : ""
      }`}
      style={
        bgImg
          ? { backgroundImage: `url(${process.env.PUBLIC_URL + bgImg})` }
          : {}
      }
    >
      <div
        className={`${containerClass ? containerClass : ""} ${
          gutterClass ? gutterClass : ""
        }`}
      >
        <div className="row justify-content-center m-0">
          {data &&
            data.map((single, key) => {
              return (
                <FeatureIconFourSingle
                  data={single}
                  spaceBottomClass="mb-10"
                  colClass={colClass}
                  key={key}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

FeatureIconFour.propTypes = {
  bgImg: PropTypes.string,
  containerClass: PropTypes.string,
  gutterClass: PropTypes.string,
  responsiveClass: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
};

export default FeatureIconFour;
