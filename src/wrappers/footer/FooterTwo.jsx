import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
// !DEL
const FooterTwo = ({
  backgroundColorClass,
  copyrightColorClass,
  spaceLeftClass,
  spaceRightClass,
  footerTopBackgroundColorClass,
  footerTopSpaceTopClass,
  footerTopSpaceBottomClass,
  backgroundImage,
  currentLanguageCode,
  strings,
}) => {
  const [footer, setFooter] = useState({});
  const [scroll, setScroll] = useState(0);
  const [top, setTop] = useState(0);

  useEffect(() => {
    setTop(100);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/settings")
      .then((res) => setFooter(res.data))
      .catch(() => setFooter({}));
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };
  return (
    <footer
      className={`footer-area ${
        backgroundColorClass ? backgroundColorClass : ""
      } ${spaceLeftClass ? spaceLeftClass : ""} ${
        spaceRightClass ? spaceRightClass : ""
      } ${backgroundImage ? "bg-img" : ""}`}
      style={{
        backgroundImage: ` ${
          backgroundImage
            ? `url(${process.env.PUBLIC_URL + backgroundImage})`
            : `url()`
        }`,
      }}
    >
      <div
        className={`footer-top text-center ${
          footerTopBackgroundColorClass ? footerTopBackgroundColorClass : ""
        } ${footerTopSpaceTopClass ? footerTopSpaceTopClass : ""}  ${
          footerTopSpaceBottomClass ? footerTopSpaceBottomClass : ""
        }`}
      >
        <div className="container">
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
          <p>
            {footer && currentLanguageCode === "ar"
              ? footer?.settings?.translations[0]?.about_us
              : footer?.settings?.translations[1]?.about_us}
          </p>
          <div className="footer-social">
            <ul>
              {footer?.socails?.map((el, index) => (
                <li key={el.id || index}>
                  <a href={el.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`https://admin.omdacoffee.com/images/${el.icon}`}
                      alt={`Social media icon ${index + 1}`}
                      className="social-media-icon"
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="footer-bottom text-center">
        <div className="container">
          <div
            className={`copyright-2 ${
              copyrightColorClass ? copyrightColorClass : ""
            }`}
          >
            <p>
              © 2025{" "}
              <a href="/" rel="noopener noreferrer" target="_blank">
                {strings["elmoda"]}
              </a>{" "}
              {strings["footerRights"]}
            </p>
          </div>
        </div>
      </div> */}
      <button
        className={`scroll-top ${scroll > top ? "show" : ""}`}
        onClick={() =>
          window.open(
            `https://wa.me/${(footer?.mobiles[1].mobile).replace("+", "")}`,
            "_blank"
          )
        }
      >
        <svg
          style={{
            width: "60%",
            height: "60%",
            fill: "#FFF",
            margin: "auto",
          }}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
        </svg>
      </button>
    </footer>
  );
};

FooterTwo.propTypes = {
  backgroundColorClass: PropTypes.string,
  copyrightColorClass: PropTypes.string,
  footerLogo: PropTypes.string,
  backgroundImage: PropTypes.string,
  footerTopBackgroundColorClass: PropTypes.string,
  footerTopSpaceBottomClass: PropTypes.string,
  footerTopSpaceTopClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
};

export default multilanguage(FooterTwo);
