import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux"; // استدعاء الهوك السحري من ريدكس
import SectionTitle from "../../components/section-title/SectionTitle";

const BlogFeatured = ({ spaceTopClass, spaceBottomClass }) => {
  // سحب اللغة الحالية مباشرة من الذاكرة المركزية للموقع بالعافية
  const currentLanguageCode = useSelector((state) => state.multilanguage.currentLanguageCode);

  // الترجمة المباشرة بناءً على اللغة اللي سحبناها
  const blogTitle = currentLanguageCode === "ar" ? "مدونتنا" : "OUR BLOG";

  return (
    <div
      className={`blog-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <SectionTitle
          titleText={blogTitle}
          positionClass="text-center"
          spaceClass="mb-55"
        />
        <div className="row">
          {/* {blogFeaturedData.map(singlePost => {
            return (
              <BlogFeaturedFiveSingle singlePost={singlePost} key={singlePost.id} />
            );
          })} */}
        </div>
      </div>
    </div>
  );
};

BlogFeatured.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

// شيلنا تغليف المكتبة القديم واعتمدنا على هوك Redux مباشرة
export default BlogFeatured;