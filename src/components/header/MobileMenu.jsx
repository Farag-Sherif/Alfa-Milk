import React, { useEffect } from "react";
import MobileLangCurChange from "./sub-components/MobileLangCurrChange";
import MobileNavMenu from "./sub-components/MobileNavMenu";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
// import MobileMenuSearch from "./sub-components/MobileSearch";
// import MobileWidgets from "./sub-components/MobileWidgets";
// !DEL
const MobileMenu = ({currentLanguageCode}) => {
  useEffect(() => {
    const offCanvasNav = document.querySelector("#offcanvas-navigation");
    const offCanvasNavSubMenu = offCanvasNav.querySelectorAll(".sub-menu");
    const anchorLinks = offCanvasNav.querySelectorAll("a");

    for (let i = 0; i < offCanvasNavSubMenu.length; i++) {
      offCanvasNavSubMenu[i].insertAdjacentHTML(
        "beforebegin",
        "<span class='menu-expand'><i></i></span>"
      );
    }

    const menuExpand = offCanvasNav.querySelectorAll(".menu-expand");
    const numMenuExpand = menuExpand.length;

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", (e) => {
        sideMenuExpand(e);
      });
    }

    for (let i = 0; i < anchorLinks.length; i++) {
      anchorLinks[i].addEventListener("click", () => {
        closeMobileMenu();
      });
    }
  });

  const sideMenuExpand = (e) => {
    e.currentTarget.parentElement.classList.toggle("active");
  };

  const closeMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.remove("active");
  };

  return (
    <div className="offcanvas-mobile-menu" id="offcanvas-mobile-menu">
      <button
        className="offcanvas-menu-close"
        id="mobile-menu-close-trigger"
        onClick={() => closeMobileMenu()}
      >
        <i className="pe-7s-close"></i>
      </button>
      <div className="offcanvas-wrapper">
        <div className="offcanvas-inner-content">
          {/* mobile Logo */}
              <div
                className="mb-4 d-flex justify-content-center"
                style={{ marginTop: "0px !important" }}
              >
                <Link to={process.env.PUBLIC_URL + "/"}>
                  <img
                    alt=""
                    // src={`${
                    //   currentLanguageCode === "en" ? "/elmoda EN.svg" : "/elmoda AR.svg"
                    // }`}
                    src={'/logo.png'}
                    width={80}
                    height={80}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                      maxWidth: "170px",
                      textAlign: "center"
                    }}
                  />
                </Link>
              </div>

          {/* mobile nav menu */}
          <MobileNavMenu />

          {/* mobile language and currency */}
          <MobileLangCurChange />

          {/* mobile widgets */}
          {/* <MobileWidgets /> */}
        </div>
      </div>
    </div>
  );
};

export default multilanguage(MobileMenu);
