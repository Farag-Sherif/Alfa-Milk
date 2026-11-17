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

  // Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ø£ÙˆØ²Ø§Ù†
  let parsedVariations = [];
  try {
    if (product?.variations) {
      parsedVariations = typeof product.variations === 'string' ? JSON.parse(product.variations) : product.variations;
    }
  } catch (error) {}

  const hasVariations = parsedVariations && parsedVariations.length > 0;
  
  // Ù„Ùˆ ÙÙŠ Ø£ÙˆØ²Ø§Ù†ØŒ Ø®Ø¯ Ø³Ø¹Ø± Ø£ÙˆÙ„ ÙˆØ²Ù†ØŒ Ù„Ùˆ Ù…ÙÙŠØ´ Ø®Ø¯ Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ø£Ø³Ø§Ø³ÙŠ Ù„Ù„Ù…Ù†ØªØ¬
  const displayPrice = hasVariations ? parseFloat(parsedVariations[0].price) : parseFloat(product?.price || 0);

  // Ø­Ø³Ø§Ø¨ Ø§Ù„Ø®ØµÙˆÙ…Ø§Øª
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
              <img loading="lazy" decoding="async" className="default-img" src={process.env.PUBLIC_URL + product.image_path} alt=""  onError={(e) => { if (window.handleImageError) window.handleImageError(e); else { e.target.onerror = null; e.target.src = "/deal.png"; } }} onLoad={(e) => { if (window.handleImageSuccess) window.handleImageSuccess(e); }} />
              {product.image && product.image.length > 1 && (
                <img loading="lazy" decoding="async" className="hover-img" src={process.env.PUBLIC_URL + product.image[1]} alt=""  onError={(e) => { if (window.handleImageError) window.handleImageError(e); else { e.target.onerror = null; e.target.src = "/deal.png"; } }} onLoad={(e) => { if (window.handleImageSuccess) window.handleImageSuccess(e); }} />
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
                /* Ø§Ù„Ø­Ù„ Ø§Ù„Ø³Ø­Ø±ÙŠ: Ù„Ùˆ Ø§Ù„Ù…Ù†ØªØ¬ Ù…ØªØ¹Ø¯Ø¯ Ø§Ù„Ø£ÙˆØ²Ø§Ù†ØŒ Ø§Ù„Ø²Ø±Ø§Ø± ÙŠØ­ÙˆÙ„Ùƒ Ù„ØµÙØ­Ø© Ø§Ù„Ù…Ù†ØªØ¬ ØªØ®ØªØ§Ø± Ø§Ù„ÙˆØ²Ù† */
                <Link to={`${process.env.PUBLIC_URL}/product/${product.slug}`} title={strings ? strings["select_option"] : "Select Option"}>
                  <i className="fa fa-cog"></i>
                </Link>
              ) : product.is_available || (product.stock && product.stock > 0) ? (
                /* Ù„Ùˆ Ø§Ù„Ù…Ù†ØªØ¬ Ø³Ø¹Ø± Ø¹Ø§Ø¯ÙŠ (ÙˆØ²Ù† ÙˆØ§Ø­Ø¯)ØŒ ÙŠØ¶ÙŠÙ Ù„Ù„Ø³Ù„Ø© Ù…Ø¨Ø§Ø´Ø±Ø© */
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