import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPostsNoSidebar from "../../wrappers/blog/BlogPostsNoSidebar";
import axios from "axios";
import { multilanguage } from "redux-multilanguage";

const BlogNoSidebar = ({ location, strings }) => {
  const { pathname } = location;
  const [blogFeaturedData, setBlogFeaturedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "https://admin.omdacoffee.com/api/blogs"
        );
        setBlogFeaturedData(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };
    fetchItems();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = blogFeaturedData.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Fragment>
      <MetaTags>
        <title>{strings["blog"]}</title>
        <meta
          name="description"
          content="Blog page of zain react minimalist eCommerce template."
        />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{strings["home"]}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["blog"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="blog-area pt-100 pb-100 blog-no-sidebar">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="mr-20">
                  <div className="row">
                    {currentPosts.map((singlePost) => (
                      <BlogPostsNoSidebar
                        singlePost={singlePost}
                        key={singlePost.id}
                      />
                    ))}
                  </div>
                  <BlogPagination
                    currentPage={currentPage}
                    postsPerPage={postsPerPage}
                    totalPosts={blogFeaturedData.length}
                    onPageChange={handlePageChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

BlogNoSidebar.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(BlogNoSidebar);
