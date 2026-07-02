import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import MetaTags from "react-meta-tags";
import { Link } from "react-router-dom";
import { multilanguage } from "redux-multilanguage";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
// !DEL
const NotFound = ({ location, strings }) => {
  const { pathname } = location;

  return (
    <Fragment>
      <MetaTags>
        <title>{strings["P404_PAGE_TITLE"]}</title>
        <meta name="description" content={strings["P404_META_DESCRIPTION"]} />
      </MetaTags>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>
        {strings["P404_HOME"]}
      </BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {strings["P404_PAGE_404"]}
      </BreadcrumbsItem>
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />
        <div className="error-area pt-40 pb-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-xl-7 col-lg-8 text-center">
                <div className="error">
                  <h1>{strings["P404_ERROR_TITLE"]}</h1>
                  <h2>{strings["P404_ERROR_SUBTITLE"]}</h2>
                  <p>{strings["P404_ERROR_MESSAGE"]}</p>
                  <Link to={process.env.PUBLIC_URL + "/"} className="error-btn">
                    {strings["P404_BACK_TO_HOME"]}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

NotFound.propTypes = {
  location: PropTypes.object,
};

export default multilanguage(NotFound);
