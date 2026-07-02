import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";
import SectionTitleWithText from "../../components/section-title/SectionTitleWithText";
import LayoutOne from "../../layouts/LayoutOne";
import TextGridOne from "../../wrappers/text-grid/TextGridOne";

// !DEL
const About = ({ location, strings }) => {
  const [allData, setAllData] = useState({});
  const { pathname } = location;
  const [loading, setLoading] = useState(true); // Add loading state
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axiosInstance.get("/about");
        if (response.data) {
          setAllData(response.data);
        }
      } catch (error) {
        setAllData({});
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false); // Set loading to false after the data is fetched
      }
    };

    fetchItems();
  }, []);

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["elmoda"]}| {strings["about_us"]}
        </title>
        <meta
          name="description"
          content="About page of flone react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["about_us"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* section title with text */}
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          <SectionTitleWithText
            allData={allData}
            spaceTopClass="pt-100"
            spaceBottomClass="pb-95"
          />
        )}

        {/* text grid */}
        {loading ? (
          <div className="loading-spinner" />
        ) : (
          <TextGridOne allData={allData} spaceBottomClass="pb-70" />
        )}
      </LayoutOne>
    </Fragment>
  );
};

About.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(About);
