import PropTypes from "prop-types";
import React from "react";
// !DEL
const FeatureIconFourSingle = ({ data, spaceBottomClass, colClass }) => {
  return (
    <div className={colClass || "col-lg-4 col-md-6 col-sm-6 px-0 "}>
      <div
        className={spaceBottomClass ? spaceBottomClass : ""}
      >
        <img
          className="animated"
          src={process.env.PUBLIC_URL + data.image_path}
          alt=""
          style={{
            width: "100%",
            display: "block",
            marginTop: "50px",
            marginBottom: "50px"
          }}
        />
      </div>
    </div>
  );
};

FeatureIconFourSingle.propTypes = {
  data: PropTypes.object,
  spaceBottomClass: PropTypes.string,
};

export default FeatureIconFourSingle;
