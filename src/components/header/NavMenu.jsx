import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import { useSelector } from "react-redux";

const NavMenu = ({ strings, menuWhiteClass, sidebarMenu }) => {
  const currentLanguageCode = useSelector(
    (state) => state.multilanguage.currentLanguageCode,
  );

  const isArabic = currentLanguageCode === "ar";

  return (
    <div
      className={`${
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
      }`}
      dir={isArabic ? "rtl" : "ltr"}>
      <nav>
        <ul
          style={{
            fontFamily: isArabic
              ? "'Cairo', sans-serif"
              : "'Poppins', sans-serif",
            fontWeight: isArabic ? "400" : "100",
            direction: isArabic ? "rtl" : "ltr",
            textAlign: isArabic ? "right" : "left",
          }}>
          <li>
            <Link to={process.env.PUBLIC_URL + "/"}>{strings["home"]}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/shop"}>{strings["shop"]}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/offers"}>
              {strings["offers"]}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/blog"}>{strings["blog"]}</Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/about"}>
              {strings["about_us"]}
            </Link>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/contact"}>
              {strings["contact_us"]}
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool,
  strings: PropTypes.object,
};

export default multilanguage(NavMenu);
