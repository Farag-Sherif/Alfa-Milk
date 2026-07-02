import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const BlogFeaturedSingle = ({ singlePost, currentLanguageCode }) => {  
  return (
    <div className="col-lg-4 col-sm-6">
      <div className="blog-wrap mb-30 scroll-zoom">
        <div className="blog-img">
          <Link to={`/post/${singlePost.id}`}>
            <img src={singlePost.image_path} alt="" />
          </Link>
        </div>
        <div className="blog-content-wrap">
          <div className="blog-content text-center">
            <h3>
              <Link to={`/post/${singlePost.id}`}>
                {currentLanguageCode === "ar" ? singlePost.translations[0].title : singlePost.translations[1].title}
              </Link>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};

BlogFeaturedSingle.propTypes = {
  singlePost: PropTypes.object
};

export default multilanguage(BlogFeaturedSingle);
