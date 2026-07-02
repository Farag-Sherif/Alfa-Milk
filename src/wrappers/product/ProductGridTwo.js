import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import ProductGridSingleTwo from "../../components/product/ProductGridSingleTwo";
import { getProducts } from "../../helpers/product";
import { addToCart } from "../../redux/actions/cartActions";
import { addToCompare } from "../../redux/actions/compareActions";
import { addToWishlist } from "../../redux/actions/wishlistActions";

const ProductGridTwo = ({
  products,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItems,
  wishlistItems,
  compareItems,
  sliderClassName,
  spaceBottomClass,
  colorClass,
  titlePriceClass,
}) => {
  return (
    <Fragment>
      {products.map((product) => {
        return (
          <ProductGridSingleTwo
            sliderClassName={sliderClassName}
            spaceBottomClass={spaceBottomClass}
            colorClass={colorClass}
            product={product}
            currency={currency}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            addToCompare={addToCompare}
            cartItem={
              cartItems.filter((cartItem) => cartItem.slug === product.slug)[0]
            }
            wishlistItem={
              wishlistItems.filter(
                (wishlistItem) => wishlistItem.id === product.id,
              )[0]
            }
            compareItem={
              compareItems.filter(
                (compareItem) => compareItem.id === product.id,
              )[0]
            }
            key={product.id}
            titlePriceClass={titlePriceClass}
          />
        );
      })}
    </Fragment>
  );
};

ProductGridTwo.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItems: PropTypes.array,
  compareItems: PropTypes.array,
  currency: PropTypes.object,
  products: PropTypes.array,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  wishlistItems: PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
  return {
    products: getProducts(
      state.productData.products,
      ownProps.category,
      ownProps.type,
      ownProps.limit,
    ),
    currency: state.currencyData,
    cartItems: state.cartData,
    wishlistItems: state.wishlistData,
    compareItems: state.compareData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // ✅ الـ signature الصح: (item, related, addToast, quantityCount)
    addToCart: (item, related, addToast, quantityCount) => {
      dispatch(addToCart(item, related, addToast, quantityCount));
    },
    addToWishlist: (item, addToast) => {
      dispatch(addToWishlist(item, addToast));
    },
    addToCompare: (item, addToast) => {
      dispatch(addToCompare(item, addToast));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductGridTwo);
