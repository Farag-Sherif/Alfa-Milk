import PropTypes from "prop-types";
import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import ProductModal from "./ProductModal";

const ProductGridSingleTwo = ({
  product,
  currency,
  addToCart,
  addToWishlist,
  addToCompare,
  cartItem,
  wishlistItem,
  compareItem,
  sliderClassName,
  spaceBottomClass,
  colorClass,
  titlePriceClass,
  strings, 
  currentLanguageCode,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const { addToast } = useToasts();

  // قراءة الأوزان
  let parsedVariations = [];
  try {
    if (product?.variations) {
      parsedVariations = typeof product.variations === 'string' ? JSON.parse(product.variations) : product.variations;
    }
  } catch (error) {}

  const hasVariations = parsedVariations && parsedVariations.length > 0;
  
  // لو في أوزان، خد سعر أول وزن، لو مفيش خد السعر الأساسي للمنتج
  const displayPrice = hasVariations ? parseFloat(parsedVariations[0].price) : parseFloat(product?.price || 0);

  // حساب الخصومات
  const getDiscountPrice = (price, discount) => {
    if (!price || !discount) return price;
    return price - (price * discount) / 100;
  };

  const discountedPrice = product?.discount > 0 ? getDiscountPrice(displayPrice, product?.discount) : null;
  const finalProductPrice = +(displayPrice * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = discountedPrice !== null ? +(discountedPrice * currency.currencyRate).toFixed(2) : null;

  return (
    <Fragment>
      <div className={`col-xl-3 col-md-6 col-lg-4 col-sm-6 ${sliderClassName ? sliderClassName : ""}`}>
        <div className={`product-wrap-2 ${spaceBottomClass ? spaceBottomClass : ""} ${colorClass ? colorClass : ""} `}>
          
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
              <img className="default-img" src={process.env.PUBLIC_URL + product.image_path} alt="" />
              {product.image && product.image.length > 1 && (
                <img className="hover-img" src={process.env.PUBLIC_URL + product.image[1]} alt="" />
              )}
            </Link>
            
            {product.discount || product.new ? (
              <div className="product-img-badges">
                {product.discount ? <span className="pink" style={{ color: "#FFF" }}>-{product.discount}%</span> : ""}
                {product.new ? <span className="purple">New</span> : ""}
              </div>
            ) : ""}

            <div className="product-action-2">
              {product.affiliateLink ? (
                <a href={product.affiliateLink} rel="noopener noreferrer" target="_blank" title="Buy now">
                  <i className="fa fa-shopping-cart"></i>
                </a>
              ) : hasVariations ? (
                /* الحل السحري: لو المنتج متعدد الأوزان، الزرار يحولك لصفحة المنتج تختار الوزن */
                <Link to={`${process.env.PUBLIC_URL}/product/${product.slug}`} title={strings ? strings["select_option"] : "Select Option"}>
                  <i className="fa fa-cog"></i>
                </Link>
              ) : product.is_available || (product.stock && product.stock > 0) ? (
                /* لو المنتج سعر عادي (وزن واحد)، يضيف للسلة مباشرة */
                <button
                  onClick={() => addToCart(product, addToast, 1)}
                  className={cartItem !== undefined && cartItem.quantity > 0 ? "active" : ""}
                  disabled={cartItem !== undefined && cartItem.quantity > 0}
                  title={cartItem !== undefined ? "Added to cart" : "Add to cart"}
                >
                  <i className="fa fa-shopping-cart"></i>
                </button>
              ) : (
                <button disabled className="active" title="Out of stock">
                  <i className="fa fa-shopping-cart"></i>
                </button>
              )}

              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="fa fa-eye"></i>
              </button>

              {addToCompare && (
                  <button
                    className={compareItem !== undefined ? "active" : ""}
                    disabled={compareItem !== undefined}
                    title={compareItem !== undefined ? "Added to compare" : "Add to compare"}
                    onClick={() => addToCompare(product, addToast)}
                  >
                    <i className="fa fa-retweet"></i>
                  </button>
              )}
            </div>
          </div>
          
          <div className="product-content-2">
            <div className={`title-price-wrap-2 ${titlePriceClass ? titlePriceClass : ""}`}>
              <h3>
                <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                  {currentLanguageCode === "ar" && product.translations ? product.translations[0]?.name : product.name}
                </Link>
              </h3>
              <div className="price-2">
                {finalDiscountedPrice !== null ? (
                  <Fragment>
                    <span style={{ color: "#731b26", fontWeight: "bold" }}>
                      {finalDiscountedPrice} {strings ? strings["EG"] : "EG"}
                    </span>{" "}
                    <span className="old">
                      {finalProductPrice} {strings ? strings["EG"] : "EG"}
                    </span>
                  </Fragment>
                ) : (
                  <span style={{ color: "#731b26", fontWeight: "bold" }}>
                    {finalProductPrice} {strings ? strings["EG"] : "EG"} 
                  </span>
                )}
              </div>
            </div>
            <div className="pro-wishlist-2">
              <button
                className={wishlistItem !== undefined ? "active" : ""}
                disabled={wishlistItem !== undefined}
                title={wishlistItem !== undefined ? "Added to wishlist" : "Add to wishlist"}
                onClick={() => addToWishlist(product, addToast)}
              >
                <i className="fa fa-heart-o" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedprice={discountedPrice}
        finalproductprice={finalProductPrice}
        finaldiscountedprice={finalDiscountedPrice}
        cartitem={cartItem}
        wishlistitem={wishlistItem}
        compareitem={compareItem}
        addToCart={addToCart}
        addtowishlist={addToWishlist}
        addtocompare={addToCompare}
        addtoast={addToast}
        strings={strings || {}}
        currentLanguageCode={currentLanguageCode || "en"}
      />
    </Fragment>
  );
};

ProductGridSingleTwo.propTypes = {
  addToCart: PropTypes.func,
  addToCompare: PropTypes.func,
  addToWishlist: PropTypes.func,
  cartItem: PropTypes.object,
  compareItem: PropTypes.object,
  currency: PropTypes.object,
  product: PropTypes.object,
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  wishlistItem: PropTypes.object,
};

export default ProductGridSingleTwo;