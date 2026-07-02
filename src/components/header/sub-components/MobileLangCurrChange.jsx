import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { changeLanguage, multilanguage } from "redux-multilanguage";
import { setCurrency } from "../../../redux/actions/currencyActions";
// !DEL
const MobileLangCurrChange = ({ currentLanguageCode, dispatch, strings }) => {
  const changeLanguageTrigger = (e) => {
    const languageCode = e.target.value;
    dispatch(changeLanguage(languageCode));
    window.location.reload();
  };

  const closeMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.remove("active");
  };

  return (
    <div className="mobile-menu-middle">
      <div className="lang-curr-style">
        <span className="title mb-2">
          {strings["title"]}
        </span>
        <div className="position-relative">
          <select
            value={currentLanguageCode}
            onChange={(e) => {
              changeLanguageTrigger(e);
              closeMobileMenu();
            }}
            className="appearance-none "
            style={{ appearance: "none", backgroundImage: "none" }}
          >
            <option value="en">{strings["en"]}</option>
            <option value="ar">{strings["ar"]}</option>
          </select>
          <i
            className="fa fa-globe position-absolute"
            style={{
              top: "50%",
              right: "7%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

MobileLangCurrChange.propTypes = {
  setCurrency: PropTypes.func,
  currency: PropTypes.object,
  currentLanguageCode: PropTypes.string,
  dispatch: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    currency: state.currencyData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrency: (currencyName) => {
      dispatch(setCurrency(currencyName));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(MobileLangCurrChange));
