import PropTypes from "prop-types";
import React from "react";
// !DEL
const SectionTitleThree = ({
  titleText,
  positionClass,
  spaceClass,
  colorClass,
}) => {
  return (
    <div
      className={`section-title-5 ${positionClass ? positionClass : ""} ${
        spaceClass ? spaceClass : ""
      }`}
    >
      <h2 className={`${colorClass ? colorClass : ""}`} style={{fontFamily: "'Cairo', sans-serif" }}>{titleText}</h2>
    </div>
  );
};

SectionTitleThree.propTypes = {
  positionClass: PropTypes.string,
  spaceClass: PropTypes.string,
  titleText: PropTypes.string,
};

export default SectionTitleThree;
