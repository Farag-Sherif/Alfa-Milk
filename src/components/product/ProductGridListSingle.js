import React, { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { multilanguage } from "redux-multilanguage";
import { getIsFavoriteFromLocalStorage } from "../../helpers/Locale";
import {
  addToWishlist,
  deleteFromWishlist,
} from "../../redux/actions/wishlistActions";
import ProductModal from "./ProductModal";
import axiosInstance from "../../api/api"; // ✅ مهم

const ProductGridListSingle = ({
  product,
  currency,
  cartItem,
  sliderClassName,
  spaceBottomClass,
  currentLanguageCode,
  addToCart,
  strings,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // ✅ loading state
  const { addToast } = useToasts();
  const history = useHistory();
  const [isFav, setIsFav] = useState(
    product.is_favorite || getIsFavoriteFromLocalStorage(product),
  );
  const dispatch = useDispatch();

  const handleWishlistToggle = () => {
    if (isFav) {
      dispatch(deleteFromWishlist(product, addToast));
      setIsFav((prev) => !prev);
    } else {
      dispatch(addToWishlist(product, addToast));
      setIsFav((prev) => !prev);
    }
  };

  // ✅ الفانكشن الجديدة اللي بتجيب related ثم تضيف للسلة
  const handleAddToCart = async (product, addToast, quantity) => {
    setIsAddingToCart(true);
    try {
      const res = await axiosInstance.get(`/item/${product.slug}`);
      const fetchedRelated = res.data.related || [];
      addToCart(product, fetchedRelated, addToast, quantity);
    } catch (error) {
      console.error("Failed to fetch related products:", error);
      addToCart(product, [], addToast, quantity); // تضيف للسلة حتى لو فشل الـ fetch
    } finally {
      setIsAddingToCart(false);
    }
  };

  let parsedVariations = [];
  try {
    if (product?.variations) {
      parsedVariations =
        typeof product.variations === "string"
          ? JSON.parse(product.variations)
          : product.variations;
    }
  } catch (error) {}

  const hasVariations = parsedVariations && parsedVariations.length > 0;

  const displayPrice = hasVariations
    ? parseFloat(parsedVariations[0].price)
    : parseFloat(product?.price || 0);

  const discountedPrice =
    product?.discount > 0
      ? displayPrice - (displayPrice * product?.discount) / 100
      : null;

  return (
    <Fragment>
      <div
        className={`col-xl-4 col-sm-6 ${sliderClassName ? sliderClassName : ""}`}>
        <div
          className={`product-wrap ${spaceBottomClass ? spaceBottomClass : ""}`}>
          <div className="product-img">
            <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
              <img
                className="default-img"
                src={process.env.PUBLIC_URL + product.image_path}
                alt={product.name}
                loading="lazy"
                width={360}
                height={360}
                style={{ objectFit: "contain" }}
              />
            </Link>

            {product.discount ? (
              <div className="product-img-badges">
                <span className="pink" style={{ color: "#FFF" }}>
                  -{product.discount}%
                </span>
              </div>
            ) : (
              ""
            )}

            <div className="product-action">
              <div className="pro-same-action pro-wishlist">
                <button
                  className={!isFav ? "active" : ""}
                  title={!isFav ? "Added to wishlist" : "Add to wishlist"}
                  onClick={() => handleWishlistToggle()}>
                  <i
                    className={isFav ? "fa fa-heart" : "fa fa-heart-o"}
                    style={{ color: isFav ? "red" : "inherit" }}
                  />
                </button>
              </div>

              <div className="pro-same-action pro-cart">
                {hasVariations ? (
                  <button
                    onClick={() =>
                      history.push(
                        process.env.PUBLIC_URL + "/product/" + product.slug,
                      )
                    }
                    className="active">
                    <i className="fa fa-cog"></i>{" "}
                    {currentLanguageCode === "ar"
                      ? "اختر الوزن"
                      : "Select Option"}
                  </button>
                ) : product.is_available ? (
                  <button
                    onClick={() => handleAddToCart(product, addToast, 1)} // ✅ التعديل هنا
                    className={
                      cartItem !== undefined && cartItem?.quantity > 0
                        ? "active"
                        : ""
                    }
                    disabled={
                      isAddingToCart ||
                      (cartItem !== undefined && cartItem?.quantity > 0)
                    }
                    title={
                      cartItem !== undefined
                        ? strings["added_to_cart"] || "Added to cart"
                        : strings["add_to_cart"] || "Add to cart"
                    }>
                    <i className="pe-7s-cart"></i>{" "}
                    {isAddingToCart
                      ? "..." // ✅ loading
                      : cartItem !== undefined && cartItem?.quantity > 0
                        ? strings["added"] || "Added"
                        : strings["add_to_cart"] || "Add to cart"}
                  </button>
                ) : (
                  <button disabled className="active">
                    {strings["out_of_stock"] || "Out of Stock"}
                  </button>
                )}
              </div>

              <div className="pro-same-action pro-quickview">
                <button onClick={() => setModalShow(true)} title="Quick View">
                  <i className="pe-7s-look" />
                </button>
              </div>
            </div>
          </div>

          <div className="product-content text-center">
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                {currentLanguageCode === "ar"
                  ? product.translations[0]?.name
                  : product.translations[1]?.name}
              </Link>
            </h3>

            <div className="product-price">
              {discountedPrice !== null ? (
                <>
                  <span
                    style={{
                      direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                    }}>
                    <span style={{ textDecoration: "line-through" }}>
                      {displayPrice.toFixed(2)}
                    </span>
                    <span
                      style={{
                        color: "#731b26",
                        fontWeight: "bold",
                        marginLeft: "5px",
                        marginRight: "5px",
                      }}>
                      {discountedPrice.toFixed(2)}
                    </span>
                    {strings["EG"]}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    direction: currentLanguageCode === "en" ? "ltr" : "rtl",
                    color: "#731b26",
                    fontWeight: "bold",
                  }}>
                  {displayPrice.toFixed(2)} {strings["EG"]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* List View */}
        <div className="shop-list-wrap mb-30">
          <div className="row">
            <div className="col-xl-4 col-md-5 col-sm-6">
              <div className="product-list-image-wrap">
                <div className="product-img">
                  <Link
                    to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                    <img
                      className="default-img"
                      src={process.env.PUBLIC_URL + product.image_path}
                      alt={
                        currentLanguageCode === "ar"
                          ? product.translations[0]?.name
                          : product.translations[1]?.name
                      }
                      loading="lazy"
                      width={360}
                      height={360}
                    />
                  </Link>
                  {product.discount ? (
                    <div className="product-img-badges">
                      <span className="pink" style={{ color: "#FFF" }}>
                        -{product.discount}%
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>

            <div className="col-xl-8 col-md-7 col-sm-6">
              <div className="shop-list-content d-flex flex-column justify-content-between align-items-start h-100 pb-4">
                <h3>
                  <Link
                    to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                    {currentLanguageCode === "ar"
                      ? product.translations[0]?.name
                      : product.translations[1]?.name}
                  </Link>
                </h3>

                <div className="shop-list-price-wrap d-flex flex-column justify-content-between align-items-start">
                  <span
                    style={{
                      color: "#731b26",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}>
                    {discountedPrice !== null
                      ? discountedPrice.toFixed(2)
                      : displayPrice.toFixed(2)}{" "}
                    {strings["EG"]}{" "}
                    {currentLanguageCode === "ar" ? "ج م" : "EGP"}
                  </span>
                </div>

                <p>
                  <Link
                    to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                    {currentLanguageCode === "ar"
                      ? product.translations[0]?.description
                      : product.translations[1]?.description}
                  </Link>
                </p>

                <div className="shop-list-actions d-flex align-items-center">
                  <div className="shop-list-btn btn-hover">
                    {hasVariations ? (
                      <button
                        onClick={() =>
                          history.push(
                            process.env.PUBLIC_URL + "/product/" + product.slug,
                          )
                        }
                        className="active"
                        style={{
                          backgroundColor: "#731b26",
                          color: "#fff",
                          padding: "10px 20px",
                          border: "none",
                        }}>
                        {currentLanguageCode === "ar"
                          ? "اختر الوزن"
                          : "Select Option"}
                      </button>
                    ) : product.is_available ? (
                      <button
                        onClick={() => handleAddToCart(product, addToast, 1)} // ✅ التعديل هنا
                        className={
                          cartItem !== undefined && cartItem?.quantity > 0
                            ? "active"
                            : ""
                        }
                        disabled={
                          isAddingToCart ||
                          (cartItem !== undefined && cartItem?.quantity > 0)
                        }>
                        <i className="pe-7s-cart"></i>{" "}
                        {isAddingToCart
                          ? "..." // ✅ loading
                          : cartItem !== undefined && cartItem?.quantity > 0
                            ? strings["added"] || "Added"
                            : strings["add_to_cart"] || "Add to cart"}
                      </button>
                    ) : (
                      <button disabled className="active">
                        {strings["out_of_stock"] || "Out of Stock"}
                      </button>
                    )}
                  </div>

                  <div className="shop-list-wishlist ml-10">
                    <button
                      className={!isFav ? "active" : ""}
                      title={!isFav ? "Added to wishlist" : "Add to wishlist"}
                      onClick={() => handleWishlistToggle()}>
                      <i
                        className={isFav ? "fa fa-heart" : "fa fa-heart-o"}
                        style={{ color: isFav ? "red" : "inherit" }}
                      />
                    </button>
                  </div>
                </div>
              </div>
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
        cartitem={cartItem}
        addtowishlist={addToWishlist}
        addtoast={addToast}
        addToCart={addToCart}
        strings={strings}
        currentLanguageCode={currentLanguageCode}
      />
    </Fragment>
  );
};

export default multilanguage(ProductGridListSingle);
