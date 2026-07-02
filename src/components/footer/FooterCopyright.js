import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const FooterCopyright = ({
  currentLanguageCode,
  spaceBottomClass,
  colorClass,
  strings,
}) => {
  return (
    <div
      className={`copyright ${spaceBottomClass ? spaceBottomClass : ""} ${
        colorClass ? colorClass : ""
      }`}
    >
      <div className="footer-logo">
        <Link to={process.env.PUBLIC_URL + "/"}>
          <img
            alt=""
            // src={`${
            //   currentLanguageCode === "en" ? "/elmoda EN.svg" : "/elmoda AR.svg"
            // }`}
                src={"/logo.png"}
            width={120}
            height={120}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              maxWidth: "150px",
            }}
          />
        </Link>
      </div>
      {/* <p>
        © 2025{" "}
        <a href="/" rel="noopener noreferrer" target="_blank">
          {strings["elmoda"]}
        </a>
        .<br /> {strings["footerRights"]}
      </p> */}
    </div>
  );
};

FooterCopyright.propTypes = {
  footerLogo: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
};

export default multilanguage(FooterCopyright);
