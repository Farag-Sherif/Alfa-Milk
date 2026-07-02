import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { changeLanguage } from "redux-multilanguage";
// !DEL
const LanguageCurrencyChanger = ({
  currentLanguageCode,
  dispatch,
  strings,
  footer,
}) => {
  const [isHidden, setIsHidden] = useState(false);

  const changeLanguageTrigger = (e) => {
    const languageCode = e.target.value;
    dispatch(changeLanguage(languageCode));
    window.location.reload();
  };
  const handleScroll = () => {
    const scrollTop = window.scrollY; // Get the current scroll position
    setIsHidden(scrollTop > 50); // Hide if scrolled down 50px or more
  };

  useEffect(() => {
    const header = document.querySelector(".sticky-bar");
    if (header) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="language-currency-wrap d-none d-lg-flex"
      style={{ minHeight: isHidden ? "60px" : "50px" }}
    >
      <div
        className={`same-language-currency language-style ${
          isHidden ? "hidden" : ""
        }`}
        style={{ minHeight: "50px" }}
      >
        <span>
          {currentLanguageCode === "en" ? "English" : "Arabic"}{" "}
          <i className="fa fa-globe" />
        </span>
        <div className="lang-car-dropdown">
          <ul>
            <li>
              <button value="en" onClick={(e) => changeLanguageTrigger(e)}>
                {strings["en"]}
              </button>
            </li>
            <li>
              <button value="ar" onClick={(e) => changeLanguageTrigger(e)}>
                {strings["ar"]}
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="same-language-currency">
        <p>
          {strings["call_us"]} {footer?.mobiles[0].mobile}
        </p>
      </div>
    </div>
  );
};

LanguageCurrencyChanger.propTypes = {
  setCurrency: PropTypes.func,
  currency: PropTypes.object,
  currentLanguageCode: PropTypes.string,
  dispatch: PropTypes.func,
};

export default LanguageCurrencyChanger;
