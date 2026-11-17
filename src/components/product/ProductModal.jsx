import React, { Fragment, useState } from "react";
import { Modal } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
import axiosInstance from "../../api/api";

function ProductModal({
  product,
  currentLanguageCode,
  addToCart,
  show,
  onHide,
  strings,
}) {
  const [isFav, setIsFav] = useState(
    product.is_favorite || getIsFavoriteFromLocalStorage(product)
  );
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  
  const [quantityCount, setQuantityCount] = useState(1);

  // --- Ø¯Ø§Ù„Ø© Ø§Ù„ØªØ±Ø¬Ù…Ø© Ø§Ù„ÙÙˆØ±ÙŠØ© Ù„Ù„Ø£ÙˆØ²Ø§Ù† ---
  const formatDisplayWeight = (weightStr) => {
    if (!weightStr) return '';
    if (currentLanguageCode === 'ar') return weightStr; // Ù„Ùˆ Ø¹Ø±Ø¨ÙŠØŒ Ø§Ø¹Ø±Ø¶Ù‡ Ø²ÙŠ Ù…Ø§ Ù‡Ùˆ
    
    // Ù„Ùˆ Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠØŒ ØªØ±Ø¬Ù… Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ù„Ù€ Ø¥Ù†Ø¬Ù„ÙŠØ²ÙŠ
    return weightStr
      .toString()
      .replace(/ÙƒØ¬Ù…/g, 'kg')
      .replace(/ÙƒÙŠÙ„Ùˆ/g, 'kg')
      .replace(/Ø¬Ù…/g, 'gm')
      .replace(/Ø¬Ø±Ø§Ù…/g, 'gm');
  };

  // --- Ù…Ø¹Ø§Ù„Ø¬Ø© Ø§Ù„Ø£ÙˆØ²Ø§Ù† Ø§Ù„Ø¯ÙŠÙ†Ø§Ù…ÙŠÙƒÙŠØ© Ø¯Ø§Ø®Ù„ Ø§Ù„Ù…ÙˆØ¯Ø§Ù„ ---
  let parsedVariations = [];
  try {
    if (product?.variations) {
      parsedVariations = typeof product.variations === 'string' ? JSON.parse(product.variations) : product.variations;
    }
  } catch (error) {
    console.error("Error parsing variations in modal:", error);
  }

  const [selectedVariation, setSelectedVariation] = useState(
    parsedVariations.length > 0 ? parsedVariations[0] : null
  );

  // Ø­Ø³Ø§Ø¨ Ø§Ù„Ø³Ø¹Ø± ÙˆØ§Ù„ÙˆØ²Ù† Ø§Ù„Ù…Ø¹Ø±ÙˆØ¶ Ø­Ø§Ù„ÙŠØ§Ù‹ Ø¨Ù†Ø§Ø¡Ù‹ Ø¹Ù„Ù‰ Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„Ø¹Ù…ÙŠÙ„
  const currentBasePrice = selectedVariation ? parseFloat(selectedVariation.price) : parseFloat(product?.price || 0);
  const currentDiscountPrice = product?.discount > 0 ? currentBasePrice - (currentBasePrice * product?.discount) / 100 : currentBasePrice;
  const currentWeight = selectedVariation ? selectedVariation.weight : (currentLanguageCode === "ar" ? product.translations[0]?.weight : product.translations[1]?.weight);

  // ØªØ¬Ù‡ÙŠØ² Ø§Ù„Ù…Ù†ØªØ¬ Ù„Ù„Ù€ Cart
  const productForCart = {
    ...product,
    price: currentBasePrice,
    weight: currentWeight,
    size: currentWeight,
    selectedProductSize: currentWeight,
    selectedVariation: selectedVariation,
    cartItemId: selectedVariation ? `${product.id}-${selectedVariation.weight}` : product.id
  };

  const handleWishlistToggle = () => {
    if (isFav) {
      dispatch(deleteFromWishlist(product, addToast));
      setIsFav((prev) => !prev);
    } else {
      dispatch(addToWishlist(product, addToast));
      setIsFav((prev) => !prev);
    }
  };

 const handleAddToCartClick = async () => {
   try {
     const res = await axiosInstance.get(`/item/${product.slug}`);
     console.log(res.data)
     const related = res.data.related || [];

     addToCart(productForCart, related, addToast, quantityCount);
   } catch (error) {
     console.error(error);
     addToCart(productForCart, [], addToast, quantityCount);
   }
 };

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={onHide}
        className="product-quickview-modal-wrapper"
      >
        <Modal.Header closeButton></Modal.Header>

        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
              <div className="product-large-image-wrapper">
                <div className="single-image">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={product.image_path}
                    className="img-fluid"
                    alt="img"
                   onError={(e) => { if (window.handleImageError) window.handleImageError(e); else { e.target.onerror = null; e.target.src = "/deal.png"; } }} onLoad={(e) => { if (window.handleImageSuccess) window.handleImageSuccess(e); }} />
                </div>
              </div>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="product-details-content quickview-content">
                <h2>
                  {currentLanguageCode === "ar"
                    ? product.translations[0]?.name
                    : product.translations[1]?.name}
                </h2>
                
                {/* Ø§Ù„Ø³Ø¹Ø± Ø§Ù„Ù…Ø­Ø¯Ø« Ø¯ÙŠÙ†Ø§Ù…ÙŠÙƒÙŠØ§Ù‹ */}
                <div className="product-details-price">
                  {product?.discount > 0 ? (
                    <>
                      <span className="new" style={{ direction: currentLanguageCode === "en" ? "ltr" : "rtl" }}>
                        {currentDiscountPrice.toFixed(2)}
                      </span>{" "}
                      {strings ? strings["EG"] : "EG"}
                      <span className="old" style={{ textDecoration: "line-through", direction: currentLanguageCode === "en" ? "ltr" : "rtl", marginLeft: "5px" }}>
                        {currentBasePrice.toFixed(2)} {strings ? strings["EG"] : "EG"}
                      </span>
                    </>
                  ) : (
                    <span style={{ direction: currentLanguageCode === "en" ? "ltr" : "rtl", color: "#731b26", fontWeight: "bold" }}>
                      {currentBasePrice.toFixed(2)} {strings ? strings["EG"] : "EG"}
                    </span>
                  )}
                </div>

                {/* Ø¹Ø±Ø¶ ØªØ§Ø¨Ø§Øª Ø§Ø®ØªÙŠØ§Ø± Ø§Ù„ÙˆØ²Ù† Ø¨Ø¯Ù„Ø§Ù‹ Ù…Ù† Ø§Ù„Ù‚Ø§Ø¦Ù…Ø© Ø§Ù„Ù…Ù†Ø³Ø¯Ù„Ø© */}
                {parsedVariations.length > 0 && (
                  <div className="pro-details-size-color" style={{ marginBottom: "25px", marginTop: "15px" }}>
                    <div className="pro-details-size">
                      {/* Ø¹Ù†ÙˆØ§Ù† ÙŠØ¸Ù‡Ø± Ø§Ù„ÙˆØ²Ù† Ø§Ù„Ù…Ø®ØªØ§Ø± Ø­Ø§Ù„ÙŠØ§Ù‹ Ù…ØªØ±Ø¬Ù… */}
                      <span style={{ fontWeight: "bold", display: "block", marginBottom: "15px", color: "#333", fontSize: "16px" }}>
                        {currentLanguageCode === "ar" ? "Ø§Ù„ÙˆØ²Ù†:" : "Weight:"} {formatDisplayWeight(selectedVariation?.weight || '')}
                      </span>
                      
                      {/* Ø­Ø§ÙˆÙŠØ© Ø§Ù„ØªØ§Ø¨Ø§Øª */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", direction: currentLanguageCode === "en" ? "ltr" : "rtl" }}>
                        {parsedVariations.map((varItem, index) => {
                          const isSelected = selectedVariation?.weight === varItem.weight;
                          return (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedVariation(varItem);
                              }}
                              style={{
                                padding: "8px 24px",
                                borderRadius: "50px", 
                                border: isSelected ? "2px solid #731b26" : "1px solid #ddd",
                                backgroundColor: isSelected ? "#731b26" : "#fff",
                                color: isSelected ? "#fff" : "#555",
                                fontWeight: "bold",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                outline: "none",
                                fontSize: "14px",
                                direction: "ltr"
                              }}
                            >
                              {/* Ø¹Ø±Ø¶ Ø§Ù„ÙƒÙ„Ù…Ø© Ù…ØªØ±Ø¬Ù…Ø© Ø¬ÙˆÙ‡ Ø§Ù„Ø²Ø±Ø§Ø± */}
                              {formatDisplayWeight(varItem.weight)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                <div className="pro-details-list mt-3">
                  <p>
                    <span style={{ fontWeight: "bold" }}>{strings ? strings["weight"] : "Weight"}: </span>
                    {formatDisplayWeight(currentWeight)}
                  </p>
                </div>

                <div className="pro-details-list">
                  <p>
                    {currentLanguageCode === "ar"
                      ? product.translations[0]?.description
                      : product.translations[1]?.description}
                  </p>
                </div>

                {product.is_available && (
                  <div className="pro-details-quality">
                    <div className="cart-plus-minus">
                      <button
                        type="button"
                        onClick={() => setQuantityCount(quantityCount - 1)}
                        disabled={quantityCount === 1}
                        className="dec qtybutton"
                      >
                        -
                      </button>
                      <input
                        className="cart-plus-minus-box"
                        type="text"
                        value={quantityCount}
                        readOnly
                      />
                      <button
                        type="button"
                        onClick={() => setQuantityCount(quantityCount + 1)}
                        className="inc qtybutton"
                      >
                        +
                      </button>
                    </div>
                    <div className="pro-details-cart btn-hover">
                      {product.is_available ? (
                        <button
                          onClick={handleAddToCartClick}
                          disabled={!product.is_available}
                        >
                          {strings ? strings["addToCart"] : "Add to Cart"}
                        </button>
                      ) : (
                        <button disabled>{strings ? strings["outOfStock"] : "Out of Stock"}</button>
                      )}
                    </div>
                    <div className="pro-details-wishlist">
                      <button
                        className={!isFav ? "active" : ""}
                        title={!isFav ? "Added to wishlist" : "Add to wishlist"}
                        onClick={() => handleWishlistToggle()}
                      >
                        <i
                          className={isFav ? "fa fa-heart" : "fa fa-heart-o"}
                          style={{
                            color: isFav ? "red" : "inherit",
                          }}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </Fragment>
  );
}

const mapStateToProps = (state) => {
  return {
    cartitems: state.cartData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, related, addToast, quantityCount) => {
      dispatch(addToCart(item, related, addToast, quantityCount));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(multilanguage(ProductModal));