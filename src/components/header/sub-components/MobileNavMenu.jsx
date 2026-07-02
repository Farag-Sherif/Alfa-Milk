import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const MobileNavMenu = ({ strings, currentLanguageCode }) => {
  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
        <li
          style={{ direction: currentLanguageCode === "ar" ? "rtl" : "tlr" }}
          className="menu-item-has-children"
        >
          <Link to={process.env.PUBLIC_URL + "/"}>
            {strings["home"]}
            <i className="fa fa-home text-white rounded-lg p-2 mx-2 bg-success" />
          </Link>
        </li>
        <li
          style={{ direction: currentLanguageCode === "ar" ? "rtl" : "ltr" }}
          className="menu-item-has-children"
        >
          <Link to={process.env.PUBLIC_URL + "/shop"}>
            {strings["shop"]}
            <i className="fa fa-shopping-bag text-white rounded-lg p-2 mx-2 bg-success" />
          </Link>
        </li>
        <li
          style={{ direction: currentLanguageCode === "ar" ? "rtl" : "ltr" }}
          className="menu-item-has-children"
        >
          <Link to={process.env.PUBLIC_URL + "/about"}>
            {strings["about_us"]}
            <i className="fa fa-info-circle text-white rounded-lg p-2 mx-2 bg-success" />
          </Link>
        </li>
        <li
          style={{ direction: currentLanguageCode === "ar" ? "rtl" : "ltr" }}
          className="menu-item-has-children"
        >
          <Link to={process.env.PUBLIC_URL + "/blog"}>
            {strings["blog"]}
            <i className="fa fa-pencil-square-o text-white rounded-lg p-2 mx-2 bg-success" />
          </Link>
        </li>
        <li
          style={{ direction: currentLanguageCode === "ar" ? "rtl" : "ltr" }}
          className="menu-item-has-children"
        >
          <Link to={process.env.PUBLIC_URL + "/offers"}>
            {strings["offers"]}
            <i className="fa fa-tags text-white rounded-lg p-2 mx-2 bg-success" />
          </Link>
        </li>
        <li
          style={{ direction: currentLanguageCode === "ar" ? "rtl" : "ltr" }}
          className="menu-item-has-children"
        >
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            {strings["contact_us"]}
            <i className="fa fa-phone text-white rounded-lg p-2 mx-2 bg-success" />
          </Link>
        </li>
        <li
          style={{ direction: currentLanguageCode === "ar" ? "rtl" : "ltr" }}
          className="menu-item-has-children"
        >
          <Link to={process.env.PUBLIC_URL + "/wishlist"}>
            {strings["wishlist"]}
            <i className="fa fa-heart text-white rounded-lg p-2 mx-2 bg-success" />
          </Link>
        </li>
      </ul>
    </nav>
  );
};

MobileNavMenu.propTypes = {
  strings: PropTypes.object,
};

export default multilanguage(MobileNavMenu);
