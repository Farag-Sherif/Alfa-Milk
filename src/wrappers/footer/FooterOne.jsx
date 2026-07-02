import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import FooterCopyright from "../../components/footer/FooterCopyright";
import FooterNewsletter from "../../components/footer/FooterNewsletter";
import Collapse from "react-bootstrap/Collapse";

const FooterOne = ({
  backgroundColorClass,
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  containerClass,
  extraFooterClass,
  sideMenu,
  currentLanguageCode,
  strings,
  footerTopSpaceTopClass,
}) => {
  const [scroll, setScroll] = useState(0);
  const [top, setTop] = useState(0);
  const [footer, setFooter] = useState({});
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");  

  useEffect(() => {
    setTop(100);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const response = await axiosInstance.get("/settings");
        setFooter(response.data);
        setEmail(response.data.emails[0].email);
        setPhone(response.data.mobiles[0].mobile);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFooter();
  }, []);

  const handleScroll = () => {
    setScroll(window.scrollY);
  };
  const [socails, setSocails] = useState([]);
  const [socialMediaTranslations, setSocialMediaTranslations] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [OpenTap1, setOpenTap1] = useState(false);
  const [OpenTap2, setOpenTap2] = useState(false);
  const [OpenTap3, setOpenTap3] = useState(false);
  const [OpenTap4, setOpenTap4] = useState(false);
  const [OpenTap5, setOpenTap5] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 768);
    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/socails") // Assuming this is the endpoint providing social data
      .then((res) => {
        setSocails(res.data || []);

        const translations = res.data.reduce((acc, el) => {
          if (el.url) {
            // Extract the domain from the URL
            const domain = new URL(el.url).hostname.split(".")[1];

            // Define a generic translation mapping for common platforms and URLs
            const translationMap = {
              facebook: {
                en: "Facebook",
                ar: "فيسبوك",
              },
              youtube: {
                en: "YouTube",
                ar: "يوتيوب",
              },
              instagram: {
                en: "Instagram",
                ar: "إنستغرام",
              },
              // WhatsApp
              me: {
                en: "WhatsApp",
                ar: "واتساب",
              },
              tiktok: {
                en: "Tiktok",
                ar: "تيك توك",
              },
              com: {
                en: "Youtube",
                ar: "يوتيوب",
              },
            };

            // Default to the domain if no specific translation is found
            const translate = (platform) =>
              translationMap[platform] || { en: platform, ar: platform };

            // Handle WhatsApp separately because it's a "wa.me" link
            const platformName = domain
              ? domain
              : el.url.includes("wa.me")
              ? "wa"
              : el.url.split("/")[2]; // Fallback to domain name

            acc[el.url] = translate(platformName);
          }
          return acc;
        }, {});
        setSocialMediaTranslations(translations); // Save translations to state
      })
      .catch(() => setSocails([]));
  }, []);

  useEffect(() => {
    axiosInstance
      .get("/certificates")
      .then((res) => {
        console.log(res.data);
        setCertificates(res.data || []);
      })
      .catch(() => setCertificates([]));
  }, []);

  return (
    <footer
      s
      className={`footer-area ${
        backgroundColorClass ? backgroundColorClass : ""
      } ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      } ${extraFooterClass ? extraFooterClass : ""} ${
        spaceLeftClass ? spaceLeftClass : ""
      } ${spaceRightClass ? spaceRightClass : ""}`}
      style={{
        paddingBottom: "100px",
        paddingTop: footerTopSpaceTopClass ? "50px" : "",
      }}
    >
      <div className={`${containerClass ? containerClass : "container"}`}>
        {isMobile ? (
          <div className="row">
            <div
              className={`${
                sideMenu ? "col-xl-2 col-sm-4" : "col-lg-2 col-sm-4"
              }`}
            >
              {/* footer copyright */}
              <FooterCopyright
                currentLanguageCode={currentLanguageCode}
                spaceBottomClass="mb-30"
              />
            </div>
            <div className="col-12">
              <div
                onClick={() => setOpenTap1(!OpenTap1)}
                className={`d-flex ${
                  currentLanguageCode === "ar" ? "flex-row-reverse" : ""
                } justify-content-between w-100 bg-transparent cursor-pointer py-4`}
                // dir={currentLanguageCode === 'ar' ? 'rtl' : 'ltr'}
              >
                <span className="text-white">{strings["pages"]}</span>
                <span>{OpenTap1 ? "-" : "+"}</span>
              </div>
              <Collapse in={OpenTap1}>
                <div className="col-12">
                  <div className="footer-list">
                    <ul>
                      <li>
                        <Link
                          className="text-white"
                          to={process.env.PUBLIC_URL + "/about"}
                        >
                          {strings["about_us"]}
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="text-white"
                          to={process.env.PUBLIC_URL + "/contact"}
                        >
                          {strings["contact_us"]}
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="text-white"
                          to={process.env.PUBLIC_URL + "/blog"}
                        >
                          {strings["blog"]}
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="text-white"
                          to={process.env.PUBLIC_URL + "/shop"}
                        >
                          {strings["shop"]}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </Collapse>
            </div>
            <div className="col-12">
              <div
                onClick={() => setOpenTap2(!OpenTap2)}
                className={`d-flex ${
                  currentLanguageCode === "ar" ? "flex-row-reverse" : ""
                } justify-content-between w-100 bg-transparent cursor-pointer py-4`}
                // dir={currentLanguageCode === 'ar' ? 'rtl' : 'ltr'}
              >
                <span className="text-white">{strings["contact_us"]}</span>
                <span>{OpenTap2 ? "-" : "+"}</span>
              </div>
              <Collapse in={OpenTap2}>
                <div className="col-12">
                  <div className="footer-widget mb-30 ml-30">
                    <div
                      // className=" d-flex "
                      className={`d-flex flex-column footer-list ${
                        currentLanguageCode === "ar"
                          ? "justify-content-end text-right"
                          : "align-items-start text-left"
                      }`}
                      dir={currentLanguageCode === "ar" ? "rtl" : "ltr"}
                    >
                      <ul>
                        <li>
                          <span>{strings["phone"]}: {phone}</span>
                        </li>
                        <li>
                          <span>{strings["email"]}: {email}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
            <div className="col-12">
              <div
                onClick={() => setOpenTap3(!OpenTap3)}
                className={`d-flex ${
                  currentLanguageCode === "ar" ? "flex-row-reverse" : ""
                } justify-content-between w-100 bg-transparent cursor-pointer py-4`}
              >
                <span className="text-white">
                  {strings["CONTACT_SOCIAL_TITLE"]}
                </span>
                <span>{OpenTap3 ? "-" : "+"}</span>
              </div>
              <Collapse in={OpenTap3}>
                <div
                  className={`${
                    sideMenu ? "col-xl-3 col-sm-4" : "col-lg-2 col-sm-6"
                  }`}
                >
                  <div
                    className={`${
                      sideMenu
                        ? "footer-widget mb-30 ml-145"
                        : "footer-widget mb-30 ml-75"
                    }`}
                  >
                    <div
                      className={`d-flex flex-column footer-list ${
                        currentLanguageCode === "ar"
                          ? "justify-content-end text-right"
                          : "align-items-start text-left"
                      }`}
                      dir={currentLanguageCode === "ar" ? "rtl" : "ltr"}
                    >
                      <ul>
                        {socails?.map((el, index) => (
                          <li key={el.id || index}>
                            <a
                              href={el.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {/* Check current language code and render corresponding translation */}
                              {
                                currentLanguageCode === "en"
                                  ? socialMediaTranslations[el.url]?.en ||
                                    el.url.split("/")[2] // Default to domain name
                                  : socialMediaTranslations[el.url]?.ar ||
                                    el.url.split("/")[2] // Default to domain name in Arabic
                              }
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Collapse>
            </div>
            <div className="col-12">
              <div
                onClick={() => setOpenTap4(!OpenTap4)}
                className={`d-flex ${
                  currentLanguageCode === "ar" ? "flex-row-reverse" : ""
                } justify-content-between w-100 bg-transparent cursor-pointer py-4`}
              >
                <span className="text-white">{strings["subscribe"]}</span>
                <span>{OpenTap4 ? "-" : "+"}</span>
              </div>
              <Collapse in={OpenTap4}>
                <div
                  className={`${
                    "col-12"
                    // sideMenu ? "col-xl-3 col-sm-8" : "col-lg-4 col-sm-6"
                  }`}
                >
                  {/* footer newsletter */}
                  <FooterNewsletter
                    spaceBottomClass="mb-30"
                    // spaceLeftClass="ml-70"
                    sideMenu={sideMenu}
                    isMobile={isMobile}
                  />
                </div>
              </Collapse>
            </div>
            <div className="col-12">
              <div
                onClick={() => setOpenTap5(!OpenTap5)}
                className={`d-flex ${
                  currentLanguageCode === "ar" ? "flex-row-reverse" : ""
                } justify-content-between w-100 bg-transparent cursor-pointer py-4`}
              >
                <span className="text-white">{strings["certificates"]}</span>
                <span>{OpenTap5 ? "-" : "+"}</span>
              </div>
              <Collapse in={OpenTap5}>
                <div className={`${"col-12"}`}>
                  <div className="d-flex justify-content-center flex-wrap">
                    {certificates?.map((certificate, i) => {
                      return (
                        <div key={i} className="mr-1">
                          <a
                            href={certificate.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={certificate.image_path}
                              alt={"certificate"}
                              width={80}
                              height={80}
                            />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Collapse>
            </div>
          </div>
        ) : (
          <div className="row">
            <div
              className={`${
                sideMenu ? "col-xl-2 col-sm-4" : "col-md-2 col-sm-4"
              }`}
            >
              {/* footer copyright */}
              <FooterCopyright
                currentLanguageCode={currentLanguageCode}
                spaceBottomClass="mb-30"
              />
            </div>

            <div
              className={`${
                sideMenu ? "col-xl-2 col-sm-4" : "col-md-2 col-sm-4"
              }`}
            >
              <div className="footer-widget mb-30 ml-30">
                <div className="footer-title">
                  <h3 className="text-white">{strings["pages"]}</h3>
                </div>
                <div className="footer-list">
                  <ul>
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
                    <li>
                      <Link to={process.env.PUBLIC_URL + "/blog"}>
                        {strings["blog"]}
                      </Link>
                    </li>
                    <li>
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        {strings["shop"]}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              className={`${
                sideMenu ? "col-xl-3 col-sm-4" : "col-md-2 col-sm-6"
              }`}
            >
              <div
                className={`${
                  sideMenu
                    ? "footer-widget mb-30 ml-145"
                    : "footer-widget mb-30 ml-30"
                }`}
              >
                <div className="footer-title">
                  <h3 className="text-white">
                    {strings["CONTACT_SOCIAL_TITLE"]}
                  </h3>
                </div>
                <div className="footer-list">
                  <ul>
                    {socails?.map((el, index) => (
                      <li key={el.id || index}>
                        <a
                          href={el.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {/* Check current language code and render corresponding translation */}
                          {
                            currentLanguageCode === "en"
                              ? socialMediaTranslations[el.url]?.en ||
                                el.url.split("/")[2] // Default to domain name
                              : socialMediaTranslations[el.url]?.ar ||
                                el.url.split("/")[2] // Default to domain name in Arabic
                          }
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div
              className={`${
                sideMenu ? "col-xl-3 col-sm-8" : "col-md-3 col-sm-6"
              }`}
            >
              {/* footer newsletter */}
              <FooterNewsletter
                spaceBottomClass="mb-30"
                // spaceLeftClass="ml-70"
                sideMenu={sideMenu}
              />
            </div>

            <div
              className={`${
                sideMenu ? "col-xl-3 col-sm-8" : "col-md-3 col-sm-6"
              }`}
            >
              <h3 className="text-white">{strings["certificates"]}</h3>
              <div className="d-flex justify-content-around flex-wrap">
                {certificates?.map((certificate, i) => {
                  return (
                    <div key={i} className="mr-1">
                      <a
                        href={certificate.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          src={certificate.image_path}
                          alt={"certificate"}
                          width={80}
                          height={80}
                        />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="footer-bottom text-center ">
        <div className="container">
          <div className={`copyright-2 d-flex justify-content-between`}>
            <p>
              {strings["footerRights"]}
              <a href="/" rel="noopener noreferrer" target="_blank">
                {strings["elmoda"]}
              </a>{" "}
              © 2025{" "}
            </p>
            <p>
              <a
                href="http://bluebrain-co.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Blue Brain
              </a>{" "}
              © {strings["design_development"]}{" "}
            </p>
          </div>
        </div>
      </div>
      {/* WhatsApp button */}
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

FooterOne.propTypes = {
  backgroundColorClass: PropTypes.string,
  containerClass: PropTypes.string,
  extraFooterClass: PropTypes.string,
  sideMenu: PropTypes.bool,
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
};

export default multilanguage(FooterOne);
