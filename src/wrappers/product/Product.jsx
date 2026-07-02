import React, { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
import axiosInstance from "../../api/api";

const Product = ({ product, currentLanguageCode, strings }) => {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const [isFav, setIsFav] = useState(
    product.is_favorite || getIsFavoriteFromLocalStorage(product),
  );

  // --- Parse Variations ---
  let parsedVariations = [];
  try {
    if (product?.variations) {
      parsedVariations =
        typeof product.variations === "string"
          ? JSON.parse(product.variations)
          : product.variations || [];
    }
  } catch (error) {
    console.error("Failed to parse variations:", error);
  }

  const hasVariations = parsedVariations.length > 0;

  // Display price logic
  const displayPrice = hasVariations
    ? parseFloat(parsedVariations[0].price)
    : parseFloat(product?.price || 0);

  // Discount calculation
  const getDiscountPrice = (price, discount) => {
    if (!price || !discount || discount <= 0) return null;
    return price - (price * discount) / 100;
  };

  const discountedPrice =
    product?.discount > 0
      ? getDiscountPrice(displayPrice, product.discount)
      : null;

  // Handle Add to Cart with Related Products
  const handleAddToCartClick = async () => {
    if (hasVariations) {
      // If product has variations, redirect to product page instead
      return;
    }

    try {
      const res = await axiosInstance.get(`/item/${product.slug}`);
      const related = res.data.related || [];

      console.log("Related products fetched:", related);

      // Pass the product + related data to cart action
      dispatch(addToCart(product, related, addToast, 1));
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      // Fallback: add without related data
      dispatch(addToCart(product, [], addToast, 1));
    }
  };

  const handleWishlistToggle = () => {
    if (isFav) {
      dispatch(deleteFromWishlist(product, addToast));
    } else {
      dispatch(addToWishlist(product, addToast));
    }
    setIsFav((prev) => !prev);
  };

  return (
    <div
      className="col-xl-3 col-md-6 col-lg-4 col-sm-6 col-12"
      style={{
        direction: currentLanguageCode === "en" ? "ltr" : "rtl",
        textAlign: "start",
      }}>
      <div className="product-wrap-2 mb-25">
        <div className="product-img">
          <Link to={`${process.env.PUBLIC_URL}/product/${product.slug}`}>
            <img
              className="default-img img-fluid"
              src={product.image_path}
              alt={product.name}
              loading="lazy"
            />
            {product.image && product.image.length > 1 && (
              <img
                className="hover-img img-fluid"
                src={product.image_path}
                alt={product.name}
                loading="lazy"
              />
            )}
          </Link>

          {product.discount > 0 && (
            <div className="product-img-badges">
              <span className="pink" style={{ color: "#FFF" }}>
                -{product.discount}%
              </span>
            </div>
          )}

          <div className="product-action-2">
            {hasVariations ? (
              // Product has variations → Go to product page to choose weight
              <Link
                to={`${process.env.PUBLIC_URL}/product/${product.slug}`}
                title={strings?.select_option || "Select Option"}
                className="add-to-cart-link"
                style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
                  lineHeight: "40px",
                  textAlign: "center",
                  backgroundColor: "#a749ff",
                  color: "#fff",
                  borderRadius: "50px",
                }}>
                <i className="fa fa-cog"></i>
              </Link>
            ) : product.is_available ? (
              // Single variant + available → Add to cart directly
              <button onClick={handleAddToCartClick} title="Add to cart">
                <i className="fa fa-shopping-cart"></i>
              </button>
            ) : (
              // Out of stock
              <button disabled className="active" title="Out of stock">
                <i className="fa fa-shopping-cart"></i>
              </button>
            )}

            {/* Wishlist Button */}
            <button
              className={isFav ? "active" : ""}
              onClick={handleWishlistToggle}
              title={isFav ? "Remove from wishlist" : "Add to wishlist"}>
              <i className={isFav ? "fa fa-heart" : "fa fa-heart-o"} />
            </button>
          </div>
        </div>

        <div className="product-content-2">
          <div className="title-price-wrap-2">
            <h3>
              <Link to={`${process.env.PUBLIC_URL}/product/${product.slug}`}>
                {currentLanguageCode === "ar" && product.translations?.[0]
                  ? product.translations[0].name
                  : product.translations?.[1]?.name || product.name}
              </Link>
            </h3>

            <div className="product-details-price">
              {discountedPrice !== null ? (
                <>
                  <span
                    className="new"
                    style={{
                      direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                      color: "red",
                    }}>
                    {discountedPrice.toFixed(2)}{" "}
                  </span>
                  <span>{strings?.EG || "EG"}</span>

                  <span
                    className="old"
                    style={{
                      direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                      textDecoration: "line-through",
                      marginLeft: "5px",
                    }}>
                    {displayPrice.toFixed(2)} {strings?.EG || "EG"}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                  }}>
                  {displayPrice.toFixed(2)} {strings?.EG || "EG"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Optional: if you still want to use mapDispatchToProps
const mapDispatchToProps = (dispatch) => ({
  addToCart: (item, related, addToast, quantity) =>
    dispatch(addToCart(item, related, addToast, quantity)),
  addToWishlist: (item, addToast) => dispatch(addToWishlist(item, addToast)),
});

export default connect(null, mapDispatchToProps)(multilanguage(Product));
