import React from "react";
// import Swiper from "react-id-swiper";
import { multilanguage } from "redux-multilanguage";
import Product from "./Product";

const RelatedProductSlider = ({ spaceBottomClass, category, strings }) => {
  // const settings = {
  //   slidesPerView: 4, // Default number of slides per view
  //   spaceBetween: 30, // Space between slides in px
  //   loop: true, // Enables looping of slides
  //   breakpoints: {
  //     320: {
  //       // when window width is >= 320px
  //       slidesPerView: 1,
  //       spaceBetween: 20,
  //     },
  //     768: {
  //       // when window width is >= 768px
  //       slidesPerView: 2,
  //       spaceBetween: 30,
  //     },
  //     1024: {
  //       // when window width is >= 1024px
  //       slidesPerView: 3,
  //       spaceBetween: 40,
  //     },
  //   },
  // };
  return (
    <div
      className={`related-product-area ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <div className={`section-title text-center mb-50`}>
          <h2>{strings["Related"]}</h2>
        </div>

        <div className="row">
            {category.map((product) => (
              <Product product={product} key={product.id} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default multilanguage(RelatedProductSlider);
