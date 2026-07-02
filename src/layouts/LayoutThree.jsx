import PropTypes from "prop-types";
import React, { Fragment } from "react";
import FooterOne from "../wrappers/footer/FooterOne";
import FooterTwo from "../wrappers/footer/FooterTwo";
import HeaderOne from "../wrappers/header/HeaderOne";
import FixedFooter from "./FixedFooter";
// !DEL
const LayoutThree = ({
  children,
  headerContainerClass,
  headerTop,
  headerBorderStyle,
  headerPaddingClass,
}) => {
  return (
    <Fragment>
      <HeaderOne
        layout={headerContainerClass}
        top={headerTop}
        borderStyle={headerBorderStyle}
        headerPaddingClass={headerPaddingClass}
      />
      {children}
      <FooterTwo
        backgroundColorClass="footer-white"
        footerTopBackgroundColorClass="bg-gray-2"
        footerTopSpaceTopClass="pt-80"
        footerTopSpaceBottomClass="pb-60"
        footerLogo="/assets/img/logo/logo.png"
      />
      <FooterOne
        backgroundColorClass="footer-white"
        footerTopBackgroundColorClass="bg-gray-2"
        footerTopSpaceTopClass
        footerTopSpaceBottomClass="pb-60"
        footerLogo="/assets/img/logo/logo.png"
      />
      <FixedFooter />
    </Fragment>
  );
};

LayoutThree.propTypes = {
  children: PropTypes.any,
  headerBorderStyle: PropTypes.string,
  headerContainerClass: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerTop: PropTypes.string,
};

export default LayoutThree;
