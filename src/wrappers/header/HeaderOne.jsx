import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import HeaderTop from "../../components/header/HeaderTop";
import IconGroup from "../../components/header/IconGroup";
import Logo from "../../components/header/Logo";
import MobileMenu from "../../components/header/MobileMenu";
import NavMenu from "../../components/header/NavMenu";
// !DEL
const HeaderOne = ({
  layout,
  borderStyle,
  headerPaddingClass,
  headerPositionClass,
  headerBgClass,
}) => {
  const [scroll, setScroll] = useState(0);
  const [headerTop, setHeaderTop] = useState(0);

  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    setHeaderTop(header.offsetTop);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };

  return (
    <header
      className={`header-area clearfix ${headerBgClass ? headerBgClass : ""} ${
        headerPositionClass ? headerPositionClass : ""
      }`}
    >
      <div
        className={`${headerPaddingClass ? headerPaddingClass : ""}
            header-top-area ${
              borderStyle === "fluid-border" ? "border-none" : ""
            }
            ${scroll > headerTop ? "stickTop stick" : ""} sticky-bar
            `}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          {/* header top */}
          <HeaderTop borderStyle={borderStyle} />
        </div>
      </div>

      <div
        className={` ${
          headerPaddingClass ? headerPaddingClass : ""
        } sticky-bar header-res-padding clearfix ${
          scroll > headerTop ? "stick" : ""
        }`}
        style={{ background: "#FFF" }}
      >
        <div className={layout === "container-fluid" ? layout : "container"}>
          <div className="row">
            <div
              className="col-xl-2 col-lg-2 col-md-6 col-4"
              style={{
                margin: "auto",
                paddingInlineStart: "0px",
              }}
            >
              {/* header logo */}
              <Logo imageUrl="/assets/img/logo/logo.png" logoClass="logo" />
            </div>
            <div className="col-xl-8 col-lg-8 d-none d-lg-flex"      style={{
          alignItems: "center",
          display: "flex!important",
          alignItems:'center',
          flexDirection:'column',
          justifyContent:'center'
          }} >
              {/* Nav menu */}
              <NavMenu />
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6 col-8"  style={{
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-end",}}>
              {/* Icon group */}
              <IconGroup />
            </div>
          </div>
        </div>
        {/* mobile menu */}
        <MobileMenu />
      </div>
    </header>
  );
};

HeaderOne.propTypes = {
  borderStyle: PropTypes.string,
  headerPaddingClass: PropTypes.string,
  headerPositionClass: PropTypes.string,
  layout: PropTypes.string,
  top: PropTypes.string,
};

export default HeaderOne;
