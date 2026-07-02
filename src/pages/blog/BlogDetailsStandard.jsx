import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
// import BlogComment from "../../wrappers/blog/BlogComment";
import BlogPost from "../../wrappers/blog/BlogPost";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const BlogDetailsStandard = ({ location, strings, currentLanguageCode }) => {
  const { pathname } = location;
  const locationParam = useLocation();

  const [post, setPost] = useState(null);

  // get post data from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const params = new URLSearchParams(locationParam.search);
        const postId = params.get("postId");
        console.log(postId);
        

        const response = await axios.get(
          `https://admin.omdacoffee.com/api/blog/${postId}`
        );
        console.log(response.data);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, [locationParam.search]);

  return (
    <Fragment>
      <MetaTags>
        <title>
          {strings["elmoda"]} |{" "}
          {currentLanguageCode === "ar"
            ? post?.item?.translations[0]?.title
            : post?.item?.translations[1]?.title}
        </title>
        <meta
          name="description"
          content={
            currentLanguageCode === "ar"
              ? post?.item?.translations[0]?.content
              : post?.item?.translations[1]?.content
          }
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["home"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["Post"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-9">
                <div className="blog-details-wrapper ml-20">
                  {/* blog post */}
                  <BlogPost data={post} />

                  {/* blog post comment */}
                  {/* <BlogComment /> */}
                </div>
              </div>
              <div className="col-lg-3">
                {/* blog sidebar */}
                <BlogSidebar />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

BlogDetailsStandard.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(BlogDetailsStandard);
