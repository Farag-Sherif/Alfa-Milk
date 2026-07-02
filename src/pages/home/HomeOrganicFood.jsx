import React, { Fragment, useState, useEffect } from "react";
import MetaTags from "react-meta-tags";
import { multilanguage } from "redux-multilanguage";
import LayoutThree from "../../layouts/LayoutThree";
import BannerFive from "../../wrappers/banner/BannerFive";
import CountDownTwo from "../../wrappers/countdown/CountDownTwo";
import FeatureIconFour from "../../wrappers/feature-icon/FeatureIconFour";
import HeroSliderFive from "../../wrappers/hero-slider/HeroSliderFive";
import NewsletterTwo from "../../wrappers/newsletter/NewsletterTwo";
import TabProductFour from "../../wrappers/product/TabProductFour";
import CategoryNoSlider from "../../wrappers/category/CategoryNoSlider.js";
import TestimonialOne from "../../wrappers/testimonial/TestimonialOne";
import BlogFeaturedThree from "../../wrappers/blog-featured/BlogFeaturedThree.js";
import Icons from "../../components/icons/Icons.jsx";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs.js";
import axiosInstance from "../../api/api";
// !DEL
const HomeOrganicFood = ({ strings }) => {
  const [featureData, setFeatureData] = useState([]);

  useEffect(() => {
    const fetchFeatureData = async () => {
      try {
        const response = await axiosInstance.get("/features");
        setFeatureData(response.data || []);
      } catch (error) {
        console.error("Error fetching feature data:", error);
      }
    };
    fetchFeatureData();
  }, []);

  const feature1 = featureData?.slice(0, 1);
  const feature2 = featureData?.slice(1, 2);
  const feature3 = featureData?.slice(2);

  return (
    <Fragment>
      <MetaTags>
        <title>{strings["elmoda"]}</title>
        <meta
          name="description"
          content="ألفا ميلك - منتجات ألبان طازجة وعالية الجودة"
        />
      </MetaTags>
      <LayoutThree
        headerTop="visible"
        headerContainerClass="container-fluid"
        headerBorderStyle="fluid-border"
        headerPaddingClass="header-padding-2"
      >
        {/* hero slider */}
        <HeroSliderFive />
        {/* countdown */}
        <CountDownTwo
          spaceTopClass="pt-80"
          spaceBottomClass="pb-95"
          dateTime="November 13, 2020 12:12:00"
        />
        {/* feature icon 1 */}
        <FeatureIconFour
          spaceTopClass="pt-10"
          spaceBottomClass="pb-20"
          containerClass="container-fluid p-0"
          gutterClass=""
          data={feature1}
          colClass="col-12 px-0"
        />
        {/* category */}
        <CategoryNoSlider spaceBottomClass="pb-90" />
        {/* feature icon 2 */}
        <FeatureIconFour
          spaceTopClass="pt-10"
          spaceBottomClass="pb-20"
          containerClass="container-fluid p-0"
          gutterClass=""
          data={feature2}
          colClass="col-12 px-0"
        />
        {/* tab product */}
        <TabProductFour
          spaceBottomClass="pb-100"
          category="organic food"
          productTabClass="product-tab-fruits"
        />
        {/* banner */}
        <BannerFive />
        {/* feature icon 3 */}
        <FeatureIconFour
          spaceTopClass="pt-20"
          spaceBottomClass="pb-20"
          containerClass="container-fluid px-0"
          gutterClass=""
          data={feature3}
          colClass="col-12 px-0"
        />
        {/* testimonial */}
        <TestimonialOne
          spaceTopClass="pt-70"
          spaceBottomClass="pb-70"
          // spaceLeftClass="ml-70"
          // spaceRightClass="mr-70"
          bgColorClass="bg-gray-3"
        />
        {/* newsletter */}
        <NewsletterTwo
          spaceTopClass="pt-70"
          spaceBottomClass="pb-70"
          subscribeBtnClass=""
        />
        {/* blog featured */}
        <BlogFeaturedThree spaceBottomClass="pb-55" />
        <Icons />
        <WhyChooseUs />
      </LayoutThree>
    </Fragment>
  );
};

export default multilanguage(HomeOrganicFood);
