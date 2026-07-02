import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

const HeroSliderFive = ({ spaceLeftClass, spaceRightClass }) => {
  return (
    <div
      className={`slider-area ${spaceLeftClass || ""} ${spaceRightClass || ""}`}
      style={{
        background: "linear-gradient(135deg, #1A3C6B 0%, #009B4D 100%)",
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden"
      }}
      dir="rtl"
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6">
            <div className="slider-content-5 slider-animated-1 text-right" style={{ zIndex: 2, position: 'relative' }}>
              <h1 className="animated" style={{ color: "#ffffff", fontSize: "60px", fontWeight: "bold", marginBottom: "20px", fontFamily: "'Cairo', sans-serif" }}>
                ألفا ميلك
              </h1>
              <h2 className="animated" style={{ color: "#e0f7e9", fontSize: "30px", marginBottom: "30px", fontFamily: "'Cairo', sans-serif", fontWeight: "600" }}>
                طعم الطبيعة الأصلي في كل ملعقة
              </h2>
              <p className="animated" style={{ color: "#ffffff", fontSize: "18px", marginBottom: "40px", fontFamily: "'Cairo', sans-serif", opacity: 0.9, lineHeight: "1.8" }}>
                نقدم لكم أجود أنواع الزبادي الطبيعي كامل الدسم ومنتجات الألبان الطازجة، مصنعة بأعلى معايير الجودة لضمان صحتك وصحة عائلتك.
              </p>
              <div className="slider-btn-5 btn-hover">
                <Link
                  className="animated"
                  to="/shop"
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#1A3C6B",
                    padding: "15px 40px",
                    borderRadius: "30px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "'Cairo', sans-serif",
                    display: "inline-block",
                    textDecoration: "none",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseOver={(e) => { e.target.style.backgroundColor = '#f0f0f0'; e.target.style.transform = 'translateY(-2px)'; }}
                  onMouseOut={(e) => { e.target.style.backgroundColor = '#ffffff'; e.target.style.transform = 'translateY(0)'; }}
                >
                  تسوق منتجاتنا
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 d-none d-md-block">
            <div className="slider-img-5 slider-animated-1" style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "450px",
                height: "450px",
                backgroundColor: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: -1,
                boxShadow: "0 0 80px rgba(0, 155, 77, 0.4)",
                border: "2px solid rgba(255,255,255,0.2)"
              }}></div>
              <div style={{
                 fontSize: "180px", 
                 textAlign: "center",
                 color: "white",
                 textShadow: "0 20px 40px rgba(0,0,0,0.3)",
                 animation: "float 6s ease-in-out infinite"
              }}>
                 🥛
              </div>
              <style>
                {`
                  @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                  }
                `}
              </style>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div style={{
        position: "absolute",
        top: "-10%",
        right: "-10%",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "rgba(0, 155, 77, 0.5)",
        filter: "blur(80px)",
        zIndex: 1
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "-20%",
        left: "-10%",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "rgba(26, 60, 107, 0.8)",
        filter: "blur(100px)",
        zIndex: 1
      }}></div>
    </div>
  );
};

HeroSliderFive.propTypes = {
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
};

export default HeroSliderFive;
