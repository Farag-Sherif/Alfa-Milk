import PropTypes from "prop-types";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import { multilanguage } from "redux-multilanguage"; // 1. استدعاء مكتبة الترجمة

const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, strings, currentLanguageCode }) => {
  return (
    <div className={`description-review-area ${spaceBottomClass}`}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                {/* 2. استبدال الكلمة الثابتة بمتغير الترجمة */}
                <Nav.Link eventKey="productDescription">
                  {strings && strings["description"]
                    ? strings["description"]
                    : currentLanguageCode === "ar"
                      ? "الوصف"
                      : "Description"}
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane
                eventKey="productDescription"
                style={
                  currentLanguageCode === "ar"
                    ? { direction: "rtl", textAlign: "right" }
                    : { direction: "ltr", textAlign: "left" }
                }>
                {typeof productFullDesc === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: productFullDesc }} />
                ) : (
                  productFullDesc
                )}
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  strings: PropTypes.object,
};

// 3. تغليف المكون بمكتبة الترجمة
export default multilanguage(ProductDescriptionTab);