import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const BlogPostsNoSidebar = ({ currentLanguageCode, singlePost, strings }) => {
  return (
    <Fragment>
      <div className="col-lg-4 col-md-6 col-sm-12">
        <div className="blog-wrap-2 mb-30">
          <div className="blog-img-2">
            <Link to={`/post?postId=${singlePost.id}`}>
              <img src={singlePost.image_path} alt="" />
            </Link>
          </div>
          <div className="blog-content-2">
            <div className="blog-meta-2">
              <ul>
                <li>{singlePost.created_at}</li>
              </ul>
            </div>
            <h4>
              <Link to={`/post?postId=${singlePost.id}`}>
                {currentLanguageCode === "ar"
                  ? singlePost.translations[0].title
                  : singlePost.translations[1].title}
              </Link>
            </h4>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  currentLanguageCode === "ar"
                    ? singlePost.translations[0].content
                        .split(" ")
                        .slice(0, 10)
                        .join(" ")
                    : singlePost.translations[1].content
                        .split(" ")
                        .slice(0, 2)
                        .join(" "),
              }}
            >
            </div>
            <div className="blog-share-comment">
              <div className="blog-btn-2">
                <Link to={`/post?postId=${singlePost.id}`}>
                  {strings["read_more"]}
                </Link>
              </div>
              <div className="blog-share">
                <span>{strings["share"]} :</span>
                <div className="share-social">
                  <ul>
                    <li>
                      <a className="facebook" href="//facebook.com">
                        <i className="fa fa-facebook" />
                      </a>
                    </li>
                    <li>
                      <a className="twitter" href="//twitter.com">
                        <i className="fa fa-twitter" />
                      </a>
                    </li>
                    <li>
                      <a className="instagram" href="//instagram.com">
                        <i className="fa fa-instagram" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default multilanguage(BlogPostsNoSidebar);
