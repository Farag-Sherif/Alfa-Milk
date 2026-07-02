import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";

// Helper: extract local path from full URL (e.g. "https://omdacoffee.com/shop?category=x" → "/shop?category=x")
const getLocalPath = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search;
  } catch {
    return url || "/";
  }
};
// !DEL
const BannerFive = ({ strings, currentLanguageCode }) => {
  const [bannerData, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the banners data when the component mounts
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        const response = await axiosInstance.get("/offers-banner");
        setBanners(response.data || []);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching banner data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBannerData();
  }, []);

  // Filter banners for main and others
  const mainBanner = bannerData?.find((banner) => banner.main === 1);
  const otherBanners = bannerData?.filter((banner) => banner.main !== 1);
  const d1 = otherBanners?.slice(0, 2);
  const d2 = otherBanners?.slice(2, 4);

  // Handle loading state
  if (isLoading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div className="banner-area hm9-section-padding">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-4 col-md-6">
            <div className="row">
              {d1 &&
                d1.map((el) => (
                  <div className="col-lg-12" key={el.id}>
                    <div className="single-banner mb-20">
                      <Link to={getLocalPath(el?.url)}>
                        <img src={el.image_path} alt="Banner" loading="lazy" />
                      </Link>
                      <div className="banner-content-3 banner-position-hm15-1">
                        <h3>
                          {" "}
                          {currentLanguageCode === "en"
                            ? el?.translations[1].title
                            : el?.translations[0].title}
                        </h3>
                        <p>
                          {currentLanguageCode === "en"
                            ? mainBanner?.translations[1].description
                            : mainBanner?.translations[0].description}
                        </p>
                        <Link to={getLocalPath(el?.url)}>
                          <i className="fa fa-long-arrow-right" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            {mainBanner && (
              <div className="single-banner mb-20">
                <Link to={getLocalPath(mainBanner?.url)}>
                  <img
                    src={mainBanner?.image_path}
                    alt="Banner"
                    loading="lazy"
                  />
                </Link>
                <div className="banner-content-4 banner-position-hm15-2">
                  <span>
                    {currentLanguageCode === "en"
                      ? mainBanner?.translations[1].description
                      : mainBanner?.translations[0].description}
                  </span>
                  <h2>
                    {currentLanguageCode === "en"
                      ? mainBanner?.translations[1].title
                      : mainBanner?.translations[0].title}
                  </h2>
                  {/* <h5>
                    {currentLanguageCode === "en"
                      ? mainBanner?.translations[1].description
                      : mainBanner?.translations[0].description}
                  </h5>{" "} */}
                  <Link to={getLocalPath(mainBanner?.url)}>
                    {strings["shop_now"]}
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="row">
              {d2 &&
                d2.map((el) => (
                  <div className="col-lg-12 col-md-6" key={el.id}>
                    <div className="single-banner mb-20">
                      <Link to={getLocalPath(el?.url)}>
                        <img src={el.image_path} alt="Banner" loading="lazy" />
                      </Link>
                      <div className="banner-content-3 banner-position-hm15-2">
                        <h3>
                          {" "}
                          {currentLanguageCode === "en"
                            ? el?.translations[1].title
                            : el?.translations[0].title}
                        </h3>
                        <p>
                          {currentLanguageCode === "en"
                            ? mainBanner?.translations[1].description
                            : mainBanner?.translations[0].description}
                        </p>
                        <Link to={getLocalPath(el?.url)}>
                          <i className="fa fa-long-arrow-right" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default multilanguage(BannerFive);
