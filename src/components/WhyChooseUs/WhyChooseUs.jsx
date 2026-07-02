import React, { useEffect, useState } from "react";
import { multilanguage } from "redux-multilanguage";
import axiosInstance from "../../api/api";

// Helper: extract local path from full URL (e.g. "https://omdacoffee.com/shop?category=x" → "/shop?category=x")
const getLocalPath = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.pathname + parsed.search;
  } catch {
    return url || "/";
  }
};

const WhyChooseUs = ({ currentLanguageCode }) => {
  const isArabic = currentLanguageCode === "ar";
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await axiosInstance.get("/faqs");
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setFaqs(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const getTranslation = (translations) =>
    translations?.find((t) => t.locale === currentLanguageCode) ??
    translations?.[0];

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      style={{
        backgroundColor: "#fff",
        padding: "60px 20px",
        fontFamily: isArabic ? "'Cairo', sans-serif" : "'Poppins', sans-serif",
        textAlign: isArabic ? "right" : "left",
      }}>
      <div className="container">
        {loading && (
          <p style={{ color: "#999", textAlign: "center" }}>
            {isArabic ? "جاري التحميل..." : "Loading..."}
          </p>
        )}

        {error && (
          <p style={{ color: "#e74c3c", textAlign: "center" }}>
            {isArabic ? "حدث خطأ أثناء التحميل" : "Failed to load data"}
          </p>
        )}

        {!loading &&
          !error &&
          faqs.map((faq) => {
            const translation = getTranslation(faq.translations);

            return (
              <div key={faq.id} className="row align-items-start mb-5">
                {/* Side text */}
                <div className="col-lg-4 col-md-12 mb-4">
                  <span
                    style={{
                      fontFamily: "'Cairo', sans-serif",
                      fontWeight: "900",
                      fontSize: "22px",
                      color: "#c8a96e",
                      letterSpacing: "1px",
                      display: "block",
                      marginBottom: "12px",
                    }}>
                    {translation?.title}
                  </span>

                  <h2
                    style={{
                      fontSize: "26px",
                      fontWeight: "800",
                      color: "#1a1a1a",
                      lineHeight: "1.6",
                      marginBottom: "16px",
                    }}>
                    {translation?.content}
                  </h2>

                  <span
                    style={{
                      display: "block",
                      width: "60px",
                      height: "3px",
                      backgroundColor: "#c8a96e",
                      borderRadius: "2px",
                      marginTop: "20px",
                      marginRight: isArabic ? "0" : "auto",
                      marginLeft: isArabic ? "auto" : "0",
                    }}
                  />
                </div>

                {/* Features list */}
                <div className="col-lg-8 col-md-12">
                  <div className="row">
                    {faq.features.map((feature, index) => {
                      const featureText =
                        feature.translations?.find(
                          (t) => t.locale === currentLanguageCode,
                        )?.feature_text ?? feature.feature_text;

                      return (
                        <div className="col-12 mb-3" key={feature.id ?? index}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "16px",
                              backgroundColor: "#fdf6ee",
                              borderRadius: "12px",
                              padding: "16px 20px",
                              flexDirection: isArabic ? "row-reverse" : "row",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                              transition:
                                "transform 0.2s ease, box-shadow 0.2s ease",
                              cursor: "default",
                              borderRight: isArabic
                                ? "4px solid #c8a96e"
                                : "none",
                              borderLeft: !isArabic
                                ? "4px solid #c8a96e"
                                : "none",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = isArabic
                                ? "translateX(4px)"
                                : "translateX(-4px)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 16px rgba(200,169,110,0.25)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateX(0)";
                              e.currentTarget.style.boxShadow =
                                "0 2px 8px rgba(0,0,0,0.05)";
                            }}>
                            <div
                              style={{
                                minWidth: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                backgroundColor: "#c8a96e",
                                color: "#fff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "700",
                                fontSize: "15px",
                                flexShrink: 0,
                              }}>
                              { index + 1}
                            </div>

                            <div
                              style={{
                                textAlign: isArabic ? "right" : "left",
                              }}>
                              <span
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                  color: "#2b2b2b",
                                  display: "block",
                                }}>
                                {featureText}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default multilanguage(WhyChooseUs);
