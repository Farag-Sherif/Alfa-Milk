import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";

const BlogPost = ({ data, currentLanguageCode, strings }) => {
  const nextId = data?.next?.split("/").pop();
  const prevId = data?.previous?.split("/").pop();

  return (
    <Fragment>
      <div className="blog-details-top">
        <div className="blog-details-img border">
          <img
            className="img-fluid w-75"
            src={data?.item?.image_path}
            alt={
              currentLanguageCode === "ar"
                ? data?.item?.translations[0].title
                : data?.item?.translations[1].title
            }
          />
        </div>
        <div
          className={`blog-details-content ${
            currentLanguageCode === "ar" ? "text-right" : "text-left"
          }`}>
          <div className="blog-meta-2 mb-4">
            <ul>
              <li>{data?.item?.created_at}</li>
            </ul>
          </div>
          <h1>{data?.item?.title}</h1>
          <div
            className="my-3 text-dark"
            dangerouslySetInnerHTML={{
              __html:
                currentLanguageCode === "ar"
                  ? data?.item?.translations[0].content
                  : data?.item?.translations[1].content,
            }}></div>
        </div>
      </div>
      <div className="next-previous-post">
        <Link to={`/post?postId=${prevId}`}>
          <i className="fa fa-angle-left" /> {strings["next_post"]}
        </Link>
        <Link to={`/post?postId=${nextId}`}>
          {strings["previous_post"]} <i className="fa fa-angle-right" />
        </Link>
      </div>
    </Fragment>
  );
};

BlogPost.propTypes = {
  data: PropTypes.object,
};

export default multilanguage(BlogPost);
