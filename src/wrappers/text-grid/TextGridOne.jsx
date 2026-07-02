import React from "react";
import { multilanguage } from "redux-multilanguage";

// !DEL
const TextGridOne = ({
  spaceBottomClass,
  allData,
  currentLanguageCode,
  strings,
}) => {
  return (
    <div
      className={`about-mission-area ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-4">
            <div className={`single-mission mb-30`}>
              <h3>{strings["our_vision"]}</h3>
              <p>
                {currentLanguageCode !== "en"
                  ? allData?.vision.en
                  : allData?.vision.ar}
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-4">
            <div className={`single-mission mb-30`}>
              <h3>{strings["our_mission"]}</h3>
              <p>
                {currentLanguageCode !== "en"
                  ? allData?.goal.en
                  : allData?.goal.ar}
              </p>
            </div>
          </div>

          <div className="col-lg-4 col-md-4">
            <div className={`single-mission mb-30`}>
              <h3>{strings["our_goal"]}</h3>
              <p>
                {currentLanguageCode !== "en"
                  ? allData?.mission.en
                  : allData?.mission.ar}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default multilanguage(TextGridOne);
