import React from "react";
import { connect } from "react-redux";
import ProductDescriptionInfo from "../../components/product/ProductDescriptionInfo";
import ProductImageFixed from "../../components/product/ProductImageFixed";
// !DEL
const ProductImageDescription = ({
  spaceTopClass,
  spaceBottomClass,
  product,
  related,
  icons,
  cartItems,
}) => {
  return (
    <div
      className={`shop-area ${spaceTopClass ? spaceTopClass : ""} ${
        spaceBottomClass ? spaceBottomClass : ""
      }`}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6">
            <ProductImageFixed product={product} />
          </div>
          <div className="col-lg-6 col-md-6">
            {/* product description info */}
            <ProductDescriptionInfo product={product} icons={icons} related={related} cartItems={cartItems} />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currency: state.currencyData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData,
  };
};

export default connect(mapStateToProps)(ProductImageDescription);
