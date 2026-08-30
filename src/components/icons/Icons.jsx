import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/api.js";
import { multilanguage } from "redux-multilanguage";

function Icons({ currentLanguageCode }) {
  const [icons, setIcons] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/icons")
      .then((res) => {
        setIcons(res.data || []);
      })
      .catch(() => setIcons([]));
  }, []);

  return (
    <>
      {icons.length > 0 ? (
        <div className="container my-4 mb-5">
          <div className="row row-cols-3 justify-content-center">
            {icons.map((icon, index) => (
              <>
                <div key={index} className="col">
                  <div className="text-center">
                    <img
                      src={icon?.icon_path || `https://alfamilk.test.do-go.net/images/${icon?.icon}`}
                      alt={
                        currentLanguageCode === "ar"
                          ? icon?.translations[0].name
                          : icon?.translations[1].name
                      }
                      className=" mb-2"
                      style={{ width: "50px", height: "50px" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/deal.png"; }}
                    />
                    <p style={{ marginTop: "10px", fontSize: "14px" }}>
                      {currentLanguageCode === "ar"
                        ? icon?.translations[0].name
                        : icon?.translations[1].name}
                    </p>
                  </div>
                </div>
              </>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

export default multilanguage(Icons);
