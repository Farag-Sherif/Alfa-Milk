import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import BlogFeaturedThreeSingle from "../../components/blog-featured/BlogFeaturedThreeSingle";
import SectionTitle from "../../components/section-title/SectionTitle";
import axios from "axios";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const BlogFeaturedThree = ({ spaceTopClass, spaceBottomClass, strings, currentLanguageCode }) => {
    const [blogFeaturedData, setBlogFeaturedData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // الترجمة المباشرة للعنوان
    const blogTitle = currentLanguageCode === "ar" ? "مدونتنا" : "OUR BLOG";
    
    // get last 3 posts
    useEffect(() => {
      // fetch data from API
      const fetchItems = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get("https://admin.omdacoffee.com/api/blogs");
          console.log(response);
          
          const data = response.data.slice(0, 3);
          setBlogFeaturedData(data);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.error("Error fetching items:", error);
        }
      }
      fetchItems();
    }, [])
  
    // Handle loading state
    if (isLoading) {
      return <div className="loading-spinner" />;
    }
    
  return (
    <div
      className={`blog-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <SectionTitle
          titleText={blogTitle} // هنا استخدمنا المتغير المترجم
          positionClass="text-center"
          spaceClass="mb-55"
        />
        <div className="row">
          {blogFeaturedData.map(singlePost => {
            return (
              <BlogFeaturedThreeSingle
                singlePost={singlePost}
                key={singlePost.id}
              />
            );
          })}
          <div className="view-more text-center mt-20 toggle-btn6 col-12">
            <Link className="loadMore6" to={process.env.PUBLIC_URL + "/blog"}>
              {strings["view_more"]}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogFeaturedThree.propTypes = {
  spaceBottomClass: PropTypes.string,
  spaceTopClass: PropTypes.string,
  strings: PropTypes.object,
  currentLanguageCode: PropTypes.string
};

export default multilanguage(BlogFeaturedThree);