import React from "react";
import { multilanguage } from "redux-multilanguage";

const SectionTitleWithText = ({
  spaceTopClass,
  spaceBottomClass,
  strings,
  allData,
  currentLanguageCode,
}) => {
  return (
    <div
      className={`welcome-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <div className="welcome-content text-center">
          <h5>{strings["who_are_we"]}</h5>
          <h1>{strings["welcome_to_ajyal"]}</h1>
          <p>
            {currentLanguageCode !== "en"
              ? allData?.about_us.en
              : allData?.about_us.ar}
          </p>
        </div>
      </div>
    </div>
  );
};

export default multilanguage(SectionTitleWithText);
