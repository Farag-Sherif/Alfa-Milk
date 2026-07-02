import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
import { addToCart } from "../../redux/actions/cartActions";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
import CheckoutModal from "./CheckoutModal";

const ProductDescriptionInfo = ({
  product,
  icons,
  related,
  addToCart,
  currentLanguageCode,
  strings,
}) => {
  const [quantityCount, setQuantityCount] = useState(1);
  const dispatch = useDispatch();
  const [isFav, setIsFav] = useState(
    product?.is_favorite || getIsFavoriteFromLocalStorage(product)
  );
  const { addToast } = useToasts();
  const [modalShow, setModalShow] = useState(false);

  // --- دالة الترجمة الفورية للأوزان ---
  const formatDisplayWeight = (weightStr) => {
    if (!weightStr) return '';
    if (currentLanguageCode === 'ar') return weightStr; // لو عربي، اعرضه زي ما هو من الداتا بيز

    // لو إنجليزي، ترجم الكلمات لـ إنجليزي
    return weightStr
      .toString()
      .replace(/كجم/g, 'kg')
      .replace(/كيلو/g, 'kg')
      .replace(/جم/g, 'gm')
      .replace(/جرام/g, 'gm');
  };

  // --- معالجة الأوزان الديناميكية ---
  let parsedVariations = [];
  try {
    if (product?.variations) {
      parsedVariations = typeof product.variations === 'string' ? JSON.parse(product.variations) : product.variations;
    }
  } catch (error) {
    console.error("Error parsing variations:", error);
  }

  // تعيين الوزن الافتراضي (أول وزن في القائمة لو موجود)
  const [selectedVariation, setSelectedVariation] = useState(
    parsedVariations.length > 0 ? parsedVariations[0] : null
  );

  // حساب السعر والوزن المعروض حالياً بناءً على اختيار العميل
  const currentBasePrice = selectedVariation ? parseFloat(selectedVariation.price) : parseFloat(product?.price || 0);
  const currentDiscountPrice = product?.discount > 0 ? currentBasePrice - (currentBasePrice * product?.discount) / 100 : currentBasePrice;
  const currentWeight = selectedVariation ? selectedVariation.weight : (currentLanguageCode === "ar" ? product.translations[0]?.weight : product.translations[1]?.weight);

  // تجهيز المنتج بكل بيانات الوزن الجديد عشان يتبعت للسلة صح (بياخد الوزن الأصلي من غير ترجمة عشان الباك إند)
  const productForCart = {
    ...product,
    price: currentBasePrice,
    weight: currentWeight,
    size: currentWeight, 
    selectedProductSize: currentWeight, 
    selectedVariation: selectedVariation,
    cartItemId: selectedVariation ? `${product.id}-${selectedVariation.weight}` : product.id
  };

  const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
      const media = window.matchMedia(query);
      setMatches(media.matches);
      const listener = () => setMatches(media.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [query]);
    return matches;
  };
  const isMobileOrTablet = useMediaQuery("(max-width: 768px)");

  const handleWishlistToggle = () => {
    if (isFav) {
      dispatch(deleteFromWishlist(product, addToast));
      setIsFav((prev) => !prev);
    } else {
      dispatch(addToWishlist(product, addToast));
      setIsFav((prev) => !prev);
    }
  };

  const handleAddToCartClick = () => {
    addToCart(productForCart,  related || [] , addToast, quantityCount);
  };

  return (
    <>
      <div className="product-details-content ml-70">
        <h2>
          {currentLanguageCode === "ar"
            ? product.translations[0]?.name
            : product.translations[1].name}
        </h2>
        
        {/* عرض السعر المتغير */}
        <div className="product-details-price">
          {product?.discount > 0 ? (
            <>
              <span className="new" style={{ direction: currentLanguageCode === "en" ? "ltr" : "rtl" }}>
                {currentDiscountPrice.toFixed(2)}
              </span>{" "}
              {strings["EG"]}
              <span className="old" style={{ textDecoration: "line-through", direction: currentLanguageCode === "en" ? "ltr" : "rtl", marginLeft: "5px" }}>
                {currentBasePrice.toFixed(2)} {strings["EG"]}
              </span>
            </>
          ) : (
            <span style={{ direction: currentLanguageCode === "en" ? "ltr" : "rtl" }}>
              {currentBasePrice.toFixed(2)} {strings["EG"]}
            </span>
          )}
        </div>

        {/* عرض تابات اختيار الوزن */}
        {parsedVariations.length > 0 && (
          <div className="pro-details-size-color" style={{ marginBottom: "25px" }}>
            <div className="pro-details-size">
              {/* عنوان يظهر الوزن المختار حالياً مترجم */}
              <span style={{ fontWeight: "bold", display: "block", marginBottom: "15px", color: "#333", fontSize: "16px" }}>
                {currentLanguageCode === "ar" ? "الوزن:" : "Weight:"} {formatDisplayWeight(selectedVariation?.weight || '')}
              </span>
              
              {/* حاوية التابات */}
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
                        direction: "ltr" // لضمان ظهور الأرقام صحيحة بجانب الحروف
                      }}
                    >
                      {/* عرض الكلمة مترجمة جوه الزرار */}
                      {formatDisplayWeight(varItem.weight)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="pro-details-list">
          <p>
            <span>{strings["weight"]}: </span>
            {formatDisplayWeight(currentWeight)}
          </p>
        </div>

        <div className="d-flex justify-content-center my-3">
          {icons?.map((icon, index) => (
            <div key={index} className="text-center mx-2">
              <img
                src={`https://admin.omdacoffee.com/ar/images/${icon?.icon}`}
                className="img-fluid"
                width={50}
                height={50}
                alt={
                  currentLanguageCode === "ar"
                    ? icon?.translations[0].name
                    : icon?.translations[1].name
                }
              />
              <p>
                {currentLanguageCode === "ar"
                  ? icon?.translations[0].name
                  : icon?.translations[1].name}
              </p>
            </div>
          ))}
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
                  {strings["addToCart"]}
                </button>
              ) : (
                <button disabled>{strings["outOfStock"]}</button>
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
                  style={{ color: isFav ? "red" : "inherit" }}
                />
              </button>
            </div>
          </div>
        )}
        <div className="">
          <button className="order-now" onClick={() => setModalShow(true)}>
            <span>{strings["order_now"]}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" viewBox="0 0 24 24" fill="#FFF">
              <path d="M0 0h24v24H0V0z" fill="none"></path>
              <path d="M15.55 13c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.37-.66-.11-1.48-.87-1.48H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"></path>
            </svg>
          </button>
        </div>

        {isMobileOrTablet && product?.cover_path && !product.cover_path.endsWith('/images/') && (
          <img
            src={product?.cover_path}
            alt="COVER"
            loading="lazy"
            style={{ marginBlock: "50px", width: "100%" }}
          />
        )}
      </div>
      
      <CheckoutModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={productForCart}
        products={[productForCart]}
        currentLanguageCode={currentLanguageCode}
        strings={strings}
        quantityCount={quantityCount}
      />
      
      <div className="sticky-toolbar">
        <div className="container-fluid">
          <div className="row align-items-center justify-content-center">
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
                    {strings["addToCart"]}
                  </button>
                ) : (
                  <button disabled>{strings["outOfStock"]}</button>
                )}
              </div>
            </div>
            <div className="col-auto d-flex flex-column gap-2">
              <span className="product-name">
                {currentLanguageCode === "ar"
                  ? product.translations[0]?.name
                  : product.translations[1].name}
              </span>
              <div>
                <span className="price" style={{ color: "#731b26", fontWeight: "bold", direction: currentLanguageCode === "en" ? "ltr" : "rtl" }}>
                  {currentDiscountPrice.toFixed(2)}{" "}
                </span>{" "}
                {strings["EG"]}
                {product?.discount > 0 && (
                  <span className="old" style={{ textDecoration: "line-through", direction: currentLanguageCode === "en" ? "ltr" : "rtl", marginLeft: "5px" }}>
                    {currentBasePrice.toFixed(2)} {strings["EG"]}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item, related, addToast, quantityCount) => {
      dispatch(addToCart(item, related, addToast, quantityCount));
    },
  };
};

export default connect(
  null,
  mapDispatchToProps
)(multilanguage(ProductDescriptionInfo));