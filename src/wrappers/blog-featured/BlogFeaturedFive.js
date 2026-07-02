import PropTypes from "prop-types";
import React from "react";
import blogFeaturedFiveData from "../../data/blog-featured/blog-featured-five.json";
import BlogFeaturedFiveSingle from "../../components/blog-featured/BlogFeaturedFiveSingle";
import SectionTitleSeven from "../../components/section-title/SectionTitleSeven";
import { useSelector } from "react-redux";

const BlogFeaturedFive = ({ spaceTopClass, spaceBottomClass }) => {
  const currentLanguageCode = useSelector((state) => state.multilanguage.currentLanguageCode);
const blogTitle = currentLanguageCode === "ar" ? "مدونتنا" : "OUR BLOG";
  return (
    <div
      className={`blog-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        {/* section title */}
        <SectionTitleSeven
          titleText={blogTitle}
          positionClass="text-center"
          borderClass="bottom-border"
          spaceClass="mb-55"
        />
        <div className="row">
          {blogFeaturedFiveData.map((singlePost) => {
            return (
              <BlogFeaturedFiveSingle
                singlePost={singlePost}
                key={singlePost.id}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

BlogFeaturedFive.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default BlogFeaturedFive;
