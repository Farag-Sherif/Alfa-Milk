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
                      src={`https://admin.omdacoffee.com/ar/images/${icon?.icon}`}
                      alt={
                        currentLanguageCode === "ar"
                          ? icon?.translations[0].name
                          : icon?.translations[1].name
                      }
                      className=" mb-2"
                      style={{
                        objectFit: "cover",
                        width: "calc((100% - 20px) / 3)",
                        height: "85px",
                      }}
                    />
                    <p>
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
